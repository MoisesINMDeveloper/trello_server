"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = void 0;
const task_prisma_1 = __importDefault(require("../models/task.prisma"));
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener la información del usuario del middleware authenticateToken
        const user = res.locals.user;
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Obtener todas las tareas del usuario
        const userTasks = yield task_prisma_1.default.findMany({
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
        const userData = Object.assign(Object.assign({}, user), { tasks: userTasks.map((task) => (Object.assign(Object.assign({}, task), { comments: task.comments.map((comment) => (Object.assign(Object.assign({}, comment), { username: comment.user.username }))) }))) });
        // Enviar toda la información del usuario en la respuesta
        res.status(200).json(userData);
    }
    catch (error) {
        console.error("Error retrieving user data:", error);
        res.status(500).json({ error: "There was an error, try later" });
    }
});
exports.getUserData = getUserData;
