"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCodeVerification = void 0;
const nodemailer = __importStar(require("nodemailer"));
// Configura el transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "safari.auth.service@outlook.es",
        pass: "auth.safari.service",
    },
});
// Función para enviar el código de verificación
function sendCodeVerification(correoDestino, codigo) {
    const mailOptions = {
        from: "safari.auth.service@outlook.es",
        to: correoDestino,
        subject: "Código de Verificación",
        text: `Tu código de verificación es: ${codigo}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar el correo:", error);
        }
        else {
            console.log("Correo enviado:", info.response);
        }
    });
}
exports.sendCodeVerification = sendCodeVerification;
