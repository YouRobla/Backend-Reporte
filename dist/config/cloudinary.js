import { v2 as cloudinary } from 'cloudinary';
// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'divcb7bem',
    api_key: process.env.CLOUDINARY_API_KEY || '637954943772152',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret_here',
    secure: true,
    // Configuración adicional para documentos
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default'
});
export default cloudinary;
