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
exports.updateTaskStatus = exports.getAllTaskStatuses = exports.createTaskStatus = void 0;
const task_status_prisma_1 = __importDefault(require("../models/task.status.prisma"));
const task_prisma_1 = __importDefault(require("../models/task.prisma"));
const createTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const taskStatus = yield task_status_prisma_1.default.create({
            data: { name },
        });
        res.status(201).json(taskStatus);
    }
    catch (error) {
        console.error("Error creating task status:", error);
        res.status(500).json({ error: "Error creating task status" });
    }
});
exports.createTaskStatus = createTaskStatus;
const getAllTaskStatuses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskStatuses = yield task_status_prisma_1.default.findMany();
        res.status(200).json(taskStatuses);
    }
    catch (error) {
        console.error("Error retrieving task statuses:", error);
        res.status(500).json({ error: "Error retrieving task statuses" });
    }
});
exports.getAllTaskStatuses = getAllTaskStatuses;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.taskId);
    const { statusId } = req.body;
    if (!statusId) {
        res.status(400).json({ message: "Missing required field: statusId" });
        return;
    }
    try {
        const updatedTask = yield task_prisma_1.default.update({
            where: { id: taskId },
            data: { statusId },
        });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ error: "Error updating task status" });
    }
});
exports.updateTaskStatus = updateTaskStatus;
