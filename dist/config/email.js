import nodemailer from 'nodemailer';
// Estado del email
let emailConfigurado = false;
let emailError = null;
// Configuración optimizada del transporter de email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Configuración optimizada para Render
    connectionTimeout: 30000, // 30 segundos
    greetingTimeout: 15000, // 15 segundos
    socketTimeout: 30000, // 30 segundos
    tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
    },
    // Configuración adicional para Gmail
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    rateDelta: 20000,
    rateLimit: 5
});
// Verificar configuración de email usando callback nativo
const verificarEmail = () => {
    // Verificar variables de entorno primero
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        emailError = 'Variables de entorno de email no configuradas';
        console.log('⚠️ Variables de entorno de email no configuradas');
        return;
    }
    // Usar callback nativo de nodemailer con timeout
    const timeout = setTimeout(() => {
        emailConfigurado = false;
        emailError = 'Timeout verificando email';
        console.log('⚠️ Timeout verificando email - continuando sin email');
    }, 15000); // 15 segundos timeout
    transporter.verify((error) => {
        clearTimeout(timeout);
        if (error) {
            emailConfigurado = false;
            emailError = error.message;
            console.log('⚠️ Email no disponible:', emailError);
            console.log('ℹ️ El sistema funcionará sin envío de correos');
        }
        else {
            emailConfigurado = true;
            emailError = null;
            console.log('✅ Servidor de email configurado correctamente');
        }
    });
};
// Verificar email de forma asíncrona usando setImmediate (no bloquea)
setImmediate(() => {
    verificarEmail();
});
// Función para verificar si el email está disponible
export const isEmailAvailable = () => emailConfigurado;
// Función para obtener el error del email
export const getEmailError = () => emailError;
// Función para enviar email con callback nativo
export const sendEmail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        if (!emailConfigurado) {
            const error = new Error('Email no configurado: ' + (emailError || 'Error desconocido'));
            console.error('❌', error.message);
            return reject(error);
        }
        // Timeout para envío de email
        const timeout = setTimeout(() => {
            reject(new Error('Timeout enviando email'));
        }, 30000); // 30 segundos timeout
        // Usar callback nativo de nodemailer
        transporter.sendMail(mailOptions, (error, info) => {
            clearTimeout(timeout);
            if (error) {
                console.error('❌ Error enviando email:', error.message);
                reject(error);
            }
            else {
                console.log('✅ Email enviado:', info.messageId);
                resolve(info);
            }
        });
    });
};
export default transporter;
