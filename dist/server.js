"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const app_1 = __importDefault(require("./app")); // Asegúrate de que este archivo esté correctamente configurado
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*", // Permitir todas las solicitudes
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Incluir OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"], // Asegúrate de incluir todos los encabezados necesarios
};
app.use((0, cors_1.default)(corsOptions)); // Aplicar configuración CORS
app.use(express_1.default.json()); // Para parsear JSON
app.use("/api", app_1.default); // Usar las rutas definidas en `appRoutes`
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
