import { Request, Response } from "express";

import prismaTaskStatus from "../models/task.status.prisma";
import taskPrisma from "../models/task.prisma";
export const createTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  try {
    const taskStatus = await prismaTaskStatus.create({
      data: { name },
    });
    res.status(201).json(taskStatus);
  } catch (error) {
    console.error("Error creating task status:", error);
    res.status(500).json({ error: "Error creating task status" });
  }
};
export const getAllTaskStatuses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskStatuses = await prismaTaskStatus.findMany();
    res.status(200).json(taskStatuses);
  } catch (error) {
    console.error("Error retrieving task statuses:", error);
    res.status(500).json({ error: "Error retrieving task statuses" });
  }
};
export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const taskId: number = parseInt(req.params.taskId);
  const { statusId } = req.body;
  if (!statusId) {
    res.status(400).json({ message: "Missing required field: statusId" });
    return;
  }
  try {
    const updatedTask = await taskPrisma.update({
      where: { id: taskId },
      data: { statusId },
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Error updating task status" });
  }
};
