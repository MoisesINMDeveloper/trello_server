"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Habilitar CORS para todas las rutas
app.use(express_1.default.json());
// Middleware para manejar las solicitudes OPTIONS (preflight)
app.options("*", (0, cors_1.default)());
// Rutas
app.use("/v1/users", user_routes_1.default); // Ruta para las operaciones de los usuarios
app.use("/v1/auth", auth_routes_1.default); // Ruta para la autenticación
// Exportar la aplicación Express
exports.default = app;
