import express from "express";
import autenticateToken from "../middleware/autenticate.token";
import {
  createTask,
  deleteTask,
  updateTask,
  getAllTasks,
  getTaskById,
} from "../controllers/task.controller";

const router = express.Router();

router.post("/", autenticateToken, createTask);
router.get("/", autenticateToken, getAllTasks);
router.get("/:id", autenticateToken, getTaskById);
router.put("/:id", autenticateToken, updateTask);
router.delete("/:id", autenticateToken, deleteTask);

export default router;
