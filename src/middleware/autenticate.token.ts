import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userPrisma from "../models/user.prisma";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await userPrisma.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      return res
        .status(403)
        .json({ error: "No tienes acceso a este recurso." });
    }
    // Almacenamos la información del usuario en res.locals para que esté disponible para los controladores
    res.locals.user = user;
    next();
  } catch (err) {
    console.log("Error en la autenticacion:", err);
    return res.status(403).json({ error: "No tienes acceso a este recurso." });
  }
};

export default authenticateToken;
