import { Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError, ValidationError, NotFoundError, ConflictError, UploadError, CloudinaryError } from "./AppError.js";

export function handleErrors(res: Response, error: any) {
  console.error("Error:", error);

  // Errores de la aplicación
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      ...(error instanceof ValidationError && { field: error.message })
    });
  }

  // Errores de validación de Zod
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
      code: e.code,
    }));

    return res.status(400).json({ 
      error: "Error de validación",
      code: "VALIDATION_ERROR",
      errors: formattedErrors 
    });
  }

  // Errores conocidos de Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return res.status(409).json({
          error: "Ya existe un registro con ese valor único",
          code: "UNIQUE_CONSTRAINT_VIOLATION",
          fields: error.meta?.target || [],
        });

      case "P2003":
        return res.status(400).json({
          error: "No se puede crear o actualizar: el registro relacionado no existe",
          code: "FOREIGN_KEY_CONSTRAINT_VIOLATION",
          fields: error.meta?.field_name ? [error.meta.field_name] : [],
        });

      case "P2025":
        return res.status(404).json({
          error: "Registro no encontrado",
          code: "RECORD_NOT_FOUND"
        });

      default:
        return res.status(400).json({
          error: `Error de base de datos: ${error.message}`,
          code: "DATABASE_ERROR"
        });
    }
  }

  // Otros errores conocidos de Prisma
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(500).json({
      error: "Error desconocido de base de datos",
      code: "UNKNOWN_DATABASE_ERROR"
    });
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(500).json({
      error: "Error interno de base de datos",
      code: "DATABASE_PANIC_ERROR"
    });
  }

  // Error genérico
  return res.status(500).json({ 
    error: error?.message || "Error interno del servidor",
    code: "INTERNAL_SERVER_ERROR"
  });
}

// Función helper para crear errores específicos
export const createError = {
  validation: (message: string, field?: string) => new ValidationError(message, field),
  notFound: (resource: string, id?: string | number) => new NotFoundError(resource, id),
  conflict: (message: string) => new ConflictError(message),
  upload: (message: string, code?: string) => new UploadError(message, code),
  cloudinary: (message: string) => new CloudinaryError(message)
};