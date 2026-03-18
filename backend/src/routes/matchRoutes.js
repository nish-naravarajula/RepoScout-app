import express from "express";

const matchRouter = express.Router();

// Simple in-memory cache: { key: { data, timestamp } }
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch repos from GitHub for a single search term.
 * Returns an array of normalized repo objects.
 */
async function fetchGitHubRepos(term, token) {
  const url =
    `https://api.github.com/search/repositories` +
    `?q=${encodeURIComponent(term)}+stars:>100` +
    `&sort=stars&order=desc&per_page=20`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    console.error(`GitHub API ${response.status} for "${term}"`);
    return [];
  }

  const data = await response.json();
  const items = Array.isArray(data) ? data : (data.items ?? []);

  return items.map((repo) => ({
    githubId: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner.login,
    description: repo.description,
    url: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    topics: repo.topics || [],
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
  }));
}

/**
 * GET /api/match
 *
 * Hybrid matching: seeded MongoDB repos + live GitHub API results
 * based on profile languages/tools. Parallel fetches + caching.
 */
matchRouter.get("/", async (req, res) => {
  try {
    const db = req.db;

    // 1. Get user profile
    const profile = await db.collection("users").findOne({});
    if (!profile) {
      return res.status(404).json({ message: "No profile found" });
    }

    // 2. Get seeded repos from MongoDB
    const seededRepos = await db.collection("repos").find({}).toArray();

    // 3. Build search terms from profile, fetch in parallel with caching
    const searchTerms = [
      ...(profile.languages || []),
      ...(profile.tools || []),
    ].slice(0, 5);

    let liveRepos = [];

    if (process.env.GITHUB_TOKEN && searchTerms.length > 0) {
      const cacheKey = searchTerms.sort().join(",");
      const cached = getCached(cacheKey);

      if (cached) {
        liveRepos = cached;
      } else {
        // Fetch all terms in parallel
        const results = await Promise.all(
          searchTerms.map((term) =>
            fetchGitHubRepos(term, process.env.GITHUB_TOKEN),
          ),
        );
        liveRepos = results.flat();
        setCache(cacheKey, liveRepos);
      }
    }

    // 4. Merge and deduplicate
    const repoMap = new Map();
    for (const repo of seededRepos) {
      repoMap.set(repo.githubId, repo);
    }
    for (const repo of liveRepos) {
      if (!repoMap.has(repo.githubId)) {
        repoMap.set(repo.githubId, repo);
      }
    }

    return res.json(Array.from(repoMap.values()));
  } catch (error) {
    console.error("Match route error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default matchRouter;