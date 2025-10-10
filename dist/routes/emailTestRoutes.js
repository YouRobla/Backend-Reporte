import { Router } from 'express';
import { sendEmail, isEmailAvailable, getEmailError } from '../config/email.js';
const router = Router();
// Endpoint para probar el email
router.post('/test-email', async (req, res) => {
    try {
        console.log('🧪 Iniciando prueba de email...');
        if (!isEmailAvailable()) {
            return res.status(400).json({
                success: false,
                message: 'Email no configurado',
                error: getEmailError()
            });
        }
        const { to, subject, text } = req.body;
        if (!to || !subject || !text) {
            return res.status(400).json({
                success: false,
                message: 'Faltan parámetros: to, subject, text'
            });
        }
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
            html: `<p>${text}</p>`
        };
        console.log('📧 Enviando email de prueba...');
        const result = await sendEmail(mailOptions);
        console.log('✅ Email de prueba enviado exitosamente');
        return res.json({
            success: true,
            message: 'Email enviado exitosamente',
            messageId: result.messageId || 'N/A'
        });
    }
    catch (error) {
        console.error('❌ Error en prueba de email:', error);
        return res.status(500).json({
            success: false,
            message: 'Error enviando email',
            error: error.message
        });
    }
});
// Endpoint para verificar estado del email
router.get('/email-status', (_req, res) => {
    res.json({
        emailConfigurado: isEmailAvailable(),
        error: getEmailError(),
        variables: {
            EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
            EMAIL_PORT: process.env.EMAIL_PORT || '587',
            EMAIL_USER: process.env.EMAIL_USER ? 'Configurado' : 'No configurado',
            EMAIL_PASS: process.env.EMAIL_PASS ? 'Configurado' : 'No configurado'
        }
    });
});
export default router;
