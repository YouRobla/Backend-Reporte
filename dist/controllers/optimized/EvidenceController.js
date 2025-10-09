import { EvidenceService } from "../../services/EvidenceService.js";
import { handleErrors } from "../../utils/errorHandler.js";
export class EvidenceController {
    // Subir una evidencia
    static async uploadSingle(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No se proporcionó ningún archivo" });
            }
            const { reporteId, accionId } = req.body;
            const result = await EvidenceService.uploadEvidence(req.file, reporteId ? parseInt(reporteId) : undefined, accionId ? parseInt(accionId) : undefined);
            return res.status(201).json({
                message: "Evidencia subida exitosamente",
                ...result
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Subir múltiples evidencias
    static async uploadMultiple(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: "No se proporcionaron archivos" });
            }
            const files = req.files;
            const { reporteId, accionId } = req.body;
            const result = await EvidenceService.uploadMultipleEvidences(files, reporteId ? parseInt(reporteId) : undefined, accionId ? parseInt(accionId) : undefined);
            return res.status(201).json({
                message: `${files.length} evidencias subidas exitosamente`,
                ...result
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Eliminar evidencia
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const result = await EvidenceService.deleteEvidence(id);
            return res.json(result);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener evidencia por ID
    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const evidence = await EvidenceService.getEvidenceById(id);
            return res.json(evidence);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener evidencias por reporte
    static async getByReporte(req, res) {
        try {
            const reporteId = parseInt(req.params.reporteId);
            const evidences = await EvidenceService.getEvidencesByReporte(reporteId);
            return res.json(evidences);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener evidencias por acción
    static async getByAccion(req, res) {
        try {
            const accionId = parseInt(req.params.accionId);
            const evidences = await EvidenceService.getEvidencesByAccion(accionId);
            return res.json(evidences);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener URL optimizada
    static async getOptimizedUrl(req, res) {
        try {
            const { url } = req.query;
            if (!url || typeof url !== 'string') {
                return res.status(400).json({ error: "URL de imagen requerida" });
            }
            const optimizedUrl = EvidenceService.getOptimizedUrl(url, {
                width: req.query.width ? parseInt(req.query.width) : undefined,
                height: req.query.height ? parseInt(req.query.height) : undefined,
                crop: req.query.crop || 'auto',
                gravity: req.query.gravity || 'auto'
            });
            return res.json({
                original_url: url,
                optimized_url: optimizedUrl,
                transformations: {
                    width: req.query.width,
                    height: req.query.height,
                    crop: req.query.crop || 'auto',
                    gravity: req.query.gravity || 'auto'
                }
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
}
