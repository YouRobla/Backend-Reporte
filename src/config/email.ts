import nodemailer from 'nodemailer';

// Configuración del transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
  }
});

// Verificar la configuración
transporter.verify((error) => {
  if (error) {
    console.error('❌ Error en configuración de email:', error);
  } else {
    console.log('✅ Servidor de email listo para enviar correos');
  }
});

export default transporter;
