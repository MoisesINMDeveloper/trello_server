import { Request, Response } from "express";
import userPrisma from "../models/user.prisma";
import { hashPassword } from "../services/password.service";
import { generateToken } from "../services/auth.service";
import { User } from "../types/user.interface";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, name, email, password, verified } = req.body;
    if (!username || !name || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const hashedPassword: string = await hashPassword(password);
    const userData = {
      username,
      name,
      email,
      password: hashedPassword,
      verified,
    };
    const user = await userPrisma.create({
      data: userData,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userPrisma.findMany();
    const usersWithoutPassword = users.map((user: User) => ({
      ...user,
      token: user.verified ? generateToken(user) : undefined,
      password: undefined, // Asegúrate de que la contraseña no se incluya en la respuesta
    }));
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "There was an error, try later" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId: number = parseInt(req.params.id);
  try {
    const user = await userPrisma.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const userWithoutPassword = {
      ...user,
      token: user.verified ? generateToken(user) : undefined,
      password: undefined,
    };
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "There was an error, try later" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId: number = parseInt(req.params.id);
  const { username, name, email, password, verified } = req.body;
  try {
    let dataToUpdate: any = {};

    if (username) dataToUpdate.username = username;
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) {
      const hashedPassword = await hashPassword(password);
      dataToUpdate.password = hashedPassword;
    }
    if (verified !== undefined) dataToUpdate.verified = verified;

    const updatedUser = await userPrisma.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ error: "The email entered already exists" });
    } else if (error?.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "There was an error, try later" });
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId: number = parseInt(req.params.id);
  try {
    await userPrisma.delete({ where: { id: userId } });
    res.status(200).json({ message: `The user ${userId} has been deleted` });
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "There was an error, try later" });
    }
  }
};
