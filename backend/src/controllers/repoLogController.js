import { ObjectId } from "mongodb";

export async function createRepoLog(req, res) {
  try {
    const db = req.db;

    const { repoName, date, focusArea, filesModified, bugsFixed, learned } =
      req.body;

    if (
      repoName === undefined ||
      date === undefined ||
      focusArea === undefined ||
      filesModified === undefined ||
      bugsFixed === undefined ||
      learned === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const newRepoLog = {
      repoName,
      date,
      focusArea,
      filesModified,
      bugsFixed,
      learned,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("repoLogs").insertOne(newRepoLog);

    const savedLog = await db.collection("repoLogs").findOne({
      _id: result.insertedId,
    });

    return res.status(201).json(savedLog);
  } catch (error) {
    console.error("Error creating repo log:", error);
    return res.status(500).json({
      message: "Failed to create repo log.",
    });
  }
}

export async function getRepoLogs(req, res) {
  try {
    const db = req.db;
    const { repoName } = req.query;

    const query = {};

    if (repoName) {
      query.repoName = repoName;
    }

    const logs = await db
      .collection("repoLogs")
      .find(query)
      .sort({ date: -1, createdAt: -1 })
      .toArray();

    return res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching repo logs:", error);
    return res.status(500).json({
      message: "Failed to fetch repo logs.",
    });
  }
}

export async function getRepoLogById(req, res) {
  try {
    const db = req.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid repo log id.",
      });
    }

    const log = await db.collection("repoLogs").findOne({
      _id: new ObjectId(id),
    });

    if (!log) {
      return res.status(404).json({
        message: "Repo log not found.",
      });
    }

    return res.status(200).json(log);
  } catch (error) {
    console.error("Error fetching repo log by id:", error);
    return res.status(500).json({
      message: "Failed to fetch repo log.",
    });
  }
}

export async function updateRepoLog(req, res) {
  try {
    const db = req.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid repo log id.",
      });
    }

    const { repoName, date, focusArea, filesModified, bugsFixed, learned } =
      req.body;

    const updatedFields = {
      updatedAt: new Date(),
    };

    if (repoName !== undefined) {
      updatedFields.repoName = repoName;
    }

    if (date !== undefined) {
      updatedFields.date = date;
    }

    if (focusArea !== undefined) {
      updatedFields.focusArea = focusArea;
    }

    if (filesModified !== undefined) {
      updatedFields.filesModified = filesModified;
    }

    if (bugsFixed !== undefined) {
      updatedFields.bugsFixed = bugsFixed;
    }

    if (learned !== undefined) {
      updatedFields.learned = learned;
    }

    const result = await db
      .collection("repoLogs")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedFields },
        { returnDocument: "after" },
      );

    if (!result) {
      return res.status(404).json({
        message: "Repo log not found.",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating repo log:", error);
    return res.status(500).json({
      message: "Failed to update repo log.",
    });
  }
}

export async function deleteRepoLog(req, res) {
  try {
    const db = req.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid repo log id.",
      });
    }

    const result = await db.collection("repoLogs").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Repo log not found.",
      });
    }

    return res.status(200).json({
      message: "Repo log deleted successfully.",
      deletedLogId: id,
    });
  } catch (error) {
    console.error("Error deleting repo log:", error);
    return res.status(500).json({
      message: "Failed to delete repo log.",
    });
  }
}
