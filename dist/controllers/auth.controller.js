"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCode = exports.login = exports.register = void 0;
const password_service_1 = require("../services/password.service");
const user_prisma_1 = __importDefault(require("../models/user.prisma"));
const email_service_1 = require("../services/email.service");
const auth_service_1 = require("../services/auth.service");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { username, name, email, password } = req.body;
    try {
        if (!username || !name || !email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const hashedPassword = yield (0, password_service_1.hashPassword)(password);
        const user = yield user_prisma_1.default.create({
            data: {
                username,
                name,
                email,
                password: hashedPassword,
            },
        });
        const verificationCode = VerifyCodeGenerate();
        (0, email_service_1.sendCodeVerification)(user.email, verificationCode);
        res.status(201).json({
            message: "User registered successfully. Please verify your email.",
        });
        // Almacena el código de verificación temporalmente
        almacenarCodigoVerificacion(user.email, verificationCode);
    }
    catch (error) {
        console.error("Registration error:", error);
        let statusCode = 500;
        let errorMessage = "There was an error in the register";
        if ((error === null || error === void 0 ? void 0 : error.code) === "P2002" && ((_b = (_a = error === null || error === void 0 ? void 0 : error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes("email"))) {
            statusCode = 400;
            errorMessage = "The email entered already exists.";
        }
        res.status(statusCode).json({ error: errorMessage });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: "The email is required." });
            return;
        }
        if (!password) {
            res.status(400).json({ message: "The password is required" });
            return;
        }
        const user = yield user_prisma_1.default.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        const passwordMatch = yield (0, password_service_1.comparePassword)(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({
                error: "Username and passwords do not match",
            });
            return;
        }
        // Verifica si el usuario está verificado
        if (!user.verified) {
            // Si el usuario no está verificado, genera un nuevo código de verificación y se envia por correo electrónico
            const verificationCode = VerifyCodeGenerate();
            (0, email_service_1.sendCodeVerification)(user.email, verificationCode); // Envía el código de verificación al correo del usuario registrado
            almacenarCodigoVerificacion(user.email, verificationCode); // Almacena el código de verificación temporalmente
            res.status(403).json({
                error: "User is not verified. Verification code sent to your email.",
            });
            return;
        }
        // Actualiza el token después de la verificación del usuario
        const token = (0, auth_service_1.generateToken)(user);
        // Filtrar las propiedades a mostrar
        const userToSend = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            token: token,
            verified: user.verified,
        };
        res.status(200).json(userToSend);
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.login = login;
const verifyCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, verificationCode } = req.body;
    try {
        // Verificar si el usuario existe en la base de datos
        const user = yield user_prisma_1.default.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        // Obtener el código de verificación almacenado para el usuario
        const storedVerificationCode = verificationCodes[email];
        if (!storedVerificationCode) {
            res.status(400).json({ error: "No verification code found." });
            return;
        }
        // Verificar si el código de verificación coincide
        if (storedVerificationCode !== verificationCode) {
            res.status(400).json({ error: "Invalid verification code." });
            return;
        }
        // Actualizar el estado de verificación del usuario en la base de datos
        yield user_prisma_1.default.update({
            where: { email },
            data: { verified: true },
        });
        // Eliminar el código de verificación almacenado
        delete verificationCodes[email];
        res.status(200).json({ message: "Email verified successfully." });
    }
    catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ error: "Error verifying email" });
    }
});
exports.verifyCode = verifyCode;
// Definir un mapa para almacenar temporalmente los códigos de verificación
const verificationCodes = {};
// Función para generar un código de verificación de 6 dígitos
function VerifyCodeGenerate() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Genera un número aleatorio de 6 dígitos como cadena
}
// Función para almacenar el código de verificación temporalmente
function almacenarCodigoVerificacion(email, verificationCode) {
    verificationCodes[email] = verificationCode;
}
