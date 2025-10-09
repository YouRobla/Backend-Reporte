import { Request, Response } from "express";
import { AccionModel } from "../models/AccionModel.js";
import { EvidenceModel } from "../models/EvidenceModel.js";
import { AccionSchema, AccionUpdateSchema } from "../schemas/AccionSchema.js";
import { handleErrors } from "../utils/errorHandler.js";
import cloudinary from "../config/cloudinary.js";

export class AccionController {
  // Crear una acción
  static async create(req: Request, res: Response) {
    try {
      const parsedData = AccionSchema.parse(req.body);
      const accion = await AccionModel.create(parsedData);

      if (!accion) {
        return res.status(400).json({ message: "No se pudo crear la acción" });
      }

      // Actualizar estado del reporte automáticamente
      await AccionModel.actualizarEstadoReporte(accion.reporteId);

      return res.status(201).json(accion);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Crear acción completa con evidencias
  static async createCompleta(req: Request, res: Response) {
    try {
      // 1. Extraer datos del form-data
      const accionData = {
        descripcion: req.body.descripcion,
        reporteId: parseInt(req.body.reporteId)
      };

      // 2. Validar datos de la acción
      const validatedData = AccionSchema.parse(accionData);
      
      // 3. Crear la acción en la base de datos
      const accion = await AccionModel.create(validatedData);
      
      if (!accion) {
        return res.status(400).json({ message: "No se pudo crear la acción" });
      }

      // 4. Procesar evidencias si existen
      let evidencias: any[] = [];
      
      if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        const files = req.files as Express.Multer.File[];
        
        // Filtrar archivos válidos (que tengan contenido)
        const validFiles = files.filter(file => file.size > 0 && file.buffer.length > 0);
        
        if (validFiles.length > 0) {
          // Subir archivos a Cloudinary (imágenes y documentos)
          const uploadPromises = validFiles.map(async (file) => {
            const base64String = file.buffer.toString('base64');
            const dataURI = `data:${file.mimetype};base64,${base64String}`;
            
            // Determinar si es documento o imagen
            const isDocument = [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'application/vnd.ms-powerpoint',
              'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              'text/plain',
              'application/rtf'
            ].includes(file.mimetype);
            
            const resourceType = isDocument ? 'raw' : 'auto';
            const publicId = `${file.originalname.split('.')[0]}_${Date.now()}.${file.originalname.split('.').pop()}`;

                    const uploadResult = await cloudinary.uploader.upload(dataURI, {
                      folder: `sistema-reportes/acciones/${accion.id}`,
                      resource_type: resourceType,
                      public_id: publicId,
                      access_mode: "public",
                      quality: resourceType === 'raw' ? undefined : 'auto',
                      fetch_format: resourceType === 'raw' ? undefined : 'auto'
                    });

            return uploadResult;
          });

          const uploadResults = await Promise.all(uploadPromises);

          // Crear registros de evidencias en la base de datos
          const evidencePromises = uploadResults.map(async (result) => {
            return await EvidenceModel.create({
              url: result.secure_url,
              accionId: accion.id
            });
          });

          evidencias = await Promise.all(evidencePromises);
        }
      }

      // 5. Actualizar estado del reporte automáticamente
      await AccionModel.actualizarEstadoReporte(accion.reporteId);

      // 6. Obtener la acción completa con evidencias
      const accionCompleta = await AccionModel.findById(accion.id);

      return res.status(201).json({
        message: "Acción creada exitosamente con evidencias",
        accion: accionCompleta,
        evidencias: evidencias,
        totalEvidencias: evidencias.length
      });

    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Actualizar una acción
  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const parsedData = AccionUpdateSchema.parse(req.body);

      // Verificar existencia
      const existingAccion = await AccionModel.findById(id);
      if (!existingAccion) {
        return res.status(404).json({ message: "Acción no encontrada, no se puede actualizar" });
      }

      const updatedAccion = await AccionModel.update(id, parsedData);
      
      // Actualizar estado del reporte automáticamente
      await AccionModel.actualizarEstadoReporte(existingAccion.reporteId);
      
      return res.json(updatedAccion);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Eliminar una acción
  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      // Verificar existencia
      const accion = await AccionModel.findById(id);
      if (!accion) {
        return res.status(404).json({ message: "Acción no encontrada, no se puede eliminar" });
      }

      await AccionModel.delete(id);
      return res.json({ message: "Acción eliminada correctamente" });
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener todas las acciones
  static async findAll(_req: Request, res: Response) {
    try {
      const acciones = await AccionModel.findAll();

      if (!acciones || acciones.length === 0) {
        return res.status(404).json({ message: "No hay acciones registradas" });
      }

      return res.json(acciones);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener una acción por ID
  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const accion = await AccionModel.findById(id);

      if (!accion) {
        return res.status(404).json({ message: "Acción no encontrada" });
      }

      return res.json(accion);
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Obtener acciones por reporte ID
  static async findByReporteId(req: Request, res: Response) {
    try {
      const reporteId = parseInt(req.params.reporteId);
      const acciones = await AccionModel.findByReporteId(reporteId);

      // Siempre devolver 200 OK, incluso si está vacío
      return res.status(200).json({
        acciones: acciones || [],
        total: acciones ? acciones.length : 0,
        message: acciones && acciones.length > 0 
          ? `Se encontraron ${acciones.length} acciones` 
          : "No hay acciones para este reporte"
      });
    } catch (error) {
      return handleErrors(res, error);
    }
  }

  // Agregar evidencias a una acción
  static async agregarEvidencias(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const accionId = parseInt(id);

      // Verificar que la acción existe
      const accion = await AccionModel.findById(accionId);
      if (!accion) {
        return res.status(404).json({ message: "Acción no encontrada" });
      }

      // Procesar nuevas evidencias
      let nuevasEvidencias: any[] = [];
      if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        const files = req.files as Express.Multer.File[];
        
        // Filtrar archivos válidos
        const validFiles = files.filter(file => file.size > 0 && file.buffer.length > 0);
        
        if (validFiles.length > 0) {
          // Subir archivos a Cloudinary (imágenes y documentos)
          const uploadPromises = validFiles.map(async (file) => {
            const base64String = file.buffer.toString('base64');
            const dataURI = `data:${file.mimetype};base64,${base64String}`;
            
            // Determinar si es documento o imagen
            const isDocument = [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'application/vnd.ms-powerpoint',
              'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              'text/plain',
              'application/rtf'
            ].includes(file.mimetype);
            
            const resourceType = isDocument ? 'raw' : 'auto';
            const publicId = `${file.originalname.split('.')[0]}_${Date.now()}.${file.originalname.split('.').pop()}`;

                    const uploadResult = await cloudinary.uploader.upload(dataURI, {
                      folder: `sistema-reportes/acciones/${accionId}`,
                      resource_type: resourceType,
                      public_id: publicId,
                      access_mode: "public",
                      quality: resourceType === 'raw' ? undefined : 'auto',
                      fetch_format: resourceType === 'raw' ? undefined : 'auto'
                    });

            return uploadResult;
          });

          const uploadResults = await Promise.all(uploadPromises);

          // Crear registros de evidencias en la base de datos
          const evidencePromises = uploadResults.map(async (result) => {
            return await EvidenceModel.create({
              url: result.secure_url,
              accionId: accionId
            });
          });

          nuevasEvidencias = await Promise.all(evidencePromises);
        }
      }

      // Obtener la acción actualizada
      const accionActualizada = await AccionModel.findById(accionId);

      return res.status(201).json({
        message: "Evidencias agregadas exitosamente a la acción",
        accion: accionActualizada,
        nuevasEvidencias: nuevasEvidencias,
        totalEvidencias: nuevasEvidencias.length
      });

    } catch (error) {
      return handleErrors(res, error);
    }
  }
}
