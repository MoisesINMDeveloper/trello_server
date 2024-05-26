import { Request, Response } from "express";
import prismaTask from "../models/task.prisma";

export const getUserData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Obtener la información del usuario del middleware authenticateToken
    const user = res.locals.user;
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    // Obtener todas las tareas del usuario
    const userTasks = await prismaTask.findMany({
      where: { userId: user.id },
      include: {
        comments: true,
        // user: true,
        status: true,
      },
    });

    // Eliminar la contraseña del usuario de la respuesta
    delete user.password;

    // Crear un objeto que contenga toda la información del usuario y sus tareas con comentarios
    const userData = {
      ...user,
      tasks: userTasks,
    };

    // Enviar toda la información del usuario en la respuesta
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).json({ error: "There was an error, try later" });
  }
};
