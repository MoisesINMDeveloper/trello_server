import express from "express";

import {
  createComment,
  deleteCommentById,
  getCommentsByTaskId,
} from "../controllers/comment.controller";

const router = express.Router();

router.post("/", createComment);
router.get("/:id", getCommentsByTaskId);
router.delete("/:id", deleteCommentById);

export default router;
