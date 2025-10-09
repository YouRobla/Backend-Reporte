import { Response } from 'express';
import multer from 'multer';

export class UploadErrorHandler {
  static handle(error: any, _req: any, res: Response, next: any) {
    if (error instanceof multer.MulterError) {
      return this.handleMulterError(error, res);
    }
    
    if (error.message.includes('Tipo de archivo no permitido') || 
        error.message.includes('Para reportes solo se permiten') ||
        error.message.includes('Solo se permiten imágenes')) {
      return res.status(400).json({
        error: error.message,
        code: 'INVALID_FILE_TYPE'
      });
    }
    
    next(error);
  }

  private static handleMulterError(error: multer.MulterError, res: Response) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          error: 'El archivo es demasiado grande. Máximo 10MB por archivo.',
          code: 'FILE_TOO_LARGE',
          maxSize: '10MB'
        });

      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          error: 'Demasiados archivos. Máximo 5 archivos por request.',
          code: 'TOO_MANY_FILES',
          maxFiles: 5
        });

      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          error: 'Campo de archivo inesperado.',
          code: 'UNEXPECTED_FILE_FIELD'
        });

      default:
        return res.status(400).json({
          error: `Error de upload: ${error.message}`,
          code: 'UPLOAD_ERROR'
        });
    }
  }
}
