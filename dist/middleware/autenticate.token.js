"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
// Logica para verificar si estamos autenticados
const autenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No autorizado" });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Error en la autenticacion:", err);
            return res
                .status(403)
                .json({ error: "No tienes acceso a este recurso." });
        } // Si el token es válido, llamamos a next() para continuar con la ejecución
        next();
    });
};
exports.default = autenticateToken;
