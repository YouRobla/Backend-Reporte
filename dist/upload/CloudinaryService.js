import cloudinary from '../config/cloudinary.js';
// import { CLOUDINARY_FOLDERS } from '../constants/fileTypes.js';
import { FILE_TYPES } from '../constants/fileTypes.js';
export class CloudinaryService {
    // Determinar el tipo de recurso según el archivo
    static getResourceType(mimetype) {
        return mimetype === 'application/pdf' ? 'raw' : 'auto';
    }
    // Subir un archivo a Cloudinary
    static async uploadFile(file, folder, context = 'evidencias') {
        const base64String = file.buffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${base64String}`;
        const resourceType = context === 'reportes'
            ? FILE_TYPES.REPORTES.cloudinaryResourceType
            : this.getResourceType(file.mimetype);
        const uploadOptions = {
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
    static async uploadMultipleFiles(files, folder, context = 'evidencias') {
        const uploadPromises = files.map(file => this.uploadFile(file, folder, context));
        return await Promise.all(uploadPromises);
    }
    // Eliminar archivo de Cloudinary
    static async deleteFile(publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        }
        catch (error) {
            console.warn('Error eliminando de Cloudinary:', error);
            // No lanzar error para no interrumpir el flujo
        }
    }
    // Generar URL optimizada
    static getOptimizedUrl(publicId, options = {}) {
        return cloudinary.url(publicId, {
            fetch_format: 'auto',
            quality: 'auto',
            ...options
        });
    }
    // Extraer public_id de una URL de Cloudinary
    static extractPublicId(url) {
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];
        return filename.split('.')[0];
    }
}
