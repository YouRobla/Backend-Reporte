import { Router } from "express";
import { ReporteCompletoController } from "../controllers/ReporteCompletoController.js";
import { uploadReportes, handleUploadError } from "../middlewares/upload.js";
export const reporteCompletoRoutes = Router();
// Crear reporte con evidencias (OBLIGATORIO - solo imágenes, máximo 3)
reporteCompletoRoutes.post("/", uploadReportes.array('evidencias', 3), handleUploadError, ReporteCompletoController.createReporteConEvidencias);
// Crear reporte básico (solo datos, sin evidencias) - DEPRECATED
reporteCompletoRoutes.post("/basico", ReporteCompletoController.createReporteBasico);
// Agregar evidencias a un reporte existente (solo imágenes, máximo 3)
reporteCompletoRoutes.post("/:reporteId/evidencias", uploadReportes.array('evidencias', 3), handleUploadError, ReporteCompletoController.agregarEvidenciasAReporte);
// Obtener todos los reportes con paginación y filtros
reporteCompletoRoutes.get("/", ReporteCompletoController.findAll);
// Obtener un reporte por ID
reporteCompletoRoutes.get("/:id", ReporteCompletoController.findById);
// Cambiar estado de un reporte
reporteCompletoRoutes.put("/:id/estado", ReporteCompletoController.cambiarEstado);
