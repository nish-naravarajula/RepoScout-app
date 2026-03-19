import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";

const authRouter = express.Router();

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Create a new user account + initial profile.
 */
authRouter.post("/register", async (req, res) => {
  try {
    const db = req.db;
    const { username, password, firstName, lastName, languages, tools, databases } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if username already exists
    const existing = await db.collection("users").findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      username,
      password: hashedPassword,
      firstName: firstName || "",
      lastName: lastName || "",
      profileImage: "",
      languages: Array.isArray(languages) ? languages : [],
      tools: Array.isArray(tools) ? tools : [],
      databases: Array.isArray(databases) ? databases : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    // Auto-login after registration
    const user = await db.collection("users").findOne({ _id: result.insertedId });

    req.login(user, (err) => {
      if (err) {
        console.error("Auto-login error:", err);
        return res.status(201).json({ message: "Registered successfully. Please log in." });
      }

      const { password: _, ...safeUser } = user;
      return res.status(201).json(safeUser);
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

/**
 * POST /api/auth/login
 * Log in with username and password.
 */
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Login failed" });
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || "Invalid credentials" });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ message: "Login failed" });
      }

      const { password: _, ...safeUser } = user;
      return res.json(safeUser);
    });
  })(req, res, next);
});

/**
 * POST /api/auth/logout
 */
authRouter.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out" });
    });
  });
});

/**
 * GET /api/auth/me
 * Return the current logged-in user (without password).
 */
authRouter.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { password: _, ...safeUser } = req.user;
  return res.json(safeUser);
});

export default authRouter;