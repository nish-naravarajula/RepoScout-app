import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import profileRouter from "./routes/profileRoutes.js";

// TEST ROUTES: TO UPDATE AS WE PROGRESS
// import profileRoutes from "./routes/profileRoutes.js";
// import trackedRepoRoutes from "./routes/trackedRepoRoutes.js";
// import contributionRoutes from "./routes/contributionRoutes.js";
// import githubRoutes from "./routes/trackedRepoRoutes.js";

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

    // TEST ROUTES: TO UPDATE AS WE PROGRESS
    // app.use("/api/profiles", profileRoutes);
    // app.use("/api/tracked-repos", trackedRepoRoutes);
    // app.use("/api/contributions", contributionRoutes);
    // app.use("/api/github", githubRoutes);

    // TEMP test route for frontend
    app.get("/api/tracked-repos", (req, res) => {
      res.json([{ id: 1, name: "test-repo" }]);
    });

    app.use("/api/profile", profileRouter);

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
