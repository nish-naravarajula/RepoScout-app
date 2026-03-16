import express from "express";

const profileRouter = express.Router();

// GET current profile
profileRouter.get("/", async (req, res) => {
  try {
    const db = req.db;
    const profile = await db.collection("users").findOne({});

    if (!profile) {
      return res.status(404).json({
        message: "No profile found",
      });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
});

// CREATE or REPLACE entire profile
profileRouter.put("/", async (req, res) => {
  try {
    const db = req.db;

    const {
      firstName,
      lastName,
      username,
      readme,
      profileImage,
      languages,
      tools,
      databases,
    } = req.body;

    const existingProfile = await db.collection("users").findOne({});

    const profileData = {
      firstName: firstName || "",
      lastName: lastName || "",
      username: username || "",
      readme: readme || "",
      profileImage: profileImage || "",
      languages: Array.isArray(languages) ? languages : [],
      tools: Array.isArray(tools) ? tools : [],
      databases: Array.isArray(databases) ? databases : [],
      updatedAt: new Date(),
    };

    if (!existingProfile) {
      const newProfile = {
        ...profileData,
        createdAt: new Date(),
      };

      const result = await db.collection("users").insertOne(newProfile);

      const createdProfile = await db.collection("users").findOne({
        _id: result.insertedId,
      });

      return res.status(201).json(createdProfile);
    }

    await db
      .collection("users")
      .updateOne({ _id: existingProfile._id }, { $set: profileData });

    const updatedProfile = await db.collection("users").findOne({
      _id: existingProfile._id,
    });

    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error saving profile:", error);
    return res.status(500).json({
      message: "Failed to save profile",
    });
  }
});

// DELETE the whole profile
profileRouter.delete("/", async (req, res) => {
  try {
    const db = req.db;
    const existingProfile = await db.collection("users").findOne({});

    if (!existingProfile) {
      return res.status(404).json({
        message: "No profile found to delete",
      });
    }

    await db.collection("users").deleteOne({
      _id: existingProfile._id,
    });

    return res.status(200).json({
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res.status(500).json({
      message: "Failed to delete profile",
    });
  }
});

// DELETE only the image
profileRouter.delete("/image", async (req, res) => {
  try {
    const db = req.db;
    const existingProfile = await db.collection("users").findOne({});

    if (!existingProfile) {
      return res.status(404).json({
        message: "No profile found",
      });
    }

    await db.collection("users").updateOne(
      { _id: existingProfile._id },
      {
        $set: {
          profileImage: "",
          updatedAt: new Date(),
        },
      },
    );

    const updatedProfile = await db.collection("users").findOne({
      _id: existingProfile._id,
    });

    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({
      message: "Failed to delete image",
    });
  }
});

export default profileRouter;
