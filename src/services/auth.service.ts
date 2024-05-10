import jwt from "jsonwebtoken";
import { User } from "../types/user.interface";
const JWT_SECRET = process.env.JWT_SECRET || "defautl-secret";

export const generateToken = (user: User): string => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
};
