import { z } from 'zod';
// Esquema base para reportes
export const ReporteBaseSchema = z.object({
    numero_registro: z.string().min(1, "El número de registro es requerido"),
    tipo_documento: z.string().min(1, "El tipo de documento es requerido"),
    numero_documento: z.string().min(1, "El número de documento es requerido"),
    nombre_completo: z.string().min(2, "El nombre completo debe tener al menos 2 caracteres"),
    correo_institucional: z.string().email("El correo institucional debe ser válido"),
    nombre_reportante: z.string().min(2, "El nombre del reportante debe tener al menos 2 caracteres"),
    area_texto: z.string().min(1, "El área es requerida"),
    tipo_reporte: z.string().min(1, "El tipo de reporte es requerido"),
    relacionado_con: z.string().min(1, "El campo 'relacionado con' es requerido"),
    lugar_incidente: z.string().min(1, "El lugar del incidente es requerido"),
    descripcion_observacion: z.string().min(10, "La descripción debe tener al menos 10 caracteres")
});
// Esquema para crear reporte
export const ReporteCreateSchema = ReporteBaseSchema.extend({
    estado: z.enum(["SinRevisar", "EnProceso", "Revisado"]).optional()
});
// Esquema para actualizar reporte
export const ReporteUpdateSchema = ReporteCreateSchema.partial();
// Esquema para validar estado
export const ReporteEstadoSchema = z.enum(["SinRevisar", "EnProceso", "Revisado"]);
// Validador de clase para reportes
export class ReporteValidator {
    static validateCreate(data) {
        return ReporteCreateSchema.parse(data);
    }
    static validateUpdate(data) {
        return ReporteUpdateSchema.parse(data);
    }
    static validateEstado(estado) {
        return ReporteEstadoSchema.parse(estado);
    }
    static validateId(id) {
        const numId = typeof id === 'string' ? parseInt(id) : id;
        if (isNaN(numId) || numId <= 0) {
            throw new Error('ID debe ser un número entero positivo');
        }
        return numId;
    }
}
