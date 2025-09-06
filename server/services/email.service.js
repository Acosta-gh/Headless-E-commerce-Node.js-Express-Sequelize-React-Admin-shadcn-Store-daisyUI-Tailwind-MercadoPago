const nodemailer = require('nodemailer');

// 1. Validar la configuración al inicio del módulo
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

let transporter;
if (missingEnvVars.length > 0) {
    console.warn(`⚠️  Advertencia: Faltan las siguientes variables de entorno para el servicio de correo: ${missingEnvVars.join(', ')}. El envío de correos estará deshabilitado.`);
} else {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10), // Asegurar que el puerto es un número
        secure: process.env.EMAIL_SECURE === 'true', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // Añadir un timeout para evitar que la aplicación se quede colgada
        connectionTimeout: 5000, 
        greetingTimeout: 5000,
    });
}

/**
 * Envía un correo electrónico.
 * @param {string} to - El destinatario del correo.
 * @param {string} subject - El asunto del correo.
 * @param {string} html - El contenido HTML del correo.
 * @throws {Error} Si el envío del correo falla o el servicio no está configurado.
 */
const sendEmail = async (to, subject, html) => {
    // 2. Comprobar si el transportador está disponible
    if (!transporter) {
        console.error('Error: Se intentó enviar un correo pero el servicio no está configurado.');
        // Lanzar un error para que el llamador sepa que algo fue mal
        throw new Error('El servicio de correo electrónico no está configurado.');
    }

    if (!to || !subject || !html) {
        throw new Error('Faltan parámetros (to, subject, html) para enviar el correo.');
    }

    try {
        const info = await transporter.sendMail({
            from: `"${process.env.ECOMMERCE_NAME}" <${process.env.EMAIL_USER}>`, // Formato de 'From' más limpio
            to,
            subject,
            html,
        });
        console.log(`✅ Correo enviado exitosamente a ${to}. Message ID: ${info.messageId}`);
    } catch (error) {
        console.error(`❌ Error al enviar correo a ${to}:`, error);
        // 3. Relanzar el error para que el código que llamó a la función pueda manejarlo
        throw new Error(`No se pudo enviar el correo a ${to}.`);
    }
};

module.exports = { sendEmail };