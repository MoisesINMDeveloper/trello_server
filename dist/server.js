"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Habilitar CORS para todas las rutas
app.use(express_1.default.json());
// Middleware para manejar las solicitudes OPTIONS (preflight)
app.options("*", (0, cors_1.default)());
// Middleware para log de las solicitudes
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});
app.use("/api", app_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
