import { Router } from "express";
import { EvidenceController } from "../controllers/EvidenceController.js";
export const evidenceRoutes = Router();
// Rutas básicas CRUD
evidenceRoutes.post("/", EvidenceController.create);
evidenceRoutes.get("/", EvidenceController.findAll);
evidenceRoutes.get("/:id", EvidenceController.findById);
evidenceRoutes.put("/:id", EvidenceController.update);
evidenceRoutes.delete("/:id", EvidenceController.delete);
// Rutas específicas
evidenceRoutes.get("/reporte/:reporteId", EvidenceController.findByReporteId);
evidenceRoutes.get("/accion/:accionId", EvidenceController.findByAccionId);
