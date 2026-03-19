import express from "express";

const router = express.Router();

/**
 * GET /api/tracked-repos
 * Return ALL seeded repos from the "repos" collection (public data).
 */
router.get("/", async (req, res) => {
  try {
    const repos = await req.db.collection("repos").find({}).toArray();
    res.json(repos);
  } catch (error) {
    console.error("Error fetching repos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/tracked-repos/user
 * Return repos the current user has tracked.
 */
router.get("/user", async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const tracked = await req.db
      .collection("userTrackedRepos")
      .find({ userId })
      .sort({ trackedAt: -1 })
      .toArray();

    res.json(tracked);
  } catch (error) {
    console.error("Error fetching user tracked repos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/tracked-repos/user
 */
router.post("/user", async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const {
      githubId, name, fullName, owner, description,
      url, language, stars, forks, openIssues, topics,
    } = req.body;

    if (!githubId || !name) {
      return res.status(400).json({ error: "githubId and name are required" });
    }

    const existing = await req.db
      .collection("userTrackedRepos")
      .findOne({ userId, githubId });

    if (existing) {
      return res.status(409).json({ error: "Repo is already tracked" });
    }

    const trackedRepo = {
      userId,
      githubId,
      name,
      fullName: fullName || "",
      owner: owner || "",
      description: description || "",
      url: url || "",
      language: language || "",
      stars: stars || 0,
      forks: forks || 0,
      openIssues: openIssues || 0,
      topics: Array.isArray(topics) ? topics : [],
      trackedAt: new Date(),
    };

    const result = await req.db
      .collection("userTrackedRepos")
      .insertOne(trackedRepo);

    const saved = await req.db
      .collection("userTrackedRepos")
      .findOne({ _id: result.insertedId });

    res.status(201).json(saved);
  } catch (error) {
    console.error("Error tracking repo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/tracked-repos/user/:githubId
 */
router.delete("/user/:githubId", async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const githubId = Number(req.params.githubId);

    const result = await req.db
      .collection("userTrackedRepos")
      .deleteOne({ userId, githubId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Tracked repo not found" });
    }

    res.json({ message: "Repo untracked successfully" });
  } catch (error) {
    console.error("Error untracking repo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;