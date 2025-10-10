import transporter from '../config/email.js';
import { ProfesorModel } from '../models/ProfesorModel.js';
export class EmailService {
    // Obtener todos los correos de profesores activos
    static async getCorreosProfesores() {
        try {
            const profesores = await ProfesorModel.findActivos();
            return profesores.map(profesor => profesor.correo);
        }
        catch (error) {
            console.error('Error obteniendo correos de profesores:', error);
            return [];
        }
    }
    // Enviar correo a todos los profesores
    static async enviarCorreoATodos(datosReporte) {
        try {
            const correos = await this.getCorreosProfesores();
            if (correos.length === 0) {
                console.log('⚠️ No hay profesores activos para enviar correos');
                return { enviados: 0, errores: 0 };
            }
            let enviados = 0;
            let errores = 0;
            // Enviar correo a cada profesor
            const promesasEnvio = correos.map(async (correo) => {
                try {
                    await this.enviarCorreoIndividual(correo, datosReporte);
                    enviados++;
                    console.log(`✅ Correo enviado a: ${correo}`);
                }
                catch (error) {
                    errores++;
                    console.error(`❌ Error enviando a ${correo}:`, error);
                }
            });
            await Promise.all(promesasEnvio);
            return { enviados, errores, total: correos.length };
        }
        catch (error) {
            console.error('Error en envío masivo de correos:', error);
            return { enviados: 0, errores: 1, total: 0 };
        }
    }
    // Enviar correo individual
    static async enviarCorreoIndividual(correo, datosReporte) {
        const asunto = `Nuevo Reporte #${datosReporte.numero_registro} - Sistema de Reportes`;
        const html = this.generarHTMLReporte(datosReporte);
        const texto = this.generarTextoReporte(datosReporte);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: correo,
            subject: asunto,
            text: texto,
            html: html
        };
        // Timeout para evitar bloqueos
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout enviando correo')), 30000); // 30 segundos
        });
        return Promise.race([
            transporter.sendMail(mailOptions),
            timeoutPromise
        ]);
    }
    // Generar HTML del correo
    static generarHTMLReporte(datos) {
        return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nuevo Reporte - Sistema de Reportes</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2c3e50; }
        .value { margin-left: 10px; }
        .footer { background: #34495e; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .status { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
        .status-sin-revisar { background: #f39c12; color: white; }
        .status-en-proceso { background: #3498db; color: white; }
        .status-revisado { background: #27ae60; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Nuevo Reporte Registrado</h1>
          <p>Sistema de Reportes Institucional</p>
        </div>
        
        <div class="content">
          <h2>📊 Información del Reporte</h2>
          
          <div class="field">
            <span class="label">Número de Registro:</span>
            <span class="value">${datos.numero_registro}</span>
          </div>
          
          <div class="field">
            <span class="label">Estado:</span>
            <span class="value">
              <span class="status status-${datos.estado.toLowerCase().replace(' ', '-')}">
                ${datos.estado}
              </span>
            </span>
          </div>
          
          <div class="field">
            <span class="label">Fecha de Registro:</span>
            <span class="value">${new Date(datos.fecha_registro).toLocaleString('es-ES')}</span>
          </div>

          <h3>👤 Información del Reportante</h3>
          
          <div class="field">
            <span class="label">Nombre Completo:</span>
            <span class="value">${datos.nombre_completo}</span>
          </div>
          
          <div class="field">
            <span class="label">Correo Institucional:</span>
            <span class="value">${datos.correo_institucional}</span>
          </div>
          
          <div class="field">
            <span class="label">Nombre del Reportante:</span>
            <span class="value">${datos.nombre_reportante}</span>
          </div>
          
          <div class="field">
            <span class="label">Área:</span>
            <span class="value">${datos.area_texto}</span>
          </div>

          <h3>📝 Detalles del Reporte</h3>
          
          <div class="field">
            <span class="label">Tipo de Reporte:</span>
            <span class="value">${datos.tipo_reporte}</span>
          </div>
          
          <div class="field">
            <span class="label">Relacionado con:</span>
            <span class="value">${datos.relacionado_con}</span>
          </div>
          
          <div class="field">
            <span class="label">Lugar del Incidente:</span>
            <span class="value">${datos.lugar_incidente}</span>
          </div>
          
          <div class="field">
            <span class="label">Descripción:</span>
            <div class="value" style="margin-top: 10px; padding: 10px; background: white; border-left: 4px solid #3498db;">
              ${datos.descripcion_observacion}
            </div>
          </div>

          ${datos.evidencias && datos.evidencias.length > 0 ? `
          <h3>📎 Evidencias Adjuntas</h3>
          <p>Este reporte incluye ${datos.evidencias.length} evidencia(s) adjunta(s).</p>
          ` : ''}

          ${datos.acciones && datos.acciones.length > 0 ? `
          <h3>⚡ Acciones Tomadas</h3>
          <p>Se han registrado ${datos.acciones.length} acción(es) relacionada(s) con este reporte.</p>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>Este es un correo automático del Sistema de Reportes Institucional.</p>
          <p>Por favor, no responder a este correo.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    }
    // Generar texto plano del correo
    static generarTextoReporte(datos) {
        return `
NUEVO REPORTE REGISTRADO
========================

INFORMACIÓN DEL REPORTE:
- Número de Registro: ${datos.numero_registro}
- Estado: ${datos.estado}
- Fecha de Registro: ${new Date(datos.fecha_registro).toLocaleString('es-ES')}

INFORMACIÓN DEL REPORTANTE:
- Nombre Completo: ${datos.nombre_completo}
- Correo Institucional: ${datos.correo_institucional}
- Nombre del Reportante: ${datos.nombre_reportante}
- Área: ${datos.area_texto}

DETALLES DEL REPORTE:
- Tipo de Reporte: ${datos.tipo_reporte}
- Relacionado con: ${datos.relacionado_con}
- Lugar del Incidente: ${datos.lugar_incidente}
- Descripción: ${datos.descripcion_observacion}

${datos.evidencias && datos.evidencias.length > 0 ? `EVIDENCIAS: Este reporte incluye ${datos.evidencias.length} evidencia(s) adjunta(s).` : ''}

${datos.acciones && datos.acciones.length > 0 ? `ACCIONES: Se han registrado ${datos.acciones.length} acción(es) relacionada(s).` : ''}

---
Este es un correo automático del Sistema de Reportes Institucional.
Por favor, no responder a este correo.
    `;
    }
}
