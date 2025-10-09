import { ReporteModel } from '../models/ReporteModel.js';
import { EvidenceModel } from '../models/EvidenceModel.js';
import { CloudinaryService } from '../upload/CloudinaryService.js';
import { CLOUDINARY_FOLDERS } from '../constants/fileTypes.js';
import { ReporteValidator } from '../validators/ReporteValidator.js';
export class ReporteService {
    // Crear reporte con evidencias
    static async createReporteConEvidencias(reporteData, files) {
        // Validar datos del reporte
        const validatedData = ReporteValidator.validateCreate(reporteData);
        // Crear el reporte
        const reporte = await ReporteModel.create(validatedData);
        if (!reporte) {
            throw new Error('No se pudo crear el reporte');
        }
        // Procesar evidencias si existen
        let evidencias = [];
        if (files && files.length > 0) {
            const folder = `${CLOUDINARY_FOLDERS.REPORTES}/${reporte.id}`;
            const uploadResults = await CloudinaryService.uploadMultipleFiles(files, folder, 'reportes');
            // Crear registros de evidencias
            const evidencePromises = uploadResults.map(result => EvidenceModel.create({
                url: result.secure_url,
                reporteId: reporte.id
            }));
            evidencias = await Promise.all(evidencePromises);
        }
        // Obtener reporte completo
        const reporteCompleto = await ReporteModel.findById(reporte.id);
        return {
            reporte: reporteCompleto,
            evidencias,
            totalEvidencias: evidencias.length
        };
    }
    // Agregar evidencias a un reporte existente
    static async agregarEvidenciasAReporte(reporteId, files) {
        // Verificar que el reporte existe
        const reporte = await ReporteModel.findById(reporteId);
        if (!reporte) {
            throw new Error('Reporte no encontrado');
        }
        // Subir evidencias
        const folder = `${CLOUDINARY_FOLDERS.REPORTES}/${reporteId}`;
        const uploadResults = await CloudinaryService.uploadMultipleFiles(files, folder, 'reportes');
        // Crear registros de evidencias
        const evidencePromises = uploadResults.map(result => EvidenceModel.create({
            url: result.secure_url,
            reporteId: reporteId
        }));
        const nuevasEvidencias = await Promise.all(evidencePromises);
        // Obtener reporte actualizado
        const reporteActualizado = await ReporteModel.findById(reporteId);
        return {
            reporte: reporteActualizado,
            evidencias: nuevasEvidencias,
            totalEvidencias: nuevasEvidencias.length
        };
    }
    // Crear reporte básico (sin evidencias)
    static async createReporteBasico(reporteData) {
        const validatedData = ReporteValidator.validateCreate(reporteData);
        const reporte = await ReporteModel.create(validatedData);
        if (!reporte) {
            throw new Error('No se pudo crear el reporte');
        }
        return reporte;
    }
    // Obtener reporte por ID
    static async getReporteById(id) {
        const reporte = await ReporteModel.findById(id);
        if (!reporte) {
            throw new Error('Reporte no encontrado');
        }
        return reporte;
    }
    // Obtener reportes por estado
    static async getReportesByEstado(estado) {
        const reportes = await ReporteModel.findByEstado(estado);
        if (!reportes || reportes.length === 0) {
            throw new Error(`No hay reportes con estado: ${estado}`);
        }
        return reportes;
    }
    // Actualizar reporte
    static async updateReporte(id, data) {
        const validatedData = ReporteValidator.validateUpdate(data);
        const reporte = await ReporteModel.findById(id);
        if (!reporte) {
            throw new Error('Reporte no encontrado, no se puede actualizar');
        }
        return await ReporteModel.update(id, validatedData);
    }
    // Eliminar reporte
    static async deleteReporte(id) {
        const reporte = await ReporteModel.findById(id);
        if (!reporte) {
            throw new Error('Reporte no encontrado, no se puede eliminar');
        }
        await ReporteModel.delete(id);
        return { message: 'Reporte eliminado correctamente' };
    }
}
