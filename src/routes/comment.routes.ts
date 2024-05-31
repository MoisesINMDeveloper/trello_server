import express from "express";

import {
  createComment,
  getCommentsByTaskId,
  deleteCommentById,
} from "../controllers/comment.controller";

const router = express.Router();

router.post("/", createComment);
router.get("/:id", getCommentsByTaskId);
router.delete("/:commentId", deleteCommentById);

export default router;
