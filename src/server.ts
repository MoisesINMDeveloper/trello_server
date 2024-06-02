import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import appRoutes from "./app";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use("/api", appRoutes);

const PORT: string | 3000 = process.env.PORT || 3000;
app.listen(PORT, (): void => {
  console.log(`Server is running on PORT: ${PORT}`);
});
