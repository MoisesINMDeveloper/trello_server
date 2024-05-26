"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const autenticate_token_1 = __importDefault(require("../middleware/autenticate.token"));
const task_controller_1 = require("../controllers/task.controller");
const router = express_1.default.Router();
router.post("/", autenticate_token_1.default, task_controller_1.createTask);
router.get("/", autenticate_token_1.default, task_controller_1.getAllTasks);
router.get("/:id", autenticate_token_1.default, task_controller_1.getTaskById);
router.put("/:id", autenticate_token_1.default, task_controller_1.updateTask);
router.delete("/:id", autenticate_token_1.default, task_controller_1.deleteTask);
exports.default = router;
