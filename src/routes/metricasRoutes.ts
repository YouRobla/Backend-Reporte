import { Router } from "express";
import { MetricasController } from "../controllers/MetricasController.js";

export const metricasRoutes = Router();

// Obtener métricas generales del sistema
metricasRoutes.get("/generales", MetricasController.getMetricasGenerales);

// Obtener métricas por período
metricasRoutes.get("/periodo", MetricasController.getMetricasPorPeriodo);

// Obtener métricas por tipo de reporte
metricasRoutes.get("/tipos", MetricasController.getMetricasPorTipo);

// Obtener métricas de rendimiento
metricasRoutes.get("/rendimiento", MetricasController.getMetricasRendimiento);
