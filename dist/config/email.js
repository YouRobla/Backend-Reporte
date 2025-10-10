import nodemailer from 'nodemailer';
// Estado del email
let emailConfigurado = false;
let emailError = null;
// Configuración múltiple para diferentes proveedores
const getEmailConfig = () => {
    const configs = [
        // Configuración Gmail con puerto 587 (STARTTLS)
        {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 20000,
            greetingTimeout: 10000,
            socketTimeout: 20000,
            tls: {
                rejectUnauthorized: false,
                ciphers: 'TLSv1.2'
            }
        },
        // Configuración Gmail con puerto 465 (SSL)
        {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 20000,
            greetingTimeout: 10000,
            socketTimeout: 20000,
            tls: {
                rejectUnauthorized: false,
                ciphers: 'TLSv1.2'
            }
        },
        // Configuración alternativa con menos restricciones
        {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 10000,
            greetingTimeout: 5000,
            socketTimeout: 10000,
            tls: {
                rejectUnauthorized: false
            },
            pool: false,
            maxConnections: 1
        }
    ];
    return configs[0]; // Usar la primera configuración por defecto
};
// Crear transporter con configuración optimizada
const transporter = nodemailer.createTransport(getEmailConfig());
// Función para probar múltiples configuraciones de email
const probarConfiguracionesEmail = async () => {
    // Verificar variables de entorno primero
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        emailError = 'Variables de entorno de email no configuradas';
        console.log('⚠️ Variables de entorno de email no configuradas');
        return;
    }
    const configs = [
        { name: 'Gmail STARTTLS (587)', config: getEmailConfig() },
        { name: 'Gmail SSL (465)', config: { ...getEmailConfig(), port: 465, secure: true } },
        { name: 'Gmail Simple', config: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                connectionTimeout: 10000,
                greetingTimeout: 5000,
                socketTimeout: 10000
            } },
        { name: 'Gmail Ultra Simple', config: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                connectionTimeout: 5000,
                greetingTimeout: 3000,
                socketTimeout: 5000,
                tls: { rejectUnauthorized: false }
            } }
    ];
    for (const { name, config } of configs) {
        try {
            console.log(`🔄 Probando configuración: ${name}`);
            const testTransporter = nodemailer.createTransport(config);
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Timeout'));
                }, 10000);
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
            console.log(`✅ Email configurado correctamente con: ${name}`);
            return;
        }
        catch (error) {
            console.log(`❌ Falló configuración ${name}:`, error.message);
            continue;
        }
    }
    // Si llegamos aquí, ninguna configuración funcionó
    emailConfigurado = false;
    emailError = 'Todas las configuraciones de email fallaron';
    console.log('⚠️ Todas las configuraciones de email fallaron');
    console.log('ℹ️ El sistema funcionará sin envío de correos');
};
// Verificar configuración de email
const verificarEmail = () => {
    setImmediate(() => {
        probarConfiguracionesEmail().catch(error => {
            console.error('Error verificando email:', error);
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
// Función para enviar email con callback nativo y reintentos
export const sendEmail = (mailOptions) => {
    return new Promise(async (resolve, reject) => {
        if (!emailConfigurado) {
            const error = new Error('Email no configurado: ' + (emailError || 'Error desconocido'));
            console.error('❌', error.message);
            return reject(error);
        }
        // Intentar múltiples configuraciones si la primera falla
        const configs = [
            { name: 'Configuración principal', config: getEmailConfig() },
            { name: 'Configuración simple', config: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                    connectionTimeout: 5000,
                    greetingTimeout: 3000,
                    socketTimeout: 5000
                } }
        ];
        for (const { name, config } of configs) {
            try {
                console.log(`📧 Intentando envío con: ${name}`);
                const testTransporter = nodemailer.createTransport(config);
                await new Promise((resolveEmail, rejectEmail) => {
                    const timeout = setTimeout(() => {
                        rejectEmail(new Error('Timeout enviando email'));
                    }, 15000); // 15 segundos timeout
                    testTransporter.sendMail(mailOptions, (error, info) => {
                        clearTimeout(timeout);
                        if (error) {
                            console.error(`❌ Error con ${name}:`, error.message);
                            rejectEmail(error);
                        }
                        else {
                            console.log(`✅ Email enviado con ${name}:`, info.messageId);
                            resolveEmail(info);
                        }
                    });
                });
                // Si llegamos aquí, el envío fue exitoso
                return resolve(true);
            }
            catch (error) {
                console.log(`❌ Falló envío con ${name}:`, error.message);
                continue;
            }
        }
        // Si llegamos aquí, todos los intentos fallaron
        reject(new Error('Todas las configuraciones de envío fallaron'));
    });
};
export default transporter;
