import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/password.service";
import prisma from "../models/user.prisma";
import { sendCodeVerification } from "../services/email.service";
import { generateToken } from "../services/auth.service";
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, name, email, password } = req.body;
  try {
    if (!username || !name || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const hashedPassword: string = await hashPassword(password);
    const user = await prisma.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
      },
    });
    const verificationCode: any = VerifyCodeGenerate();
    sendCodeVerification(user.email, verificationCode);
    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });

    // Almacena el código de verificación temporalmente
    almacenarCodigoVerificacion(user.email, verificationCode);
  } catch (error: any) {
    console.error("Registration error:", error);

    let statusCode = 500;
    let errorMessage = "There was an error in the register";
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      statusCode = 400;
      errorMessage = "The email entered already exists.";
    }
    res.status(statusCode).json({ error: errorMessage });
  }
};
export const login = async (req: Request, res: Response) => {
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
    const user = await prisma.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({
        error: "Username and passwords do not match",
      });
      return;
    }
    // Verifica si el usuario está verificado
    if (!user.verified) {
      // Si el usuario no está verificado, genera un nuevo código de verificación y se envia por correo electrónico
      const verificationCode: any = VerifyCodeGenerate();
      sendCodeVerification(user.email, verificationCode); // Envía el código de verificación al correo del usuario registrado
      almacenarCodigoVerificacion(user.email, verificationCode); // Almacena el código de verificación temporalmente

      res.status(403).json({
        error: "User is not verified. Verification code sent to your email.",
      });
      return;
    }

    // Actualiza el token después de la verificación del usuario
    const token = generateToken(user);
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
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, verificationCode } = req.body;
  try {
    // Verificar si el usuario existe en la base de datos
    const user = await prisma.findUnique({ where: { email } });
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
    await prisma.update({
      where: { email },
      data: { verified: true },
    });

    // Generar el token para el usuario verificado
    const token = generateToken(user);

    // Eliminar el código de verificación almacenado
    delete verificationCodes[email];

    // Crear el objeto de usuario para enviar en la respuesta, excluyendo la contraseña
    const userToSend = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      token: token,
      verified: true,
    };

    res
      .status(200)
      .json({ message: "Email verified successfully.", user: userToSend });
  } catch (error: any) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Error verifying email" });
  }
};

// Definir un mapa para almacenar temporalmente los códigos de verificación
const verificationCodes: Record<string, string> = {};

// Función para generar un código de verificación de 6 dígitos
function VerifyCodeGenerate(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Genera un número aleatorio de 6 dígitos como cadena
}

// Función para almacenar el código de verificación temporalmente
function almacenarCodigoVerificacion(
  email: string,
  verificationCode: string
): void {
  verificationCodes[email] = verificationCode;
}
