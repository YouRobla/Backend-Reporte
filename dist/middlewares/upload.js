import multer from 'multer';
// Configuración de multer para manejar archivos en memoria
const storage = multer.memoryStorage();
// Tipos de archivo permitidos para reportes (solo imágenes)
const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
// Tipos de archivo permitidos para evidencias generales (imágenes + documentos)
const evidenceTypes = [
    // Imágenes
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documentos
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'text/plain', // .txt
    'application/rtf' // .rtf
];
// Filtro para reportes (solo imágenes)
const reporteFileFilter = (_req, file, cb) => {
    if (imageTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        const error = new Error('Para reportes solo se permiten imágenes (JPEG, PNG, GIF, WebP)');
        error.statusCode = 400;
        cb(error);
    }
};
// Filtro para evidencias generales (imágenes + documentos)
const evidenceFileFilter = (_req, file, cb) => {
    if (evidenceTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        const error = new Error('Solo se permiten imágenes, PDFs, documentos Word, Excel, PowerPoint y archivos de texto');
        error.statusCode = 400;
        cb(error);
    }
};
// Configuración de multer para reportes (solo imágenes)
export const uploadReportes = multer({
    storage: storage,
    fileFilter: reporteFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB máximo
        files: 3, // Máximo 3 archivos por request
        fieldSize: 10 * 1024 * 1024, // 10MB para campos de texto
        fieldNameSize: 100, // 100 caracteres máximo para nombres de campo
        parts: 20 // Máximo 20 partes en el formulario
    }
});
// Configuración de multer para evidencias generales (imágenes + PDFs)
export const uploadEvidencias = multer({
    storage: storage,
    fileFilter: evidenceFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB máximo
        files: 5 // Máximo 5 archivos por request
    }
});
// Configuración general (mantener compatibilidad)
export const upload = uploadEvidencias;
// Middleware para manejar errores de multer
export const handleUploadError = (error, _req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'El archivo es demasiado grande. Máximo 10MB por archivo.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: 'Demasiados archivos. Máximo 3 archivos por request.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                error: 'Campo de archivo inesperado.'
            });
        }
    }
    // Manejar errores de tipo de archivo
    if (error.message.includes('Para reportes solo se permiten imágenes') ||
        error.message.includes('Solo se permiten imágenes, PDFs')) {
        return res.status(400).json({
            error: error.message
        });
    }
    // Manejar errores con statusCode personalizado
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            error: error.message
        });
    }
    next(error);
};
