import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import appRoutes from "./app";

dotenv.config();

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

app.use("/api", appRoutes);

const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, (): void => {
  console.log(`Server is running on PORT: ${PORT}`);
});
