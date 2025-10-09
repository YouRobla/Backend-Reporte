import { EvidenceModel } from '../models/EvidenceModel.js';
import { CloudinaryService } from '../upload/CloudinaryService.js';
import { CLOUDINARY_FOLDERS } from '../constants/fileTypes.js';
import { EvidenceValidator } from '../validators/EvidenceValidator.js';

export class EvidenceService {
  // Subir una evidencia
  static async uploadEvidence(
    file: Express.Multer.File,
    reporteId?: number,
    accionId?: number
  ) {
    const folder = `${CLOUDINARY_FOLDERS.EVIDENCIAS}`;
    const uploadResult = await CloudinaryService.uploadFile(file, folder, 'evidencias');
    
    const evidence = await EvidenceModel.create({
      url: uploadResult.secure_url,
      reporteId,
      accionId
    });

    return {
      evidence,
      cloudinary: uploadResult
    };
  }

  // Subir múltiples evidencias
  static async uploadMultipleEvidences(
    files: Express.Multer.File[],
    reporteId?: number,
    accionId?: number
  ) {
    const folder = `${CLOUDINARY_FOLDERS.EVIDENCIAS}`;
    const uploadResults = await CloudinaryService.uploadMultipleFiles(files, folder, 'evidencias');
    
    const evidencePromises = uploadResults.map(result => 
      EvidenceModel.create({
        url: result.secure_url,
        reporteId,
        accionId
      })
    );
    
    const evidences = await Promise.all(evidencePromises);

    return {
      evidences,
      cloudinary: uploadResults
    };
  }

  // Eliminar evidencia
  static async deleteEvidence(id: number) {
    const evidence = await EvidenceModel.findById(id);
    if (!evidence) {
      throw new Error('Evidencia no encontrada');
    }

    // Extraer public_id y eliminar de Cloudinary
    const publicId = CloudinaryService.extractPublicId(evidence.url);
    await CloudinaryService.deleteFile(publicId);

    // Eliminar de la base de datos
    await EvidenceModel.delete(id);

    return {
      message: 'Evidencia eliminada exitosamente',
      deletedEvidence: evidence
    };
  }

  // Obtener evidencia por ID
  static async getEvidenceById(id: number) {
    const evidence = await EvidenceModel.findById(id);
    if (!evidence) {
      throw new Error('Evidencia no encontrada');
    }
    return evidence;
  }

  // Obtener evidencias por reporte
  static async getEvidencesByReporte(reporteId: number) {
    const evidences = await EvidenceModel.findByReporteId(reporteId);
    if (!evidences || evidences.length === 0) {
      throw new Error('No hay evidencias para este reporte');
    }
    return evidences;
  }

  // Obtener evidencias por acción
  static async getEvidencesByAccion(accionId: number) {
    const evidences = await EvidenceModel.findByAccionId(accionId);
    if (!evidences || evidences.length === 0) {
      throw new Error('No hay evidencias para esta acción');
    }
    return evidences;
  }

  // Generar URL optimizada
  static getOptimizedUrl(url: string, options: any = {}) {
    const publicId = CloudinaryService.extractPublicId(url);
    return CloudinaryService.getOptimizedUrl(publicId, options);
  }
}
