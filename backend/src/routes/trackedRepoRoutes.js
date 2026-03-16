import express from "express";

const router = express.Router();

/*
GET /api/tracked-repos
Return repos stored in MongoDB
*/
router.get("/", async (req, res) => {
  try {
    const repos = await req.db
      .collection("repos")
      .find({})
      .limit(50)
      .toArray();

    res.json(repos);
  } catch (error) {
    console.error("Error fetching repos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
