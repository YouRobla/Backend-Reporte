import { Router } from "express";
import { UploadController } from "../controllers/UploadController.js";
import { uploadEvidencias, handleUploadError } from "../middlewares/upload.js";
export const uploadRoutes = Router();
// Subir una evidencia (imagen o PDF)
uploadRoutes.post("/single", uploadEvidencias.single('file'), handleUploadError, UploadController.uploadImage);
// Subir múltiples evidencias (imágenes o PDFs)
uploadRoutes.post("/multiple", uploadEvidencias.array('files', 5), handleUploadError, UploadController.uploadMultipleImages);
// Eliminar evidencia
uploadRoutes.delete("/:id", UploadController.deleteImage);
// Obtener URL optimizada
uploadRoutes.get("/optimize", UploadController.getOptimizedUrl);
