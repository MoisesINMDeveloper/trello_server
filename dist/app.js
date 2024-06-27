"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const user_data_routes_1 = __importDefault(require("./routes/user.data.routes"));
const task_status_routes_1 = __importDefault(require("./routes/task.status.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const router = express_1.default.Router();
// Rutas
router.use("/v1/users", user_routes_1.default); // Ruta para las operaciones de los usuarios
router.use("/v1/auth", user_data_routes_1.default);
router.use("/v1/auth", auth_routes_1.default); // Ruta para la autenticación
router.use("/v1/task", task_routes_1.default);
router.use("/v1/task-status", task_status_routes_1.default);
router.use("/v1/comment", comment_routes_1.default);
exports.default = router;
