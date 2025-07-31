const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
  console.log(`Enviando correo a: ${to}`);
  console.log(`Asunto: ${subject}`);
  console.log(`Contenido HTML: ${html}`);
  if (!to || !subject || !html) {
    console.error("Faltan parámetros para enviar el correo.");
    return;
  }
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Credenciales de correo electrónico no configuradas.");
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Restaurante ${process.env.EMAIL_USER}`,
      to,
      subject,
      html,
    });
    console.log(`Correo enviado exitosamente a ${to}`);
  } catch (error) {
    console.error(`Error al enviar correo a ${to}:`, error);
  }
};

module.exports = { sendEmail };