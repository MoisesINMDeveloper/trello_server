import express from "express";

import {
  createComment,
  getCommentsByTaskId,
} from "../controllers/comment.controller";

const router = express.Router();

router.post("/", createComment);
router.get("/:id", getCommentsByTaskId);

export default router;
