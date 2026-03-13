// OPTIONAL: THIS FILE IS FOR  USEFUL IF WE WANT A FEATURE THAT SEARCHES FOR THE REPOS
import express from "express";

const router = express.Router();

/*
GET /api/github/search
Search GitHub repositories
*/
router.get("/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const language = String(req.query.language || "").trim();

    if (q === "") {
      return res.status(400).json({ error: "Query is required" });
    }

    let githubQuery = q;

    if (language !== "") {
      githubQuery += ` language:${language}`;
    }

    githubQuery += " stars:>50";

    const url =
      `https://api.github.com/search/repositories` +
      `?q=${encodeURIComponent(githubQuery)}` +
      `&sort=stars&order=desc&per_page=10`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const data = await response.json();

    const repos = data.items.map((repo) => ({
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

    res.json(repos);
  } catch (error) {
    console.error("GitHub search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
