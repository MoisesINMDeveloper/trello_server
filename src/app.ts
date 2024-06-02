import express from "express";
import cors from "cors";
import usersRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import getUserDataRoutes from "./routes/user.data.routes";
import taskStatusRoutes from "./routes/task.status.routes";
import commentRoutes from "./routes/comment.routes";

const app = express();

app.use(cors()); // Habilitar CORS para todas las rutas

app.use(express.json());

// Middleware para manejar las solicitudes OPTIONS (preflight)
app.options("*", cors());

// Middleware para log de las solicitudes
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Rutas
app.use("/v1/users", usersRoutes); // Ruta para las operaciones de los usuarios
app.use("/v1/auth", getUserDataRoutes);
app.use("/v1/auth", authRoutes); // Ruta para la autenticación
app.use("/v1/task", taskRoutes);
app.use("/v1/task-status", taskStatusRoutes);
app.use("/v1/comment", commentRoutes);

// Ruta de ejemplo para acceder a los headers
app.get("/some-route", (req, res) => {
  const myHeader = req.headers["my-header"];
  console.log("My Header:", myHeader);
  res.send("Check your console for the header value");
});

// Exportar la aplicación Express
export default app;
