# 🔧 Variables de Entorno - Sistema de Reportes

## 📋 Variables Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sistema_reportes"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"

# Server
PORT=3000
NODE_ENV="development"

# Frontend URLs - NUEVAS
FRONTEND_FORMULARIO_URL="https://formulario-web-senati.vercel.app"
FRONTEND_SISTEMA_URL="https://sistema-de-gestion-reportes.vercel.app"
```

## 🌐 URLs de Frontend Configuradas

### ✅ **Formulario Web SENATI**
- **URL:** `https://formulario-web-senati.vercel.app`
- **Propósito:** Formulario para crear reportes
- **CORS:** ✅ Configurado

### ✅ **Sistema de Gestión**
- **URL:** `https://sistema-de-gestion-reportes.vercel.app`
- **Propósito:** Panel de administración
- **CORS:** ✅ Configurado

## 🚀 Configuración CORS

El backend ahora acepta peticiones desde:

### **Desarrollo:**
- `http://localhost:8080`
- `http://localhost:5173`
- `https://formulario-web-senati.vercel.app`
- `https://sistema-de-gestion-reportes.vercel.app`

### **Producción:**
- `https://formulario-web-senati.vercel.app`
- `https://sistema-de-gestion-reportes.vercel.app`
- Cualquier URL definida en `FRONTEND_URL`

## 📝 Notas Importantes

1. **Variables de entorno:** Asegúrate de configurar todas las variables en tu plataforma de despliegue (Render, Vercel, etc.)

2. **CORS dinámico:** El sistema usa variables de entorno para configurar CORS automáticamente

3. **Seguridad:** Las URLs están hardcodeadas como fallback para mayor seguridad

4. **Desarrollo local:** Incluye las URLs de producción para testing local
