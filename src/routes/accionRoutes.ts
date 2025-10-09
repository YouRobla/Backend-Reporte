import { Router } from "express";
import { AccionController } from "../controllers/AccionController.js";
import { uploadEvidencias, handleUploadError } from "../middlewares/upload.js";

export const accionRoutes = Router();

// Rutas básicas CRUD
accionRoutes.post("/", AccionController.create);
accionRoutes.post("/completa", uploadEvidencias.array('evidencias', 10), handleUploadError, AccionController.createCompleta);
accionRoutes.get("/", AccionController.findAll);
accionRoutes.get("/:id", AccionController.findById);
accionRoutes.put("/:id", AccionController.update);
accionRoutes.delete("/:id", AccionController.delete);

// Rutas específicas
accionRoutes.get("/reporte/:reporteId", AccionController.findByReporteId);

// Agregar evidencias a una acción (imágenes y PDFs)
accionRoutes.post("/:id/evidencias", uploadEvidencias.array('evidencias', 10), handleUploadError, AccionController.agregarEvidencias);
