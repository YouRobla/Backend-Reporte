import { ProfesorModel } from "../models/ProfesorModel.js";
import { ProfesorSchema, ProfesorUpdateSchema, ProfesorFiltersSchema } from "../schemas/ProfesorSchema.js";
import { handleErrors } from "../utils/errorHandler.js";
export class ProfesorController {
    // Crear un profesor/destinatario
    static async create(req, res) {
        try {
            const parsedData = ProfesorSchema.parse(req.body);
            const profesor = await ProfesorModel.create(parsedData);
            if (!profesor) {
                return res.status(400).json({ message: "No se pudo crear el profesor" });
            }
            return res.status(201).json({
                message: "Profesor creado exitosamente",
                profesor: profesor
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Actualizar un profesor
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const parsedData = ProfesorUpdateSchema.parse(req.body);
            // Verificar existencia
            const existingProfesor = await ProfesorModel.findById(id);
            if (!existingProfesor) {
                return res.status(404).json({ message: "Profesor no encontrado, no se puede actualizar" });
            }
            const updatedProfesor = await ProfesorModel.update(id, parsedData);
            return res.json({
                message: "Profesor actualizado exitosamente",
                profesor: updatedProfesor
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Eliminar un profesor
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            // Verificar existencia
            const profesor = await ProfesorModel.findById(id);
            if (!profesor) {
                return res.status(404).json({ message: "Profesor no encontrado, no se puede eliminar" });
            }
            await ProfesorModel.delete(id);
            return res.json({
                message: "Profesor eliminado correctamente",
                profesor: profesor
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener todos los profesores
    static async findAll(req, res) {
        try {
            const { activo, area } = req.query;
            // Validar filtros
            const filters = ProfesorFiltersSchema.parse({
                activo: activo ? activo === 'true' : undefined,
                area: area
            });
            const profesores = await ProfesorModel.findAll(filters);
            return res.json({
                profesores: profesores,
                total: profesores.length,
                filtros: {
                    activo: filters.activo || null,
                    area: filters.area || null
                }
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener un profesor por ID
    static async findById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const profesor = await ProfesorModel.findById(id);
            if (!profesor) {
                return res.status(404).json({ message: "Profesor no encontrado" });
            }
            return res.json(profesor);
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Obtener profesores activos (para envío de correos)
    static async findActivos(_req, res) {
        try {
            const profesores = await ProfesorModel.findActivos();
            return res.json({
                profesores: profesores,
                total: profesores.length,
                message: `Se encontraron ${profesores.length} profesores activos`
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Buscar profesores
    static async search(req, res) {
        try {
            const { termino } = req.query;
            if (!termino || typeof termino !== 'string') {
                return res.status(400).json({ message: "Término de búsqueda requerido" });
            }
            const profesores = await ProfesorModel.search(termino);
            return res.json({
                profesores: profesores,
                total: profesores.length,
                termino: termino,
                message: `Se encontraron ${profesores.length} profesores para "${termino}"`
            });
        }
        catch (error) {
            return handleErrors(res, error);
        }
    }
    // Cambiar estado activo/inactivo
    static async toggleActivo(req, res) {
        try {
            const id = parseInt(req.params.id);
            const profesor = await ProfesorModel.toggleActivo(id);
            return res.json({
                message: `Profesor ${profesor.activo ? 'activado' : 'desactivado'} exitosamente`,
                profesor: profesor
            });
        }
        catch (error) {
            if (error.message === 'Profesor no encontrado') {
                return res.status(404).json({ message: error.message });
            }
            return handleErrors(res, error);
        }
    }
}
