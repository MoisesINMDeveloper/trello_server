"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../controllers/comment.controller");
const router = express_1.default.Router();
router.post("/", comment_controller_1.createComment);
router.get("/:id", comment_controller_1.getCommentsByTaskId);
router.delete("/:commentId", comment_controller_1.deleteCommentById);
router.put("/:commentId", comment_controller_1.updateCommentById);
exports.default = router;
