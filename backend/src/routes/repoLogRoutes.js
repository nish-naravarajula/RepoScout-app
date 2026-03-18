import express from "express";
import {
  createRepoLog,
  getRepoLogs,
  getRepoLogById,
  updateRepoLog,
  deleteRepoLog,
} from "../controllers/repoLogController.js";

const router = express.Router();

router.post("/", createRepoLog);
router.get("/", getRepoLogs);
router.get("/:id", getRepoLogById);
router.put("/:id", updateRepoLog);
router.delete("/:id", deleteRepoLog);

export default router;
