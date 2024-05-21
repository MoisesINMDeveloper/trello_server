"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_status_controller_1 = require("../controllers/task.status.controller");
const router = express_1.default.Router();
router.post("/", task_status_controller_1.createTaskStatus);
router.get("/", task_status_controller_1.getAllTaskStatuses);
router.put("/:id", task_status_controller_1.updateTaskStatus);
exports.default = router;
