import { z } from 'zod';

// Esquema base para evidencias
export const EvidenceBaseSchema = z.object({
  url: z.string().url("La URL debe ser válida"),
  reporteId: z.number().int().positive("El ID del reporte debe ser un número entero positivo").optional(),
  accionId: z.number().int().positive("El ID de la acción debe ser un número entero positivo").optional()
}).refine(
  (data) => data.reporteId || data.accionId,
  {
    message: "Debe especificar al menos un reporteId o accionId",
    path: ["reporteId", "accionId"]
  }
);

// Esquema para crear evidencia
export const EvidenceCreateSchema = EvidenceBaseSchema;

// Esquema para actualizar evidencia
export const EvidenceUpdateSchema = EvidenceBaseSchema.partial();

// Esquema para subida de archivos (sin URL, se genera automáticamente)
export const EvidenceUploadSchema = z.object({
  reporteId: z.number().int().positive("El ID del reporte debe ser un número entero positivo").optional(),
  accionId: z.number().int().positive("El ID de la acción debe ser un número entero positivo").optional()
}).refine(
  (data) => data.reporteId || data.accionId,
  {
    message: "Debe especificar al menos un reporteId o accionId",
    path: ["reporteId", "accionId"]
  }
);

// Validador de clase para evidencias
export class EvidenceValidator {
  static validateCreate(data: unknown) {
    return EvidenceCreateSchema.parse(data);
  }

  static validateUpdate(data: unknown) {
    return EvidenceUpdateSchema.parse(data);
  }

  static validateUpload(data: unknown) {
    return EvidenceUploadSchema.parse(data);
  }

  static validateId(id: string | number) {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    if (isNaN(numId) || numId <= 0) {
      throw new Error('ID debe ser un número entero positivo');
    }
    return numId;
  }
}
