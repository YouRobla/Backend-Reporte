import { Router } from "express";
import { ReporteController } from "../controllers/ReporteController.js";
export const reporteRoutes = Router();
// Rutas básicas CRUD
reporteRoutes.post("/", ReporteController.create);
reporteRoutes.get("/", ReporteController.findAll);
reporteRoutes.get("/:id", ReporteController.findById);
reporteRoutes.put("/:id", ReporteController.update);
reporteRoutes.delete("/:id", ReporteController.delete);
// Rutas específicas
reporteRoutes.get("/estado/:estado", ReporteController.findByEstado);
reporteRoutes.get("/numero-registro/:numero_registro", ReporteController.findByNumeroRegistro);
