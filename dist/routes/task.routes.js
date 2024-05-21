"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const router = express_1.default.Router();
router.post("/", task_controller_1.createTask);
router.get("/", task_controller_1.getAllTasks);
router.get("/:id", task_controller_1.getTaskById);
router.put("/:id", task_controller_1.updateTask);
router.delete("/:id", task_controller_1.deleteTask);
exports.default = router;
