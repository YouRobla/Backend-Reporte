import { ReporteService } from "../../services/ReporteService.js";
import { handleErrors } from "../../utils/errorHandler.js";
export class ReporteController {
    // Crear reporte completo con evidencias
    static async createReporteConEvidencias(req, res) {
        try {
            const files = req.files;
            const result = await ReporteService.createReporteConEvidencias(req.body, files);
            return res.status(201).json({
                message: "Reporte creado exitosamente con evidencias",
                ...result
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Agregar evidencias a reporte existente
    static async agregarEvidenciasAReporte(req, res) {
        try {
            const { reporteId } = req.params;
            const id = parseInt(reporteId);
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({ error: "No se proporcionaron archivos" });
            }
            const result = await ReporteService.agregarEvidenciasAReporte(id, files);
            return res.status(201).json({
                message: "Evidencias agregadas exitosamente",
                ...result
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Crear reporte básico
    static async createReporteBasico(req, res) {
        try {
            const reporte = await ReporteService.createReporteBasico(req.body);
            return res.status(201).json({
                message: "Reporte creado exitosamente. Puedes agregar evidencias después.",
                reporte,
                siguientePaso: `POST /api/reportes-completos/${reporte.id}/evidencias`
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener reporte por ID
    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const reporte = await ReporteService.getReporteById(id);
            return res.json(reporte);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener reportes por estado
    static async getByEstado(req, res) {
        try {
            const { estado } = req.params;
            const reportes = await ReporteService.getReportesByEstado(estado);
            return res.json(reportes);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Actualizar reporte
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const reporte = await ReporteService.updateReporte(id, req.body);
            return res.json(reporte);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Eliminar reporte
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const result = await ReporteService.deleteReporte(id);
            return res.json(result);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
}
