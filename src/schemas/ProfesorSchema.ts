import { z } from "zod";

export const ProfesorSchema = z.object({
  nombre_completo: z.string().trim().min(2, "El nombre completo debe tener al menos 2 caracteres"),
  correo:z.email("El correo debe ser válido"),
  area: z.string().trim().optional(),
  cargo: z.string().trim().optional(),
  activo: z.boolean().optional().default(true)
});

export const ProfesorUpdateSchema = ProfesorSchema.partial();

export const ProfesorSearchSchema = z.object({
  termino: z.string().trim().min(1, "El término de búsqueda es requerido")
});

export const ProfesorFiltersSchema = z.object({
  activo: z.boolean().optional(),
  area: z.string().trim().optional()
});
