import fetch from 'node-fetch';
// Estado del email
let emailConfigurado = false;
let emailError = null;
// Función para verificar SendGrid API
const verificarSendGridAPI = async () => {
    if (!process.env.EMAIL_PASS) {
        emailError = 'API Key de SendGrid no configurada';
        console.log('⚠️ API Key de SendGrid no configurada');
        return;
    }
    try {
        console.log('🔄 Verificando SendGrid API...');
        console.log('📋 API Key:', process.env.EMAIL_PASS ? 'Configurada' : 'No configurada');
        // Verificar API Key con un request simple
        const response = await fetch('https://api.sendgrid.com/v3/user/account', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.EMAIL_PASS}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        if (response.ok) {
            emailConfigurado = true;
            emailError = null;
            console.log('✅ SendGrid API configurado correctamente');
            console.log('📧 Usando API REST de SendGrid');
        }
        else {
            throw new Error(`API Key inválida: ${response.status} ${response.statusText}`);
        }
    }
    catch (error) {
        emailConfigurado = false;
        emailError = error.message;
        console.log('❌ Error configurando SendGrid API:', emailError);
        console.log('ℹ️ El sistema funcionará sin envío de correos');
    }
};
// Función para enviar email usando SendGrid API
export const sendEmailAPI = async (mailOptions) => {
    if (!emailConfigurado) {
        throw new Error('SendGrid API no configurado: ' + (emailError || 'Error desconocido'));
    }
    try {
        console.log('📧 Enviando email con SendGrid API...');
        const emailData = {
            personalizations: [{
                    to: [{ email: mailOptions.to }],
                    subject: mailOptions.subject
                }],
            from: {
                email: process.env.EMAIL_FROM || '1533824@senati.pe',
                name: process.env.EMAIL_NAME || 'Sistema de Reportes SENATI'
            },
            content: [{
                    type: 'text/plain',
                    value: mailOptions.text
                }]
        };
        // Agregar HTML si existe
        if (mailOptions.html) {
            emailData.content.push({
                type: 'text/html',
                value: mailOptions.html
            });
        }
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.EMAIL_PASS}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData),
            timeout: 30000
        });
        if (response.ok) {
            console.log('✅ Email enviado con SendGrid API');
            return { messageId: response.headers.get('x-message-id') || 'N/A' };
        }
        else {
            const errorData = await response.text();
            throw new Error(`SendGrid API error: ${response.status} ${response.statusText} - ${errorData}`);
        }
    }
    catch (error) {
        console.error('❌ Error enviando email con SendGrid API:', error.message);
        throw error;
    }
};
// Verificar API de forma asíncrona
setImmediate(() => {
    verificarSendGridAPI().catch(error => {
        console.error('Error verificando SendGrid API:', error);
    });
});
// Función para verificar si el email está disponible
export const isEmailAvailable = () => emailConfigurado;
// Función para obtener el error del email
export const getEmailError = () => emailError;
