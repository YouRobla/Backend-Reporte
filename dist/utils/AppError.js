// Clase base para errores de la aplicación
export class AppError extends Error {
    statusCode;
    isOperational;
    code;
    constructor(message, statusCode = 500, code) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
// Errores específicos del dominio
export class ValidationError extends AppError {
    constructor(message, _field) {
        super(message, 400, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}
export class NotFoundError extends AppError {
    constructor(resource, id) {
        const message = id ? `${resource} con ID ${id} no encontrado` : `${resource} no encontrado`;
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}
export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 'CONFLICT');
        this.name = 'ConflictError';
    }
}
export class UploadError extends AppError {
    constructor(message, code = 'UPLOAD_ERROR') {
        super(message, 400, code);
        this.name = 'UploadError';
    }
}
export class CloudinaryError extends AppError {
    constructor(message) {
        super(message, 500, 'CLOUDINARY_ERROR');
        this.name = 'CloudinaryError';
    }
}
