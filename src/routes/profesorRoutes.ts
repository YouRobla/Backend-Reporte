import { Router } from "express";
import { ProfesorController } from "../controllers/ProfesorController.js";

export const profesorRoutes = Router();

// Rutas básicas CRUD
profesorRoutes.post("/", ProfesorController.create);
profesorRoutes.get("/", ProfesorController.findAll);
profesorRoutes.get("/activos", ProfesorController.findActivos);
profesorRoutes.get("/search", ProfesorController.search);
profesorRoutes.get("/:id", ProfesorController.findById);
profesorRoutes.put("/:id", ProfesorController.update);
profesorRoutes.delete("/:id", ProfesorController.delete);

// Rutas específicas
profesorRoutes.put("/:id/toggle-activo", ProfesorController.toggleActivo);
