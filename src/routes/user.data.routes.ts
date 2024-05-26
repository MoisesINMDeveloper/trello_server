import express from "express";
import authenticateToken from "../middleware/autenticate.token";
import { getUserData } from "../controllers/user.data.controller";

const router = express.Router();

router.get("/getdatauser", authenticateToken, getUserData);

export default router;
