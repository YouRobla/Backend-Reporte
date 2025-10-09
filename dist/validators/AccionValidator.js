import { z } from 'zod';
// Esquema base para acciones
export const AccionBaseSchema = z.object({
    descripcion: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
    reporteId: z.number().int().positive("El ID del reporte debe ser un número entero positivo")
});
// Esquema para crear acción
export const AccionCreateSchema = AccionBaseSchema;
// Esquema para actualizar acción
export const AccionUpdateSchema = AccionBaseSchema.partial();
// Validador de clase para acciones
export class AccionValidator {
    static validateCreate(data) {
        return AccionCreateSchema.parse(data);
    }
    static validateUpdate(data) {
        return AccionUpdateSchema.parse(data);
    }
    static validateId(id) {
        const numId = typeof id === 'string' ? parseInt(id) : id;
        if (isNaN(numId) || numId <= 0) {
            throw new Error('ID debe ser un número entero positivo');
        }
        return numId;
    }
}
