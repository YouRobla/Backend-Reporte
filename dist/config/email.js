import nodemailer from 'nodemailer';
// Estado del email
let emailConfigurado = false;
let emailError = null;
// Configuración optimizada para SendGrid
const getEmailConfig = () => {
    return {
        host: process.env.EMAIL_HOST || 'smtp.sendgrid.net',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true para 465, false para otros puertos
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 20000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        tls: {
            rejectUnauthorized: false
        }
    };
};
// Crear transporter con configuración optimizada
const transporter = nodemailer.createTransport(getEmailConfig());
// Función para verificar configuración de SendGrid
const verificarSendGrid = async () => {
    // Verificar variables de entorno primero
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        emailError = 'Variables de entorno de email no configuradas';
        console.log('⚠️ Variables de entorno de email no configuradas');
        return;
    }
    try {
        console.log('🔄 Verificando configuración de SendGrid...');
        const testTransporter = nodemailer.createTransport(getEmailConfig());
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Timeout verificando SendGrid'));
            }, 15000);
            testTransporter.verify((error) => {
                clearTimeout(timeout);
                if (error) {
                    reject(error);
                }
                else {
                    resolve(true);
                }
            });
        });
        // Si llegamos aquí, la configuración funciona
        emailConfigurado = true;
        emailError = null;
        console.log('✅ SendGrid configurado correctamente');
        console.log(`📧 Host: ${process.env.EMAIL_HOST || 'smtp.sendgrid.net'}`);
        console.log(`📧 Puerto: ${process.env.EMAIL_PORT || '587'}`);
    }
    catch (error) {
        emailConfigurado = false;
        emailError = error.message;
        console.log('❌ Error configurando SendGrid:', emailError);
        console.log('ℹ️ El sistema funcionará sin envío de correos');
    }
};
// Verificar configuración de email
const verificarEmail = () => {
    setImmediate(() => {
        verificarSendGrid().catch(error => {
            console.error('Error verificando SendGrid:', error);
        });
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
// Función para enviar email con SendGrid
export const sendEmail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        if (!emailConfigurado) {
            const error = new Error('SendGrid no configurado: ' + (emailError || 'Error desconocido'));
            console.error('❌', error.message);
            return reject(error);
        }
        console.log('📧 Enviando email con SendGrid...');
        // Timeout para envío de email
        const timeout = setTimeout(() => {
            reject(new Error('Timeout enviando email con SendGrid'));
        }, 30000); // 30 segundos timeout
        // Usar callback nativo de nodemailer
        transporter.sendMail(mailOptions, (error, info) => {
            clearTimeout(timeout);
            if (error) {
                console.error('❌ Error enviando email con SendGrid:', error.message);
                reject(error);
            }
            else {
                console.log('✅ Email enviado con SendGrid:', info.messageId);
                resolve(info);
            }
        });
    });
};
export default transporter;
