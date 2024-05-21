import express from "express";
import {
  createTaskStatus,
  getAllTaskStatuses,
  updateTaskStatus,
} from "../controllers/task.status.controller";

const router = express.Router();

router.post("/", createTaskStatus);
router.get("/", getAllTaskStatuses);
router.put("/:id", updateTaskStatus);
export default router;
