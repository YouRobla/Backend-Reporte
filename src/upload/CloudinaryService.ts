import cloudinary from '../config/cloudinary.js';
import { CLOUDINARY_FOLDERS } from '../constants/fileTypes.js';
import { FILE_TYPES } from '../constants/fileTypes.js';

export interface UploadResult {
  public_id: string;
  secure_url: string;
  format?: string;
  width?: number;
  height?: number;
  bytes: number;
  resource_type: string;
}

export class CloudinaryService {
  // Determinar el tipo de recurso según el archivo
  private static getResourceType(mimetype: string): string {
    return mimetype === 'application/pdf' ? 'raw' : 'auto';
  }

  // Subir un archivo a Cloudinary
  static async uploadFile(
    file: Express.Multer.File, 
    folder: string, 
    context: 'reportes' | 'evidencias' = 'evidencias'
  ): Promise<UploadResult> {
    const base64String = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64String}`;
    
    const resourceType = context === 'reportes' 
      ? FILE_TYPES.REPORTES.cloudinaryResourceType
      : this.getResourceType(file.mimetype);

    const uploadOptions: any = {
      folder,
      resource_type: resourceType
    };

    // Solo aplicar optimizaciones a imágenes
    if (resourceType === 'auto') {
      uploadOptions.quality = 'auto';
      uploadOptions.fetch_format = 'auto';
    }

    return await cloudinary.uploader.upload(dataURI, uploadOptions);
  }

  // Subir múltiples archivos en paralelo
  static async uploadMultipleFiles(
    files: Express.Multer.File[], 
    folder: string, 
    context: 'reportes' | 'evidencias' = 'evidencias'
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => 
      this.uploadFile(file, folder, context)
    );
    
    return await Promise.all(uploadPromises);
  }

  // Eliminar archivo de Cloudinary
  static async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.warn('Error eliminando de Cloudinary:', error);
      // No lanzar error para no interrumpir el flujo
    }
  }

  // Generar URL optimizada
  static getOptimizedUrl(
    publicId: string, 
    options: {
      width?: number;
      height?: number;
      crop?: string;
      gravity?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
      ...options
    });
  }

  // Extraer public_id de una URL de Cloudinary
  static extractPublicId(url: string): string {
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    return filename.split('.')[0];
  }
}
