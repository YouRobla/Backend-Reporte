import multer from 'multer';
import { Request } from 'express';
import { FILE_TYPES, FILE_LIMITS } from '../constants/fileTypes.js';

// Factory para crear configuraciones de multer
export class UploadFactory {
  static createConfig(context: 'reportes' | 'evidencias') {
    const storage = multer.memoryStorage();
    const config = FILE_TYPES[context.toUpperCase() as keyof typeof FILE_TYPES];
    
    const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (config.allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(config.errorMessage));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: FILE_LIMITS.MAX_FILE_SIZE,
        files: context === 'reportes' 
          ? FILE_LIMITS.MAX_FILES_PER_REPORTE 
          : FILE_LIMITS.MAX_FILES_PER_REQUEST
      }
    });
  }

  static getReportesUpload() {
    return this.createConfig('reportes');
  }

  static getEvidenciasUpload() {
    return this.createConfig('evidencias');
  }
}
