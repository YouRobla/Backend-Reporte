#!/usr/bin/env node

/**
 * Script para probar la configuración de email
 * Uso: node test-email.js
 */

const https = require('https');

const BASE_URL = 'https://backend-reporte.onrender.com';

// Función para hacer peticiones HTTPS
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'backend-reporte.onrender.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Email-Test-Script/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Función principal
async function testEmail() {
  console.log('🧪 Iniciando prueba de configuración de email...\n');

  try {
    // 1. Verificar estado del email
    console.log('1️⃣ Verificando estado del email...');
    const statusResponse = await makeRequest('/api/email/email-status');
    
    console.log('📊 Estado del email:');
    console.log(`   Configurado: ${statusResponse.data.emailConfigurado ? '✅' : '❌'}`);
    console.log(`   Error: ${statusResponse.data.error || 'Ninguno'}`);
    console.log(`   Host: ${statusResponse.data.variables.EMAIL_HOST}`);
    console.log(`   Puerto: ${statusResponse.data.variables.EMAIL_PORT}`);
    console.log(`   Usuario: ${statusResponse.data.variables.EMAIL_USER}`);
    console.log(`   Contraseña: ${statusResponse.data.variables.EMAIL_PASS}\n`);

    if (!statusResponse.data.emailConfigurado) {
      console.log('❌ Email no está configurado. Configura las variables de entorno en Render.');
      return;
    }

    // 2. Probar envío de email
    console.log('2️⃣ Probando envío de email...');
    const testEmailData = {
      to: 'test@ejemplo.com', // Cambia por tu email
      subject: 'Prueba de Email desde Render',
      text: 'Este es un email de prueba enviado desde Render. Si recibes este email, la configuración está funcionando correctamente.'
    };

    const emailResponse = await makeRequest('/api/email/test-email', 'POST', testEmailData);
    
    if (emailResponse.status === 200) {
      console.log('✅ Email enviado exitosamente!');
      console.log(`   Message ID: ${emailResponse.data.messageId}`);
    } else {
      console.log('❌ Error enviando email:');
      console.log(`   Status: ${emailResponse.status}`);
      console.log(`   Error: ${emailResponse.data.message || emailResponse.data.error}`);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testEmail();
}

module.exports = { testEmail };
