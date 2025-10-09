import { z } from "zod";

export const EvidenceSchema = z.object({
  url: z.url("La URL debe ser válida"),
  reporteId: z.number().int().positive("El ID del reporte debe ser un número entero positivo").optional(),
  accionId: z.number().int().positive("El ID de la acción debe ser un número entero positivo").optional()
}).refine(
  (data) => data.reporteId || data.accionId,
  {
    message: "Debe especificar al menos un reporteId o accionId",
    path: ["reporteId", "accionId"]
  }
);

export const EvidenceUpdateSchema = EvidenceSchema.partial();

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
