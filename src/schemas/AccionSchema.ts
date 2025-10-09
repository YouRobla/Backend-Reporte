import { z } from "zod";

export const AccionSchema = z.object({
  descripcion: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
  reporteId: z.number().int().positive("El ID del reporte debe ser un número entero positivo")
});

export const AccionUpdateSchema = AccionSchema.partial();
