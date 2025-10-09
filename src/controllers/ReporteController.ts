import { Request, Response } from "express";
import { ReporteModel } from "../models/ReporteModel.js";
import { ReporteSchema, ReporteUpdateSchema } from "../schemas/ReporteSchema.js";
import { handleErrors } from "../utils/errorHandler.js";

export class ReporteController {
  // Crear un reporte
  static async create(req: Request, res: Response) {
    try {
      const parsedData = ReporteSchema.parse(req.body);
      const reporte = await ReporteModel.create(parsedData);

      if (!reporte) {
        return res.status(400).json({ message: "No se pudo crear el reporte" });
      }

      return res.status(201).json(reporte);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Actualizar un reporte
  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const parsedData = ReporteUpdateSchema.parse(req.body);

      // Verificar existencia
      const existingReporte = await ReporteModel.findById(id);
      if (!existingReporte) {
        return res.status(404).json({ message: "Reporte no encontrado, no se puede actualizar" });
      }

      const updatedReporte = await ReporteModel.update(id, parsedData);
      return res.json(updatedReporte);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Eliminar un reporte
  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      // Verificar existencia
      const reporte = await ReporteModel.findById(id);
      if (!reporte) {
        return res.status(404).json({ message: "Reporte no encontrado, no se puede eliminar" });
      }

      await ReporteModel.delete(id);
      return res.json({ message: "Reporte eliminado correctamente" });
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener todos los reportes con paginación y filtros
  static async findAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const nombre = req.query.nombre as string;
      const estado = req.query.estado as string;
      
      // Validar parámetros
      if (page < 1) {
        return res.status(400).json({ message: "La página debe ser mayor a 0" });
      }
      if (limit < 1 || limit > 100) {
        return res.status(400).json({ message: "El límite debe estar entre 1 y 100" });
      }
      
      // Validar estado si se proporciona
      if (estado && !['SinRevisar', 'EnProceso', 'Revisado'].includes(estado)) {
        return res.status(400).json({ 
          message: "El estado debe ser: SinRevisar, EnProceso o Revisado" 
        });
      }

      // Construir filtros
      const filters: { nombre?: string, estado?: string } = {};
      if (nombre) filters.nombre = nombre;
      if (estado) filters.estado = estado;

      const result = await ReporteModel.findAll(page, limit, filters);

      if (!result.reportes || result.reportes.length === 0) {
        return res.status(404).json({ 
          message: "No hay reportes que coincidan con los filtros",
          pagination: result.pagination,
          filters: result.filters
        });
      }

      return res.json(result);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener un reporte por ID
  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const reporte = await ReporteModel.findById(id);

      if (!reporte) {
        return res.status(404).json({ message: "Reporte no encontrado" });
      }

      return res.json(reporte);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener reportes por estado
  static async findByEstado(req: Request, res: Response) {
    try {
      const { estado } = req.params;
      const reportes = await ReporteModel.findByEstado(estado);

      if (!reportes || reportes.length === 0) {
        return res.status(404).json({ message: `No hay reportes con estado: ${estado}` });
      }

      return res.json(reportes);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener reporte por número de registro
  static async findByNumeroRegistro(req: Request, res: Response) {
    try {
      const { numero_registro } = req.params;
      const reporte = await ReporteModel.findByNumeroRegistro(numero_registro);

      if (!reporte) {
        return res.status(404).json({ message: "Reporte no encontrado" });
      }

      return res.json(reporte);
    } catch (error) {
      return handleErrors(res, error);
    }
  }
}
