import express from "express";
import usersRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import getUserDataRoutes from "./routes/user.data.routes";
import taskStatusRoutes from "./routes/task.status.routes";
import commentRoutes from "./routes/comment.routes";

const router = express.Router();

// Rutas
router.use("/v1/users", usersRoutes); // Ruta para las operaciones de los usuarios
router.use("/v1/auth", getUserDataRoutes);
router.use("/v1/auth", authRoutes); // Ruta para la autenticación
router.use("/v1/task", taskRoutes);
router.use("/v1/task-status", taskStatusRoutes);
router.use("/v1/comment", commentRoutes);

export default router;
