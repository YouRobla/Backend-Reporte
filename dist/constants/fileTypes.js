// Tipos de archivo permitidos por contexto
export const FILE_TYPES = {
    // Solo imágenes para reportes
    REPORTES: {
        allowed: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        errorMessage: 'Para reportes solo se permiten imágenes (JPEG, PNG, GIF, WebP)',
        cloudinaryResourceType: 'auto'
    },
    // Imágenes + PDFs para evidencias generales
    EVIDENCIAS: {
        allowed: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf'
        ],
        errorMessage: 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP) y archivos PDF',
        cloudinaryResourceType: 'auto' // Se determina dinámicamente
    }
};
// Límites de archivos
export const FILE_LIMITS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_FILES_PER_REQUEST: 5,
    MAX_FILES_PER_REPORTE: 10
};
// Carpetas de Cloudinary
export const CLOUDINARY_FOLDERS = {
    REPORTES: 'sistema-reportes/reportes',
    EVIDENCIAS: 'sistema-reportes/evidencias',
    ACCIONES: 'sistema-reportes/acciones'
};
