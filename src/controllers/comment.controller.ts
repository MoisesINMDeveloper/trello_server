import { Request, Response } from "express";
import prismaComment from "../models/comment.prisma";
export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { content, taskId, userId } = req.body;
  if (!content || !taskId || !userId) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  try {
    const comment = await prismaComment.create({
      data: {
        content,
        taskId,
        userId,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Error creating comment" });
  }
};
export const getCommentsByTaskId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const taskId: number = parseInt(req.params.taskId);
  if (isNaN(taskId)) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }
  try {
    const comments = await prismaComment.findMany({
      where: { taskId },
      include: { user: true },
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ error: "Error retrieving comments" });
  }
};
