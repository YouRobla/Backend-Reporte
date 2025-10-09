import { Request, Response } from "express";
import { EvidenceModel } from "../models/EvidenceModel.js";
import { EvidenceSchema, EvidenceUpdateSchema } from "../schemas/EvidenceSchema.js";
import { handleErrors } from "../utils/errorHandler.js";

export class EvidenceController {
  // Crear una evidencia
  static async create(req: Request, res: Response) {
    try {
      const parsedData = EvidenceSchema.parse(req.body);
      const evidence = await EvidenceModel.create(parsedData);

      if (!evidence) {
        return res.status(400).json({ message: "No se pudo crear la evidencia" });
      }

      return res.status(201).json(evidence);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Actualizar una evidencia
  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const parsedData = EvidenceUpdateSchema.parse(req.body);

      // Verificar existencia
      const existingEvidence = await EvidenceModel.findById(id);
      if (!existingEvidence) {
        return res.status(404).json({ message: "Evidencia no encontrada, no se puede actualizar" });
      }

      const updatedEvidence = await EvidenceModel.update(id, parsedData);
      return res.json(updatedEvidence);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Eliminar una evidencia
  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      // Verificar existencia
      const evidence = await EvidenceModel.findById(id);
      if (!evidence) {
        return res.status(404).json({ message: "Evidencia no encontrada, no se puede eliminar" });
      }

      await EvidenceModel.delete(id);
      return res.json({ message: "Evidencia eliminada correctamente" });
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener todas las evidencias
  static async findAll(_req: Request, res: Response) {
    try {
      const evidencias = await EvidenceModel.findAll();

      if (!evidencias || evidencias.length === 0) {
        return res.status(404).json({ message: "No hay evidencias registradas" });
      }

      return res.json(evidencias);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener una evidencia por ID
  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const evidence = await EvidenceModel.findById(id);

      if (!evidence) {
        return res.status(404).json({ message: "Evidencia no encontrada" });
      }

      return res.json(evidence);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener evidencias por reporte ID
  static async findByReporteId(req: Request, res: Response) {
    try {
      const reporteId = parseInt(req.params.reporteId);
      const evidencias = await EvidenceModel.findByReporteId(reporteId);

      if (!evidencias || evidencias.length === 0) {
        return res.status(404).json({ message: "No hay evidencias para este reporte" });
      }

      return res.json(evidencias);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener evidencias por acción ID
  static async findByAccionId(req: Request, res: Response) {
    try {
      const accionId = parseInt(req.params.accionId);
      const evidencias = await EvidenceModel.findByAccionId(accionId);

      if (!evidencias || evidencias.length === 0) {
        return res.status(404).json({ message: "No hay evidencias para esta acción" });
      }

      return res.json(evidencias);
    } catch (error) {
      return handleErrors(res, error);
    }
  }
}
