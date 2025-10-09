import { Router } from "express";
import { EvidenceController } from "../../controllers/optimized/EvidenceController.js";
import { UploadFactory } from "../../upload/UploadFactory.js";
import { UploadErrorHandler } from "../../upload/UploadErrorHandler.js";
export const evidenceRoutes = Router();
// Subir una evidencia (imagen o PDF)
evidenceRoutes.post("/single", UploadFactory.getEvidenciasUpload().single('file'), UploadErrorHandler.handle, EvidenceController.uploadSingle);
// Subir múltiples evidencias (imágenes o PDFs)
evidenceRoutes.post("/multiple", UploadFactory.getEvidenciasUpload().array('files', 5), UploadErrorHandler.handle, EvidenceController.uploadMultiple);
// Eliminar evidencia
evidenceRoutes.delete("/:id", EvidenceController.delete);
// Obtener evidencia por ID
evidenceRoutes.get("/:id", EvidenceController.getById);
// Obtener evidencias por reporte
evidenceRoutes.get("/reporte/:reporteId", EvidenceController.getByReporte);
// Obtener evidencias por acción
evidenceRoutes.get("/accion/:accionId", EvidenceController.getByAccion);
// Obtener URL optimizada
evidenceRoutes.get("/optimize", EvidenceController.getOptimizedUrl);
