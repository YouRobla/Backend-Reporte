import nodemailer from 'nodemailer';

// Configuración del transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
  },
  // Configuración para Render
  connectionTimeout: 60000, // 60 segundos
  greetingTimeout: 30000,    // 30 segundos
  socketTimeout: 60000,      // 60 segundos
  tls: {
    rejectUnauthorized: false
  }
});

// Verificar la configuración con timeout
const verifyEmail = () => {
  const timeout = setTimeout(() => {
    console.log('⚠️ Timeout verificando email - continuando sin email');
  }, 10000); // 10 segundos timeout

  transporter.verify((error) => {
    clearTimeout(timeout);
    if (error) {
      console.error('❌ Error en configuración de email:', error.message);
      console.log('⚠️ El sistema funcionará sin envío de correos');
    } else {
      console.log('✅ Servidor de email listo para enviar correos');
    }
  });
};

// Verificar email de forma asíncrona
verifyEmail();

export default transporter;
