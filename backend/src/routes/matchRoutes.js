import express from "express";

const matchRouter = express.Router();

/**
 * GET /api/match
 *
 * Hybrid matching: pulls seeded repos from MongoDB AND supplements with
 * live GitHub API results based on the user's profile languages/tools.
 * Returns the combined, deduplicated set for the frontend to score.
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
    const seededRepos = await db
      .collection("repos")
      .find({})
      .limit(1000)
      .toArray();

    // 3. Build GitHub search queries from profile
    const searchTerms = [
      ...(profile.languages || []),
      ...(profile.tools || []),
    ];

    let liveRepos = [];

    if (process.env.GITHUB_TOKEN && searchTerms.length > 0) {
      // Take up to 3 terms to avoid rate limits
      const terms = searchTerms.slice(0, 3);

      for (const term of terms) {
        try {
          const url =
            `https://api.github.com/search/repositories` +
            `?q=${encodeURIComponent(term)}+stars:>100` +
            `&sort=stars&order=desc&per_page=20`;

          const response = await fetch(url, {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          });

          if (response.ok) {
            const data = await response.json();
            const items = Array.isArray(data) ? data : (data.items ?? []);

            for (const repo of items) {
              liveRepos.push({
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
              });
            }
          }
        } catch (err) {
          console.error(`GitHub API error for term "${term}":`, err.message);
        }
      }
    }

    // 4. Merge and deduplicate (seeded repos take priority)
    const repoMap = new Map();

    for (const repo of seededRepos) {
      repoMap.set(repo.githubId, repo);
    }

    for (const repo of liveRepos) {
      if (!repoMap.has(repo.githubId)) {
        repoMap.set(repo.githubId, repo);
      }
    }

    const combined = Array.from(repoMap.values());

    return res.json(combined);
  } catch (error) {
    console.error("Match route error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default matchRouter;