import { Router } from "express";
import { ReporteController } from "../../controllers/optimized/ReporteController.js";
import { UploadFactory } from "../../upload/UploadFactory.js";
import { UploadErrorHandler } from "../../upload/UploadErrorHandler.js";

export const reporteRoutes = Router();

// Crear reporte completo con evidencias (solo imágenes)
reporteRoutes.post(
  "/completo", 
  UploadFactory.getReportesUpload().array('evidencias', 10), 
  UploadErrorHandler.handle, 
  ReporteController.createReporteConEvidencias
);

// Crear reporte básico (sin evidencias)
reporteRoutes.post("/basico", ReporteController.createReporteBasico);

// Agregar evidencias a reporte existente (solo imágenes)
reporteRoutes.post(
  "/:reporteId/evidencias", 
  UploadFactory.getReportesUpload().array('evidencias', 10), 
  UploadErrorHandler.handle, 
  ReporteController.agregarEvidenciasAReporte
);

// Obtener reporte por ID
reporteRoutes.get("/:id", ReporteController.getById);

// Obtener reportes por estado
reporteRoutes.get("/estado/:estado", ReporteController.getByEstado);

// Actualizar reporte
reporteRoutes.put("/:id", ReporteController.update);

// Eliminar reporte
reporteRoutes.delete("/:id", ReporteController.delete);
