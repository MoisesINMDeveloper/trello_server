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
exports.getCommentsByTaskId = exports.createComment = void 0;
const comment_prisma_1 = __importDefault(require("../models/comment.prisma"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, taskId, userId } = req.body;
    if (!content || !taskId || !userId) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const comment = yield comment_prisma_1.default.create({
            data: {
                content,
                taskId,
                userId,
            },
        });
        res.status(201).json(comment);
    }
    catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Error creating comment" });
    }
});
exports.createComment = createComment;
const getCommentsByTaskId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.taskId);
    if (isNaN(taskId)) {
        res.status(400).json({ error: "Invalid task ID" });
        return;
    }
    try {
        const comments = yield comment_prisma_1.default.findMany({
            where: { taskId },
            include: { user: true },
        });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error retrieving comments:", error);
        res.status(500).json({ error: "Error retrieving comments" });
    }
});
exports.getCommentsByTaskId = getCommentsByTaskId;
