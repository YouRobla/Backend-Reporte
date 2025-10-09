import { ReporteModel } from "../models/ReporteModel.js";
import { EvidenceModel } from "../models/EvidenceModel.js";
import { ReporteSchema } from "../schemas/ReporteSchema.js";
import { handleErrors } from "../utils/errorHandler.js";
import cloudinary from "../config/cloudinary.js";
import { EmailService } from "../services/EmailService.js";
export class ReporteCompletoController {
    // Crear reporte completo con evidencias
    static async createReporteConEvidencias(req, res) {
        try {
            // 1. Validar datos del reporte (Zod se encarga de todo)
            const validatedData = ReporteSchema.parse(req.body);
            // 3. Crear el reporte en la base de datos
            const reporte = await ReporteModel.create(validatedData);
            if (!reporte) {
                return res.status(400).json({ message: "No se pudo crear el reporte" });
            }
            // 4. Procesar evidencias (OBLIGATORIAS por regla de negocio)
            let evidencias = [];
            // Validar que se envíen evidencias
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    message: "Las evidencias son obligatorias. Debe enviar al menos una imagen."
                });
            }
            if (req.files && req.files.length > 0) {
                const files = req.files;
                // Filtrar archivos válidos (que tengan contenido)
                const validFiles = files.filter(file => file.size > 0 && file.buffer.length > 0);
                // Validar que haya al menos un archivo válido
                if (validFiles.length === 0) {
                    return res.status(400).json({
                        message: "No se encontraron archivos válidos. Debe enviar al menos una imagen."
                    });
                }
                if (validFiles.length > 0) {
                    // Subir todas las imágenes a Cloudinary en paralelo (solo imágenes para reportes)
                    const uploadPromises = validFiles.map(async (file) => {
                        const base64String = file.buffer.toString('base64');
                        const dataURI = `data:${file.mimetype};base64,${base64String}`;
                        const uploadResult = await cloudinary.uploader.upload(dataURI, {
                            folder: `sistema-reportes/reportes/${reporte.id}`,
                            resource_type: 'auto', // Solo imágenes para reportes
                            access_mode: "public",
                            quality: 'auto',
                            fetch_format: 'auto'
                        });
                        return uploadResult;
                    });
                    const uploadResults = await Promise.all(uploadPromises);
                    // Crear registros de evidencias en la base de datos
                    const evidencePromises = uploadResults.map(async (result) => {
                        return await EvidenceModel.create({
                            url: result.secure_url,
                            reporteId: reporte.id
                        });
                    });
                    evidencias = await Promise.all(evidencePromises);
                    // 🎯 ESTABLECER fecha_inicio DESPUÉS de subir las evidencias
                    await ReporteModel.update(reporte.id, {
                        fecha_inicio: new Date()
                    });
                    console.log('✅ Fecha de inicio establecida:', new Date());
                }
            }
            // 5. Obtener el reporte completo con evidencias
            const reporteCompleto = await ReporteModel.findById(reporte.id);
            // 6. Enviar correos automáticamente a todos los profesores
            try {
                const resultadoCorreos = await EmailService.enviarCorreoATodos(reporteCompleto);
                console.log(`📧 Correos enviados: ${resultadoCorreos.enviados}/${resultadoCorreos.total}`);
                if (resultadoCorreos.errores > 0) {
                    console.warn(`⚠️ Errores en envío: ${resultadoCorreos.errores}`);
                }
            }
            catch (error) {
                console.error('❌ Error enviando correos:', error);
                // No fallar el reporte por error de correo
            }
            return res.status(201).json({
                message: "Reporte creado exitosamente con evidencias",
                reporte: reporteCompleto,
                evidencias: evidencias,
                totalEvidencias: evidencias.length,
                correosEnviados: true
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Agregar evidencias a un reporte existente
    static async agregarEvidenciasAReporte(req, res) {
        try {
            const { reporteId } = req.params;
            const id = parseInt(reporteId);
            // Verificar que el reporte existe
            const reporte = await ReporteModel.findById(id);
            if (!reporte) {
                return res.status(404).json({ message: "Reporte no encontrado" });
            }
            // Procesar nuevas evidencias
            let nuevasEvidencias = [];
            if (req.files && req.files.length > 0) {
                const files = req.files;
                const uploadPromises = files.map(async (file) => {
                    const base64String = file.buffer.toString('base64');
                    const dataURI = `data:${file.mimetype};base64,${base64String}`;
                    const uploadResult = await cloudinary.uploader.upload(dataURI, {
                        folder: `sistema-reportes/reportes/${id}`,
                        resource_type: 'auto', // Solo imágenes para reportes
                        access_mode: "public",
                        quality: 'auto',
                        fetch_format: 'auto'
                    });
                    return uploadResult;
                });
                const uploadResults = await Promise.all(uploadPromises);
                const evidencePromises = uploadResults.map(async (result) => {
                    return await EvidenceModel.create({
                        url: result.secure_url,
                        reporteId: id
                    });
                });
                nuevasEvidencias = await Promise.all(evidencePromises);
            }
            // Obtener el reporte actualizado
            const reporteActualizado = await ReporteModel.findById(id);
            return res.status(201).json({
                message: "Evidencias agregadas exitosamente",
                reporte: reporteActualizado,
                nuevasEvidencias: nuevasEvidencias,
                totalEvidencias: nuevasEvidencias.length
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Crear reporte paso a paso (solo datos, sin evidencias)
    static async createReporteBasico(req, res) {
        try {
            // Validar datos del reporte (Zod se encarga de todo)
            const validatedData = ReporteSchema.parse(req.body);
            const reporte = await ReporteModel.create(validatedData);
            if (!reporte) {
                return res.status(400).json({ message: "No se pudo crear el reporte" });
            }
            return res.status(201).json({
                message: "Reporte creado exitosamente. Puedes agregar evidencias después.",
                reporte: reporte,
                siguientePaso: `POST /api/reportes-completos/${reporte.id}/evidencias`
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener todos los reportes con paginación y filtros
    static async findAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const nombre = req.query.nombre;
            const estado = req.query.estado;
            // Validar parámetros
            if (page < 1) {
                return res.status(400).json({ message: "La página debe ser mayor a 0" });
            }
            if (limit < 1 || limit > 100) {
                return res.status(400).json({ message: "El límite debe estar entre 1 y 100" });
            }
            // Validar estado si se proporciona
            if (estado && !['SinRevisar', 'EnProceso', 'Revisado'].includes(estado)) {
                return res.status(400).json({
                    message: "El estado debe ser: SinRevisar, EnProceso o Revisado"
                });
            }
            // Construir filtros
            const filters = {};
            if (nombre)
                filters.nombre = nombre;
            if (estado)
                filters.estado = estado;
            const result = await ReporteModel.findAll(page, limit, filters);
            if (!result.reportes || result.reportes.length === 0) {
                return res.status(200).json({
                    message: "No hay reportes que coincidan con los filtros",
                    reportes: [],
                    pagination: result.pagination,
                    filters: result.filters
                });
            }
            return res.json(result);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener un reporte por ID
    static async findById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const reporte = await ReporteModel.findById(id);
            if (!reporte) {
                return res.status(404).json({ message: "Reporte no encontrado" });
            }
            return res.json(reporte);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Cambiar estado de un reporte
    static async cambiarEstado(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { estado, fecha_fin } = req.body;
            // 🔍 LOGS DETALLADOS PARA DEBUG
            console.log('='.repeat(50));
            console.log('🔍 DEBUG cambiarEstado - INICIO');
            console.log('='.repeat(50));
            console.log('📥 REQUEST INFO:');
            console.log('  - Method:', req.method);
            console.log('  - URL:', req.url);
            console.log('  - Headers:', req.headers);
            console.log('  - Params:', req.params);
            console.log('  - Query:', req.query);
            console.log('  - Body RAW:', req.body);
            console.log('  - Body Type:', typeof req.body);
            console.log('  - Body Keys:', Object.keys(req.body || {}));
            console.log('');
            console.log('📊 DATOS EXTRAÍDOS:');
            console.log('  - ID (parsed):', id);
            console.log('  - Estado:', estado);
            console.log('  - Fecha_fin:', fecha_fin);
            console.log('  - Estado type:', typeof estado);
            console.log('  - Fecha_fin type:', typeof fecha_fin);
            console.log('='.repeat(50));
            // Validar estado
            if (!estado || !['SinRevisar', 'EnProceso', 'Revisado'].includes(estado)) {
                console.log('❌ Estado inválido:', estado);
                return res.status(400).json({
                    message: "Estado inválido. Debe ser: SinRevisar, EnProceso o Revisado",
                    estadoRecibido: estado
                });
            }
            // Verificar que el reporte existe
            const reporteExistente = await ReporteModel.findById(id);
            if (!reporteExistente) {
                console.log('❌ Reporte no encontrado:', id);
                return res.status(404).json({ message: "Reporte no encontrado" });
            }
            // Preparar datos de actualización
            const updateData = { estado };
            // Si se marca como "Revisado", validar que se envíe fecha_fin
            if (estado === 'Revisado') {
                if (!fecha_fin) {
                    console.log('❌ Falta fecha_fin para estado Revisado');
                    return res.status(400).json({
                        message: "Para marcar como 'Revisado' debe enviar la fecha_fin",
                        estado: estado,
                        fecha_fin: fecha_fin
                    });
                }
                updateData.fecha_fin = new Date(fecha_fin);
                console.log('✅ Fecha_fin procesada:', updateData.fecha_fin);
            }
            // Actualizar estado y fecha_fin si corresponde
            const reporteActualizado = await ReporteModel.update(id, updateData);
            console.log('✅ Reporte actualizado exitosamente');
            return res.json({
                message: `Estado del reporte cambiado a: ${estado}`,
                reporte: reporteActualizado,
                fecha_fin: estado === 'Revisado' ? updateData.fecha_fin : null
            });
        }
        catch (error) {
            console.log('❌ Error en cambiarEstado:', error);
            return handleErrors(res, error);
        }
    }
}
