import { Request, Response } from "express";
import { ReporteModel } from "../models/ReporteModel.js";
import { AccionModel } from "../models/AccionModel.js";
import { EvidenceModel } from "../models/EvidenceModel.js";
import { ProfesorModel } from "../models/ProfesorModel.js";
import { handleErrors } from "../utils/errorHandler.js";

export class MetricasController {
  // Obtener métricas generales del sistema
  static async getMetricasGenerales(_req: Request, res: Response) {
    try {
      // Contar reportes por estado
      const reportesSinRevisar = await ReporteModel.findByEstado('SinRevisar');
      const reportesEnProceso = await ReporteModel.findByEstado('EnProceso');
      const reportesRevisados = await ReporteModel.findByEstado('Revisado');
      
      // Contar totales
      const totalReportes = reportesSinRevisar.length + reportesEnProceso.length + reportesRevisados.length;
      const totalAcciones = await AccionModel.findAll();
      const totalEvidencias = await EvidenceModel.findAll();
      const profesoresActivos = await ProfesorModel.findActivos();

      // Calcular porcentajes
      const porcentajeSinRevisar = totalReportes > 0 ? (reportesSinRevisar.length / totalReportes) * 100 : 0;
      const porcentajeEnProceso = totalReportes > 0 ? (reportesEnProceso.length / totalReportes) * 100 : 0;
      const porcentajeRevisados = totalReportes > 0 ? (reportesRevisados.length / totalReportes) * 100 : 0;

      return res.json({
        resumen: {
          totalReportes,
          totalAcciones: totalAcciones.length,
          totalEvidencias: totalEvidencias.length,
          profesoresActivos: profesoresActivos.length
        },
        reportesPorEstado: {
          sinRevisar: {
            cantidad: reportesSinRevisar.length,
            porcentaje: Math.round(porcentajeSinRevisar * 100) / 100
          },
          enProceso: {
            cantidad: reportesEnProceso.length,
            porcentaje: Math.round(porcentajeEnProceso * 100) / 100
          },
          revisados: {
            cantidad: reportesRevisados.length,
            porcentaje: Math.round(porcentajeRevisados * 100) / 100
          }
        },
        eficiencia: {
          reportesConAcciones: totalAcciones.length > 0 ? totalReportes : 0,
          promedioEvidenciasPorReporte: totalReportes > 0 ? Math.round((totalEvidencias.length / totalReportes) * 100) / 100 : 0,
          promedioAccionesPorReporte: totalReportes > 0 ? Math.round((totalAcciones.length / totalReportes) * 100) / 100 : 0
        }
      });
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener métricas por período
  static async getMetricasPorPeriodo(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ 
          message: "Se requieren los parámetros fechaInicio y fechaFin (YYYY-MM-DD)" 
        });
      }

      const inicio = new Date(fechaInicio as string);
      const fin = new Date(fechaFin as string);
      
      if (inicio > fin) {
        return res.status(400).json({ 
          message: "La fecha de inicio debe ser anterior a la fecha de fin" 
        });
      }

      // Obtener reportes del período
      const reportes = await ReporteModel.findAll(1, 1000); // Obtener todos para filtrar
      const reportesPeriodo = reportes.reportes.filter(reporte => {
        const fechaReporte = new Date(reporte.fecha_registro);
        return fechaReporte >= inicio && fechaReporte <= fin;
      });

      // Contar por estado en el período
      const sinRevisar = reportesPeriodo.filter(r => r.estado === 'SinRevisar').length;
      const enProceso = reportesPeriodo.filter(r => r.estado === 'EnProceso').length;
      const revisados = reportesPeriodo.filter(r => r.estado === 'Revisado').length;

      return res.json({
        periodo: {
          fechaInicio: inicio.toISOString().split('T')[0],
          fechaFin: fin.toISOString().split('T')[0],
          dias: Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
        },
        reportes: {
          total: reportesPeriodo.length,
          sinRevisar,
          enProceso,
          revisados
        },
        tendencias: {
          reportesPorDia: Math.round((reportesPeriodo.length / Math.max(1, Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)))) * 100) / 100
        }
      });
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener métricas de tipos de reportes
  static async getMetricasPorTipo(_req: Request, res: Response) {
    try {
      const reportes = await ReporteModel.findAll(1, 1000);
      
      // Agrupar por tipo de reporte
      const tiposReporte: { [key: string]: number } = {};
      const sedes: { [key: string]: number } = {};
      const lugaresIncidente: { [key: string]: number } = {};

      reportes.reportes.forEach(reporte => {
        // Contar tipos de reporte
        tiposReporte[reporte.tipo_reporte] = (tiposReporte[reporte.tipo_reporte] || 0) + 1;
        
        // Contar sedes (reemplaza area_texto)
        sedes[reporte.sede] = (sedes[reporte.sede] || 0) + 1;
        
        // Contar lugares de incidente
        lugaresIncidente[reporte.lugar_incidente] = (lugaresIncidente[reporte.lugar_incidente] || 0) + 1;
      });

      return res.json({
        tiposReporte: Object.entries(tiposReporte)
          .map(([tipo, cantidad]) => ({ tipo, cantidad }))
          .sort((a, b) => b.cantidad - a.cantidad),
        sedes: Object.entries(sedes)
          .map(([sede, cantidad]) => ({ sede, cantidad }))
          .sort((a, b) => b.cantidad - a.cantidad),
        lugaresIncidente: Object.entries(lugaresIncidente)
          .map(([lugar, cantidad]) => ({ lugar, cantidad }))
          .sort((a, b) => b.cantidad - a.cantidad)
      });
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener métricas de rendimiento
  static async getMetricasRendimiento(_req: Request, res: Response) {
    try {
      const reportes = await ReporteModel.findAll(1, 1000);
      const acciones = await AccionModel.findAll();

      // Calcular tiempos de resolución
      const reportesConFechaFin = reportes.reportes.filter(r => r.fecha_fin);
      const tiemposResolucion = reportesConFechaFin.map(reporte => {
        const inicio = new Date(reporte.fecha_inicio || reporte.fecha_registro);
        const fin = new Date(reporte.fecha_fin!);
        return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)); // días
      });

      const tiempoPromedioResolucion = tiemposResolucion.length > 0 
        ? Math.round((tiemposResolucion.reduce((a, b) => a + b, 0) / tiemposResolucion.length) * 100) / 100
        : 0;

      // Calcular reportes por mes
      const reportesPorMes: { [key: string]: number } = {};
      reportes.reportes.forEach(reporte => {
        const fecha = new Date(reporte.fecha_registro);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        reportesPorMes[mes] = (reportesPorMes[mes] || 0) + 1;
      });

      return res.json({
        rendimiento: {
          tiempoPromedioResolucion: tiempoPromedioResolucion,
          reportesResueltos: reportesConFechaFin.length,
          reportesPendientes: reportes.reportes.length - reportesConFechaFin.length,
          tasaResolucion: reportes.reportes.length > 0 
            ? Math.round((reportesConFechaFin.length / reportes.reportes.length) * 100 * 100) / 100
            : 0
        },
        tendencias: {
          reportesPorMes: Object.entries(reportesPorMes)
            .map(([mes, cantidad]) => ({ mes, cantidad }))
            .sort((a, b) => a.mes.localeCompare(b.mes))
        },
        actividad: {
          totalAcciones: acciones.length,
          promedioAccionesPorReporte: reportes.reportes.length > 0 
            ? Math.round((acciones.length / reportes.reportes.length) * 100) / 100
            : 0
        }
      });
    } catch (error) {
      return handleErrors(res, error);
    }
  }
}
