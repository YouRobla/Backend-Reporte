# 📁 Tipos de Archivos Permitidos - Sistema de Reportes

## 🎯 **Configuración por Contexto**

### **📋 Para Reportes** (Solo Imágenes)
- **Rutas**: `/api/reportes-completos/*`
- **Tipos permitidos**: 
  - `image/jpeg`
  - `image/jpg` 
  - `image/png`
  - `image/gif`
  - `image/webp`
- **Middleware**: `uploadReportes`
- **Propósito**: Evidencias visuales del incidente

### **📎 Para Evidencias Generales** (Imágenes + PDFs)
- **Rutas**: `/api/upload/*`
- **Tipos permitidos**:
  - `image/jpeg`
  - `image/jpg`
  - `image/png` 
  - `image/gif`
  - `image/webp`
  - `application/pdf`
- **Middleware**: `uploadEvidencias`
- **Propósito**: Documentación adicional, reportes, etc.

## 🔧 **Configuración Técnica**

### **Middleware de Upload**
```typescript
// Para reportes (solo imágenes)
export const uploadReportes = multer({
  fileFilter: reporteFileFilter, // Solo imágenes
  limits: { fileSize: 10MB, files: 5 }
});

// Para evidencias generales (imágenes + PDFs)
export const uploadEvidencias = multer({
  fileFilter: evidenceFileFilter, // Imágenes + PDFs
  limits: { fileSize: 10MB, files: 5 }
});
```

### **Cloudinary Configuration**
```typescript
// Para imágenes (reportes y evidencias)
resource_type: 'auto'
quality: 'auto'
fetch_format: 'auto'

// Para PDFs (solo evidencias generales)
resource_type: 'raw'
// Sin optimización para PDFs
```

## 📊 **Endpoints y Restricciones**

| Endpoint | Tipos Permitidos | Middleware | Uso |
|----------|------------------|------------|-----|
| `POST /api/reportes-completos/completo` | Solo imágenes | `uploadReportes` | Crear reporte con evidencias |
| `POST /api/reportes-completos/{id}/evidencias` | Solo imágenes | `uploadReportes` | Agregar evidencias a reporte |
| `POST /api/upload/single` | Imágenes + PDFs | `uploadEvidencias` | Subir evidencia general |
| `POST /api/upload/multiple` | Imágenes + PDFs | `uploadEvidencias` | Subir múltiples evidencias |

## 🚫 **Restricciones de Seguridad**

### **Archivos Bloqueados**
- ❌ Ejecutables (`.exe`, `.bat`, `.sh`)
- ❌ Scripts (`.js`, `.php`, `.py`)
- ❌ Archivos comprimidos (`.zip`, `.rar`)
- ❌ Videos (`.mp4`, `.avi`, `.mov`)
- ❌ Audio (`.mp3`, `.wav`)

### **Límites de Tamaño**
- 📏 **Máximo por archivo**: 10MB
- 📁 **Máximo por request**: 5 archivos
- 🗂️ **Total por reporte**: Sin límite (controlado por el frontend)

## 💡 **Ejemplos de Uso**

### **Crear Reporte con Imágenes**
```javascript
// ✅ CORRECTO - Solo imágenes
const formData = new FormData();
formData.append('numero_registro', 'REP-001');
formData.append('evidencias', imagen1); // .jpg
formData.append('evidencias', imagen2); // .png

fetch('/api/reportes-completos/completo', {
  method: 'POST',
  body: formData
});
```

### **Subir Evidencias Generales**
```javascript
// ✅ CORRECTO - Imágenes y PDFs
const formData = new FormData();
formData.append('files', imagen); // .jpg
formData.append('files', documento); // .pdf

fetch('/api/upload/multiple', {
  method: 'POST',
  body: formData
});
```

### **❌ Errores Comunes**
```javascript
// ❌ ERROR - PDF en reporte
formData.append('evidencias', documento.pdf); // No permitido

// ❌ ERROR - Archivo no soportado
formData.append('files', video.mp4); // No permitido
```

## 🔍 **Validación en Frontend**

### **HTML Input**
```html
<!-- Para reportes (solo imágenes) -->
<input type="file" 
       id="evidencias-reporte" 
       multiple 
       accept="image/*" />

<!-- Para evidencias generales (imágenes + PDFs) -->
<input type="file" 
       id="evidencias-generales" 
       multiple 
       accept="image/*,application/pdf" />
```

### **JavaScript Validation**
```javascript
// Validar antes de enviar
function validateFiles(files, isReporte = false) {
  const allowedTypes = isReporte 
    ? ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    : ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  
  for (let file of files) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no permitido: ${file.name}`);
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error(`Archivo demasiado grande: ${file.name}`);
    }
  }
}
```

## 📈 **Optimizaciones de Cloudinary**

### **Para Imágenes**
- ✅ Auto-formato (WebP cuando es posible)
- ✅ Auto-calidad (optimización automática)
- ✅ Redimensionamiento bajo demanda
- ✅ Transformaciones en tiempo real

### **Para PDFs**
- ✅ Almacenamiento seguro
- ✅ URLs de descarga directa
- ✅ Sin procesamiento (archivos raw)
- ✅ Metadatos preservados

## 🎯 **Recomendaciones**

1. **Usar el endpoint correcto** según el contexto
2. **Validar archivos** en el frontend antes de enviar
3. **Mostrar preview** de imágenes antes de subir
4. **Indicar tipos permitidos** en la UI
5. **Manejar errores** de validación amigablemente
