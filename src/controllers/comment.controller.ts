import { Request, Response } from "express";
import prismaComment from "../models/comment.prisma";

// Crear un comentario
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

// Obtener comentarios por ID de tarea
export const getCommentsByTaskId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const taskId: number = parseInt(req.params.id);
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

// Eliminar comentario por ID
export const deleteCommentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const commentId: number = parseInt(req.params.commentId);
  if (isNaN(commentId)) {
    res.status(400).json({ error: "Invalid comment ID" });
    return;
  }
  try {
    await prismaComment.delete({
      where: { id: commentId },
    });
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Error deleting comment" });
  }
};
