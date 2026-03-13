import "dotenv/config";
import { connectDB } from "../config/db.js";

const MAX_REPOS = 1000;

async function seedRepos() {
  try {
    const db = await connectDB();
    const collection = db.collection("trackedRepos"); // CHANGE COLLECTION NAME BEFORE POPULATING

    await collection.createIndex({ githubId: 1 }, { unique: true });

    const topics = [
      "react",
      "node",
      "javascript",
      "python",
      "machine-learning",
      "api",
      "web",
      "cli",
    ];

    const allRepos = [];

    for (const topic of topics) {
      for (let page = 1; page <= 5; page++) {
        const url =
          `https://api.github.com/search/repositories` +
          `?q=${topic}+stars:>50` +
          `&sort=stars&order=desc&per_page=30&page=${page}`;

        const response = await fetch(url, {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });

        const data = await response.json();

        for (const repo of data.items) {
          allRepos.push({
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
    }

    // remove duplicates
    const unique = new Map();

    for (const repo of allRepos) {
      unique.set(repo.githubId, repo);
    }

    const repos = Array.from(unique.values()).slice(0, MAX_REPOS);

    await collection.deleteMany({});

    await collection.insertMany(repos);

    console.log(`Inserted ${repos.length} repositories`);
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedRepos();
