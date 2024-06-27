import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import appRoutes from "./app"; // Asegúrate de que este archivo esté correctamente configurado

dotenv.config();

const app = express();

const corsOptions = {
  origin:
    "https://trello-v1-project-jlerifagu-moisesinmdevelopers-projects.vercel.app", // Permite solo solicitudes desde este origen
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // Asegúrate de incluir todos los encabezados necesarios
};

app.use(cors(corsOptions)); // Aplicar configuración CORS
app.use(express.json()); // Para parsear JSON

app.use("/api", appRoutes); // Usar las rutas definidas en `appRoutes`

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, (): void => {
  console.log(`Server is running on PORT: ${PORT}`);
});
