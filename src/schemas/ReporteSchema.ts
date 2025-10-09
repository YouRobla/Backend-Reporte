import { z } from "zod";

export const ReporteSchema = z.object({
  numero_registro: z.string().min(1, "El número de registro es requerido").optional(),
  tipo_documento: z.string().trim().min(1, "El tipo de documento es requerido"),
  numero_documento: z.string().trim().min(1, "El número de documento es requerido"),
  nombre_completo: z.string().trim().min(2, "El nombre completo debe tener al menos 2 caracteres"),
  correo_institucional: z.string().trim().email("El correo institucional debe ser válido"),
  nombre_reportante: z.string().trim().min(2, "El nombre del reportante debe tener al menos 2 caracteres"),
  area_texto: z.string().trim().min(1, "El área es requerida"),
  tipo_reporte: z.string().trim().min(1, "El tipo de reporte es requerido"),
  relacionado_con: z.string().trim().min(1, "El campo 'relacionado con' es requerido"),
  lugar_incidente: z.string().trim().min(1, "El lugar del incidente es requerido"),
  descripcion_observacion: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres"),
  estado: z.enum(["SinRevisar", "EnProceso", "Revisado"]).optional().default("SinRevisar")
});

export const ReporteUpdateSchema = ReporteSchema.partial();
