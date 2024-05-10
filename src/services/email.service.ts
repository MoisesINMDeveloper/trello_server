import * as nodemailer from "nodemailer";

// Configura el transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "safari.auth.service@outlook.es",
    pass: "auth.safari.service",
  },
});

// Función para enviar el código de verificación
export function sendCodeVerification(correoDestino: string, codigo: number) {
  const mailOptions = {
    from: "safari.auth.service@outlook.es",
    to: correoDestino,
    subject: "Código de Verificación",
    text: `Tu código de verificación es: ${codigo}`,
  };

  transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
    if (error) {
      console.error("Error al enviar el correo:", error);
    } else {
      console.log("Correo enviado:", info.response);
    }
  });
}
