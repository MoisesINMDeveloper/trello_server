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
      return;
    }

    // Obtener todas las tareas del usuario
    const userTasks = await prismaTask.findMany({
      where: { userId: user.id },
      include: {
        comments: {
          include: {
            user: {
              // Incluir el usuario asociado a cada comentario
              select: {
                username: true, // Solo seleccionar el username
              },
            },
          },
        },
        status: true,
      },
    });

    // Eliminar la contraseña del usuario de la respuesta
    delete user.password;

    // Crear un objeto que contenga toda la información del usuario y sus tareas con comentarios
    const userData = {
      ...user,
      tasks: userTasks.map((task) => ({
        ...task,
        comments: task.comments.map((comment) => ({
          ...comment,
          username: comment.user.username, // Añadir el username del usuario a cada comentario
        })),
      })),
    };

    // Enviar toda la información del usuario en la respuesta
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).json({ error: "There was an error, try later" });
  }
};
