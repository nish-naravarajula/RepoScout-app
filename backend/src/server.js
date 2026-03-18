import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import profileRouter from "./routes/profileRoutes.js";
import trackedRepoRouter from "./routes/trackedRepoRoutes.js";
import matchRouter from "./routes/matchRoutes.js";
import repoLogRouter from "./routes/repoLogRoutes.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
  try {
    // connect to MongoDB
    const db = await connectDB();

    // attach db to every request
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use("/api/profile", profileRouter);
    app.use("/api/tracked-repos", trackedRepoRouter);
    app.use("/api/match", matchRouter);
    app.use("/api/repo-logs", repoLogRouter);

    // test route
    app.get("/", (req, res) => {
      res.send("RepoScout backend is running");
    });

    // start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
