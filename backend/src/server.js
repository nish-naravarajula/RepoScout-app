import "dotenv/config";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { connectDB } from "./config/db.js";
import { configurePassport } from "./config/passport.js";
import authRouter from "./routes/authRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import trackedRepoRouter from "./routes/trackedRepoRoutes.js";
import matchRouter from "./routes/matchRoutes.js";
import repoLogRouter from "./routes/repoLogRoutes.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
  try {
    const db = await connectDB();

    // Session store in MongoDB
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "reposcout-dev-secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
          dbName: process.env.DB_NAME,
          collectionName: "sessions",
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          httpOnly: true,
          secure: false, // set to true in production with HTTPS
        },
      }),
    );

    // Passport
    configurePassport(db);
    app.use(passport.initialize());
    app.use(passport.session());

    // Attach db to every request
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // Public routes (no auth required)
    app.use("/api/auth", authRouter);

    // Protected routes (require login)
    app.use("/api/profile", requireAuth, profileRouter);
    app.use("/api/tracked-repos", requireAuth, trackedRepoRouter);
    app.use("/api/match", requireAuth, matchRouter);
    app.use("/api/repo-logs", requireAuth, repoLogRouter);

    app.get("/", (req, res) => {
      res.send("RepoScout backend is running");
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();