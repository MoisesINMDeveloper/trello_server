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
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const task_prisma_1 = __importDefault(require("../models/task.prisma")); // Asegúrate de que este sea el camino correcto a tu instancia de Prisma Client
const comment_prisma_1 = __importDefault(require("../models/comment.prisma"));
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                    create: comments.map((comment) => ({
                        content: comment.content,
                        userId: comment.userId,
                    })),
                }
                : undefined,
        };
        const task = yield task_prisma_1.default.create({
            data: taskData,
            include: {
                user: true,
                status: true,
                comments: true,
            },
        });
        res.status(201).json(task);
    }
    catch (error) {
        console.error("Error creating task: ", error);
        res.status(500).json({
            error: "Error creating task",
        });
    }
});
exports.createTask = createTask;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_prisma_1.default.findMany({
            include: {
                user: true,
                status: true,
                comments: true,
            },
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error("Error retrieving tasks: ", error);
        res.status(500).json({
            error: "Error retrieving tasks",
        });
    }
});
exports.getAllTasks = getAllTasks;
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.id);
    try {
        const task = yield task_prisma_1.default.findUnique({
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
        res.status(200).json(task);
    }
    catch (error) {
        console.error("Error retrieving task: ", error);
        res.status(500).json({
            error: "Error retrieving task",
        });
    }
});
exports.getTaskById = getTaskById;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.id);
    const { title, description, statusId, userId, comments } = req.body;
    try {
        let dataToUpdate = {};
        if (title)
            dataToUpdate.title = title;
        if (description)
            dataToUpdate.description = description;
        if (statusId)
            dataToUpdate.statusId = statusId;
        if (userId)
            dataToUpdate.userId = userId;
        if (comments) {
            dataToUpdate.comments = {
                deleteMany: { taskId },
                create: comments.map((comment) => ({
                    content: comment.content,
                    userId: comment.userId,
                })),
            };
        }
        const updatedTask = yield task_prisma_1.default.update({
            where: { id: taskId },
            data: dataToUpdate,
            include: {
                user: true,
                status: true,
                comments: true,
            },
        });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        console.error("Error updating task: ", error);
        res.status(500).json({
            error: "Error updating task",
        });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.id);
    try {
        yield comment_prisma_1.default.deleteMany({ where: { taskId } }); // Primero elimina los comentarios relacionados
        yield task_prisma_1.default.delete({ where: { id: taskId } });
        res.status(200).json({ message: `The task ${taskId} has been deleted` });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === "P2025") {
            res.status(404).json({ error: "Task not found" });
        }
        else {
            console.error("Error deleting task: ", error);
            res.status(500).json({
                error: "Error deleting task",
            });
        }
    }
});
exports.deleteTask = deleteTask;
