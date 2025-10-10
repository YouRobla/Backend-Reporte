import sgMail from '@sendgrid/mail';
// Estado del email
let emailConfigurado = false;
let emailError = null;
// Configurar SendGrid
const configurarSendGrid = () => {
    if (!process.env.EMAIL_PASS) {
        emailError = 'API Key de SendGrid no configurada';
        console.log('⚠️ API Key de SendGrid no configurada');
        return;
    }
    try {
        console.log('🔄 Configurando SendGrid...');
        console.log('📋 API Key:', process.env.EMAIL_PASS ? 'Configurada' : 'No configurada');
        // Configurar la API Key
        sgMail.setApiKey(process.env.EMAIL_PASS);
        emailConfigurado = true;
        emailError = null;
        console.log('✅ SendGrid configurado correctamente');
        console.log('📧 Usando librería oficial @sendgrid/mail');
    }
    catch (error) {
        emailConfigurado = false;
        emailError = error.message;
        console.log('❌ Error configurando SendGrid:', emailError);
        console.log('ℹ️ El sistema funcionará sin envío de correos');
    }
};
// Función para enviar email usando SendGrid oficial
export const sendEmailAPI = async (mailOptions) => {
    if (!emailConfigurado) {
        throw new Error('SendGrid no configurado: ' + (emailError || 'Error desconocido'));
    }
    try {
        console.log('📧 Enviando email con SendGrid...');
        const msg = {
            to: mailOptions.to,
            from: {
                email: process.env.EMAIL_FROM || '1533824@senati.pe',
                name: process.env.EMAIL_NAME || 'Sistema de Reportes SENATI'
            },
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html
        };
        console.log('📋 Configuración del email:', {
            to: msg.to,
            from: msg.from,
            subject: msg.subject,
            hasText: !!msg.text,
            hasHtml: !!msg.html
        });
        const response = await sgMail.send(msg);
        console.log('✅ Email enviado con SendGrid');
        console.log('📧 Response:', response[0]?.statusCode);
        return {
            messageId: response[0]?.headers?.['x-message-id'] || 'N/A',
            statusCode: response[0]?.statusCode
        };
    }
    catch (error) {
        console.error('❌ Error enviando email con SendGrid:', error.message);
        if (error.response) {
            console.error('📋 Detalles del error:', {
                status: error.response.status,
                body: error.response.body,
                headers: error.response.headers
            });
        }
        throw error;
    }
};
// Configurar SendGrid de forma asíncrona
setImmediate(() => {
    configurarSendGrid();
});
// Función para verificar si el email está disponible
export const isEmailAvailable = () => emailConfigurado;
// Función para obtener el error del email
export const getEmailError = () => emailError;
