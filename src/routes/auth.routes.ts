import express from "express";
import { login, register, verifyCode } from "../controllers/auth.controller";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyCode);

export default router;
