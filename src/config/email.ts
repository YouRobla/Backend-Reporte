import nodemailer from 'nodemailer';

// Estado del email
let emailConfigurado = false;
let emailError: string | null = null;

// Configuración optimizada para SendGrid
const getEmailConfig = () => {
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000, // Reducido a 10s
    greetingTimeout: 5000,    // Reducido a 5s
    socketTimeout: 10000,     // Reducido a 10s
    tls: {
      rejectUnauthorized: false
    },
    // Configuración adicional para Render
    pool: false,
    maxConnections: 1,
    rateDelta: 10000,
    rateLimit: 5
  };
  
  console.log('🔧 Configuración SendGrid generada:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    pass: config.auth.pass ? 'Configurada' : 'No configurada',
    connectionTimeout: config.connectionTimeout,
    greetingTimeout: config.greetingTimeout,
    socketTimeout: config.socketTimeout
  });
  
  return config;
};

// Crear transporter con configuración optimizada
const transporter = nodemailer.createTransport(getEmailConfig());

// Función para verificar configuración de SendGrid con múltiples intentos
const verificarSendGrid = async () => {
  // Verificar variables de entorno primero
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    emailError = 'Variables de entorno de email no configuradas';
    console.log('⚠️ Variables de entorno de email no configuradas');
    console.log('📋 Variables disponibles:');
    console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST || 'No configurado'}`);
    console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT || 'No configurado'}`);
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? 'Configurado' : 'No configurado'}`);
    console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? 'Configurado' : 'No configurado'}`);
    return;
  }

  // Configuraciones alternativas para probar
  const configs = [
    {
      name: 'SendGrid Estándar',
      config: getEmailConfig()
    },
    {
      name: 'SendGrid Simple',
      config: {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 5000,
        greetingTimeout: 3000,
        socketTimeout: 5000
      }
    },
    {
      name: 'SendGrid SSL',
      config: {
        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 5000,
        greetingTimeout: 3000,
        socketTimeout: 5000
      }
    }
  ];

  for (const { name, config } of configs) {
    try {
      console.log(`🔄 Probando configuración: ${name}`);
      console.log('📋 Configuración:', {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.auth.user,
        pass: config.auth.pass ? 'Configurada' : 'No configurada'
      });
      
      const testTransporter = nodemailer.createTransport(config);
      
      console.log('⏱️ Iniciando verificación con timeout de 10 segundos...');
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.log(`⏰ Timeout alcanzado (10s) - ${name} no responde`);
          reject(new Error(`Timeout verificando ${name}`));
        }, 10000);

        testTransporter.verify((error) => {
          clearTimeout(timeout);
          if (error) {
            console.log(`❌ Error en ${name}:`, error.message);
            reject(error);
          } else {
            console.log(`✅ ${name} verificación exitosa`);
            resolve(true);
          }
        });
      });

      // Si llegamos aquí, la configuración funciona
      emailConfigurado = true;
      emailError = null;
      console.log(`✅ SendGrid configurado correctamente con: ${name}`);
      console.log(`📧 Host: ${config.host}`);
      console.log(`📧 Puerto: ${config.port}`);
      return;

    } catch (error) {
      console.log(`❌ Falló configuración ${name}:`, (error as Error).message);
      continue;
    }
  }

  // Si llegamos aquí, todas las configuraciones fallaron
  emailConfigurado = false;
  emailError = 'Todas las configuraciones de SendGrid fallaron';
  console.log('❌ Todas las configuraciones de SendGrid fallaron');
  console.log('ℹ️ El sistema funcionará sin envío de correos');
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
export const sendEmail = (mailOptions: any): Promise<any> => {
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
      } else {
        console.log('✅ Email enviado con SendGrid:', info.messageId);
        resolve(info);
      }
    });
  });
};

export default transporter;
