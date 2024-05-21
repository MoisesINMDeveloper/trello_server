import { Request, Response } from "express";
import prismaTask from "../models/task.prisma"; // Asegúrate de que este sea el camino correcto a tu instancia de Prisma Client
import prismaComment from "../models/comment.prisma";

// Utilidades para eliminar la contraseña
const removePasswordFromUser = (user: any) => {
  if (user && user.password) {
    delete user.password;
  }
  return user;
};

const removePasswordFromTask = (task: any) => {
  if (task.user) {
    task.user = removePasswordFromUser(task.user);
  }
  if (task.comments) {
    task.comments = task.comments.map((comment: any) => {
      if (comment.user) {
        comment.user = removePasswordFromUser(comment.user);
      }
      return comment;
    });
  }
  return task;
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, statusId, userId, comments } = req.body;
    if (!title || !statusId || !userId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const taskData = {
      title,
      description,
      statusId,
      userId,
      comments: comments
        ? {
            create: comments.map(
              (comment: { content: string; userId: number }) => ({
                content: comment.content,
                userId: comment.userId,
              })
            ),
          }
        : undefined,
    };

    const task = await prismaTask.create({
      data: taskData,
      include: {
        user: true,
        status: true,
        comments: true,
      },
    });

    res.status(201).json(removePasswordFromTask(task));
  } catch (error) {
    console.error("Error creating task: ", error);
    res.status(500).json({
      error: "Error creating task",
    });
  }
};

export const getAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tasks = await prismaTask.findMany({
      include: {
        user: true,
        status: true,
        comments: true,
      },
    });

    const tasksWithoutPasswords = tasks.map(removePasswordFromTask);
    res.status(200).json(tasksWithoutPasswords);
  } catch (error) {
    console.error("Error retrieving tasks: ", error);
    res.status(500).json({
      error: "Error retrieving tasks",
    });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const taskId: number = parseInt(req.params.id);
  try {
    const task = await prismaTask.findUnique({
      where: { id: taskId },
      include: {
        user: true,
        status: true,
        comments: true,
      },
    });
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json(removePasswordFromTask(task));
  } catch (error) {
    console.error("Error retrieving task: ", error);
    res.status(500).json({
      error: "Error retrieving task",
    });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const taskId: number = parseInt(req.params.id);
  const { title, description, statusId, userId, comments } = req.body;
  try {
    let dataToUpdate: any = {};

    if (title) dataToUpdate.title = title;
    if (description) dataToUpdate.description = description;
    if (statusId) dataToUpdate.statusId = statusId;
    if (userId) dataToUpdate.userId = userId;
    if (comments) {
      dataToUpdate.comments = {
        deleteMany: { taskId },
        create: comments.map(
          (comment: { content: string; userId: number }) => ({
            content: comment.content,
            userId: comment.userId,
          })
        ),
      };
    }

    const updatedTask = await prismaTask.update({
      where: { id: taskId },
      data: dataToUpdate,
      include: {
        user: true,
        status: true,
        comments: true,
      },
    });

    res.status(200).json(removePasswordFromTask(updatedTask));
  } catch (error) {
    console.error("Error updating task: ", error);
    res.status(500).json({
      error: "Error updating task",
    });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const taskId: number = parseInt(req.params.id);
  try {
    await prismaComment.deleteMany({ where: { taskId } }); // Primero elimina los comentarios relacionados
    await prismaTask.delete({ where: { id: taskId } });
    res.status(200).json({ message: `The task ${taskId} has been deleted` });
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ error: "Task not found" });
    } else {
      console.error("Error deleting task: ", error);
      res.status(500).json({
        error: "Error deleting task",
      });
    }
  }
};
