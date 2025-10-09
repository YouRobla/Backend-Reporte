import cloudinary from "../config/cloudinary.js";
import { EvidenceModel } from "../models/EvidenceModel.js";
import { handleErrors } from "../utils/errorHandler.js";
export class UploadController {
    // Subir una evidencia (imagen o PDF) a Cloudinary
    static async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No se proporcionó ningún archivo" });
            }
            // Convertir buffer a base64
            const base64String = req.file.buffer.toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${base64String}`;
            // Determinar el tipo de recurso para Cloudinary
            const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'auto';
            // Subir a Cloudinary
            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: 'sistema-reportes/evidencias',
                resource_type: resourceType,
                access_mode: "public",
                quality: resourceType === 'raw' ? undefined : 'auto',
                fetch_format: resourceType === 'raw' ? undefined : 'auto'
            });
            // Crear registro en la base de datos
            const evidence = await EvidenceModel.create({
                url: uploadResult.secure_url,
                reporteId: req.body.reporteId ? parseInt(req.body.reporteId) : undefined,
                accionId: req.body.accionId ? parseInt(req.body.accionId) : undefined
            });
            return res.status(201).json({
                message: "Evidencia subida exitosamente",
                evidence: evidence,
                cloudinary: {
                    public_id: uploadResult.public_id,
                    secure_url: uploadResult.secure_url,
                    format: uploadResult.format,
                    width: uploadResult.width,
                    height: uploadResult.height,
                    bytes: uploadResult.bytes,
                    resource_type: uploadResult.resource_type
                }
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Subir múltiples evidencias (imágenes o PDFs) a Cloudinary
    static async uploadMultipleImages(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: "No se proporcionaron archivos" });
            }
            const files = req.files;
            const uploadPromises = files.map(async (file) => {
                // Convertir buffer a base64
                const base64String = file.buffer.toString('base64');
                const dataURI = `data:${file.mimetype};base64,${base64String}`;
                // Determinar el tipo de recurso para Cloudinary
                const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'auto';
                // Subir a Cloudinary
                const uploadResult = await cloudinary.uploader.upload(dataURI, {
                    folder: 'sistema-reportes/evidencias',
                    resource_type: resourceType,
                    access_mode: "public",
                    quality: resourceType === 'raw' ? undefined : 'auto',
                    fetch_format: resourceType === 'raw' ? undefined : 'auto'
                });
                return uploadResult;
            });
            // Subir todas las imágenes en paralelo
            const uploadResults = await Promise.all(uploadPromises);
            // Crear registros en la base de datos
            const evidencePromises = uploadResults.map(async (result) => {
                return await EvidenceModel.create({
                    url: result.secure_url,
                    reporteId: req.body.reporteId ? parseInt(req.body.reporteId) : undefined,
                    accionId: req.body.accionId ? parseInt(req.body.accionId) : undefined
                });
            });
            const evidences = await Promise.all(evidencePromises);
            return res.status(201).json({
                message: `${files.length} evidencias subidas exitosamente`,
                evidences: evidences,
                cloudinary: uploadResults.map(result => ({
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    bytes: result.bytes,
                    resource_type: result.resource_type
                }))
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Eliminar imagen de Cloudinary y base de datos
    static async deleteImage(req, res) {
        try {
            const { id } = req.params;
            // Obtener la evidencia de la base de datos
            const evidence = await EvidenceModel.findById(parseInt(id));
            if (!evidence) {
                return res.status(404).json({ error: "Evidencia no encontrada" });
            }
            // Extraer public_id de la URL
            const urlParts = evidence.url.split('/');
            const publicId = urlParts[urlParts.length - 1].split('.')[0];
            const fullPublicId = `sistema-reportes/evidencias/${publicId}`;
            // Eliminar de Cloudinary
            try {
                await cloudinary.uploader.destroy(fullPublicId);
            }
            catch (cloudinaryError) {
                console.warn('Error eliminando de Cloudinary:', cloudinaryError);
                // Continuar aunque falle la eliminación en Cloudinary
            }
            // Eliminar de la base de datos
            await EvidenceModel.delete(parseInt(id));
            return res.json({
                message: "Imagen eliminada exitosamente",
                deletedEvidence: evidence
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener URL optimizada de una imagen
    static async getOptimizedUrl(req, res) {
        try {
            const { url } = req.query;
            if (!url || typeof url !== 'string') {
                return res.status(400).json({ error: "URL de imagen requerida" });
            }
            // Extraer public_id de la URL
            const urlParts = url.split('/');
            const publicId = urlParts[urlParts.length - 1].split('.')[0];
            const fullPublicId = `sistema-reportes/evidencias/${publicId}`;
            // Generar URL optimizada
            const optimizedUrl = cloudinary.url(fullPublicId, {
                fetch_format: 'auto',
                quality: 'auto',
                width: req.query.width ? parseInt(req.query.width) : undefined,
                height: req.query.height ? parseInt(req.query.height) : undefined,
                crop: req.query.crop || 'auto',
                gravity: req.query.gravity || 'auto'
            });
            return res.json({
                original_url: url,
                optimized_url: optimizedUrl,
                transformations: {
                    width: req.query.width,
                    height: req.query.height,
                    crop: req.query.crop || 'auto',
                    gravity: req.query.gravity || 'auto'
                }
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
}
