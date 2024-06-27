import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import appRoutes from "./app"; // Asegúrate de que este archivo esté correctamente configurado

dotenv.config();

const app = express();

const corsOptions = {
  origin: "*", // Permitir todas las solicitudes
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Incluir OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"], // Asegúrate de incluir todos los encabezados necesarios
};

app.use(cors(corsOptions)); // Aplicar configuración CORS
app.use(express.json()); // Para parsear JSON

app.use("/api", appRoutes); // Usar las rutas definidas en `appRoutes`

const PORT: string | 3000 = process.env.PORT || 3000;
app.listen(PORT, (): void => {
  console.log(`Server is running on PORT: ${PORT}`);
});
