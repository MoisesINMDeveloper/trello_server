import express from "express";

import {
  createComment,
  getCommentsByTaskId,
  deleteCommentById,
  updateCommentById,
} from "../controllers/comment.controller";

const router = express.Router();

router.post("/", createComment);
router.get("/:id", getCommentsByTaskId);
router.delete("/:commentId", deleteCommentById);
router.put("/:commentId", updateCommentById);
export default router;
