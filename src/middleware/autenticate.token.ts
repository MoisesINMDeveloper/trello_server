import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
// Logica para verificar si estamos autenticados
const autenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Error en la autenticacion:", err);
      return res
        .status(403)
        .json({ error: "No tienes acceso a este recurso." });
    } // Si el token es válido, llamamos a next() para continuar con la ejecución
    next();
  });
};
export default autenticateToken;
