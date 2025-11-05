import { z } from "zod";
export const ReporteSchema = z.object({
    numero_registro: z.string().min(1, "El número de registro es requerido").optional(),
    tipo_documento: z.string().trim().min(1, "El tipo de documento es requerido"),
    numero_documento: z.string().trim().min(1, "El número de documento es requerido"),
    sede: z.string().trim().min(1, "La sede es requerida"),
    tipo_reporte: z.string().trim().min(1, "El tipo de reporte es requerido"),
    lugar_incidente: z.string().trim().min(1, "El lugar del incidente es requerido"),
    descripcion_observacion: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres"),
    acciones_tomadas: z.string().trim().optional(),
    estado: z.enum(["SinRevisar", "EnProceso", "Revisado"]).optional().default("SinRevisar")
});
export const ReporteUpdateSchema = ReporteSchema.partial();
