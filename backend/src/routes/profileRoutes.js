import express from "express";

const profileRouter = express.Router();

// GET current user's profile
profileRouter.get("/", async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user._id;

    const profile = await db.collection("users").findOne({ _id: userId });

    if (!profile) {
      return res.status(404).json({ message: "No profile found" });
    }

    const { password: _, ...safeProfile } = profile;
    return res.status(200).json(safeProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// UPDATE current user's profile
profileRouter.put("/", async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user._id;

    const {
      firstName,
      lastName,
      username,
      profileImage,
      languages,
      tools,
      databases,
    } = req.body;

    const profileData = {
      firstName: firstName || "",
      lastName: lastName || "",
      username: username || "",
      profileImage: profileImage || "",
      languages: Array.isArray(languages) ? languages : [],
      tools: Array.isArray(tools) ? tools : [],
      databases: Array.isArray(databases) ? databases : [],
      updatedAt: new Date(),
    };

    await db
      .collection("users")
      .updateOne({ _id: userId }, { $set: profileData });

    const updatedProfile = await db
      .collection("users")
      .findOne({ _id: userId });

    const { password: _, ...safeProfile } = updatedProfile;
    return res.status(200).json(safeProfile);
  } catch (error) {
    console.error("Error saving profile:", error);
    return res.status(500).json({ message: "Failed to save profile" });
  }
});

// DELETE current user's account and all their data
profileRouter.delete("/", async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user._id;
    const userIdStr = userId.toString();

    // Delete user's tracked repos
    await db.collection("userTrackedRepos").deleteMany({ userId: userIdStr });

    // Delete the user document
    await db.collection("users").deleteOne({ _id: userId });

    // Log out and destroy session
    req.logout((err) => {
      if (err) {
        console.error("Logout error after delete:", err);
      }
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Account deleted successfully" });
      });
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res.status(500).json({ message: "Failed to delete profile" });
  }
});

// DELETE only the image
profileRouter.delete("/image", async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user._id;

    await db.collection("users").updateOne(
      { _id: userId },
      {
        $set: {
          profileImage: "",
          updatedAt: new Date(),
        },
      },
    );

    const updatedProfile = await db
      .collection("users")
      .findOne({ _id: userId });

    const { password: _, ...safeProfile } = updatedProfile;
    return res.status(200).json(safeProfile);
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ message: "Failed to delete image" });
  }
});

export default profileRouter;