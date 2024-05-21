import express from "express";
import cors from "cors";
import usersRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import taskStatusRoutes from "./routes/task.status.routes";
import commentRoutes from "./routes/comment.routes";
const app = express();

app.use(cors()); // Habilitar CORS para todas las rutas

app.use(express.json());

// Middleware para manejar las solicitudes OPTIONS (preflight)
app.options("*", cors());

// Rutas
app.use("/v1/users", usersRoutes); // Ruta para las operaciones de los usuarios
app.use("/v1/auth", authRoutes); // Ruta para la autenticación
app.use("/v1/task", taskRoutes);
app.use("/v1/task-status", taskStatusRoutes);
app.use("/v1/comment", commentRoutes);
// Exportar la aplicación Express
export default app;
