# 📋 Ejemplos de Uso de la API - Sistema de Reportes

## 🚀 Flujos de Creación de Reportes

### **Opción 1: Crear Reporte Completo (Recomendado)**
Crear reporte con todas las evidencias en una sola petición.

```javascript
// POST /api/reportes-completos/completo
// Content-Type: multipart/form-data

const formData = new FormData();

// Datos del reporte
formData.append('numero_registro', 'REP-2024-001');
formData.append('tipo_documento', 'DNI');
formData.append('numero_documento', '12345678');
formData.append('nombre_completo', 'Juan Pérez');
formData.append('correo_institucional', 'juan.perez@institucion.edu');
formData.append('nombre_reportante', 'María García');
formData.append('area_texto', 'Área de Sistemas');
formData.append('tipo_reporte', 'Incidente de Seguridad');
formData.append('relacionado_con', 'Acceso no autorizado');
formData.append('lugar_incidente', 'Oficina 205');
formData.append('descripcion_observacion', 'Se detectó acceso no autorizado al sistema...');

// Evidencias (múltiples archivos)
formData.append('evidencias', archivo1); // File object
formData.append('evidencias', archivo2); // File object
formData.append('evidencias', archivo3); // File object

// Enviar petición
fetch('/api/reportes-completos/completo', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Reporte creado:', data.reporte);
  console.log('Evidencias:', data.evidencias);
});
```

### **Opción 2: Crear Reporte Paso a Paso**

#### **Paso 1: Crear reporte básico**
```javascript
// POST /api/reportes-completos/basico
// Content-Type: application/json

const reporteData = {
  numero_registro: 'REP-2024-001',
  tipo_documento: 'DNI',
  numero_documento: '12345678',
  nombre_completo: 'Juan Pérez',
  correo_institucional: 'juan.perez@institucion.edu',
  nombre_reportante: 'María García',
  area_texto: 'Área de Sistemas',
  tipo_reporte: 'Incidente de Seguridad',
  relacionado_con: 'Acceso no autorizado',
  lugar_incidente: 'Oficina 205',
  descripcion_observacion: 'Se detectó acceso no autorizado al sistema...'
};

fetch('/api/reportes-completos/basico', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(reporteData)
})
.then(response => response.json())
.then(data => {
  console.log('Reporte creado:', data.reporte);
  // Guardar el ID del reporte para el siguiente paso
  const reporteId = data.reporte.id;
});
```

#### **Paso 2: Agregar evidencias**
```javascript
// POST /api/reportes-completos/{reporteId}/evidencias
// Content-Type: multipart/form-data

const formData = new FormData();
formData.append('evidencias', archivo1);
formData.append('evidencias', archivo2);

fetch(`/api/reportes-completos/${reporteId}/evidencias`, {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Evidencias agregadas:', data.nuevasEvidencias);
});
```

## 📱 Ejemplos para Frontend (React/Vue/Angular)

### **React con Axios**
```jsx
import axios from 'axios';

const CrearReporte = () => {
  const [formData, setFormData] = useState({
    numero_registro: '',
    tipo_documento: '',
    // ... otros campos
  });
  const [archivos, setArchivos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    
    // Agregar datos del formulario
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    // Agregar archivos
    archivos.forEach(archivo => {
      data.append('evidencias', archivo);
    });

    try {
      const response = await axios.post('/api/reportes-completos/completo', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('Reporte creado:', response.data);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      <input 
        type="file" 
        multiple 
        onChange={(e) => setArchivos(Array.from(e.target.files))}
      />
      <button type="submit">Crear Reporte</button>
    </form>
  );
};
```

### **JavaScript Vanilla**
```javascript
// Función para crear reporte completo
async function crearReporteCompleto(datosReporte, archivos) {
  const formData = new FormData();
  
  // Agregar datos del reporte
  Object.keys(datosReporte).forEach(key => {
    formData.append(key, datosReporte[key]);
  });
  
  // Agregar archivos
  archivos.forEach(archivo => {
    formData.append('evidencias', archivo);
  });

  try {
    const response = await fetch('/api/reportes-completos/completo', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Reporte creado exitosamente');
      console.log('Reporte:', data.reporte);
      console.log('Evidencias:', data.evidencias);
      return data;
    } else {
      console.error('❌ Error:', data);
      throw new Error(data.error || 'Error al crear reporte');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Uso de la función
const datosReporte = {
  numero_registro: 'REP-2024-001',
  tipo_documento: 'DNI',
  numero_documento: '12345678',
  nombre_completo: 'Juan Pérez',
  correo_institucional: 'juan.perez@institucion.edu',
  nombre_reportante: 'María García',
  area_texto: 'Área de Sistemas',
  tipo_reporte: 'Incidente de Seguridad',
  relacionado_con: 'Acceso no autorizado',
  lugar_incidente: 'Oficina 205',
  descripcion_observacion: 'Se detectó acceso no autorizado al sistema...'
};

const archivos = document.getElementById('evidencias').files;

crearReporteCompleto(datosReporte, archivos)
  .then(data => {
    alert('Reporte creado exitosamente');
    // Redirigir o limpiar formulario
  })
  .catch(error => {
    alert('Error: ' + error.message);
  });
```

## 🔄 Flujo Completo Recomendado

### **1. Preparación del Formulario**
```html
<form id="reporteForm" enctype="multipart/form-data">
  <input type="text" name="numero_registro" placeholder="Número de registro" required>
  <input type="text" name="tipo_documento" placeholder="Tipo de documento" required>
  <input type="text" name="numero_documento" placeholder="Número de documento" required>
  <input type="text" name="nombre_completo" placeholder="Nombre completo" required>
  <input type="email" name="correo_institucional" placeholder="Correo institucional" required>
  <input type="text" name="nombre_reportante" placeholder="Nombre del reportante" required>
  <input type="text" name="area_texto" placeholder="Área" required>
  <input type="text" name="tipo_reporte" placeholder="Tipo de reporte" required>
  <input type="text" name="relacionado_con" placeholder="Relacionado con" required>
  <input type="text" name="lugar_incidente" placeholder="Lugar del incidente" required>
  <textarea name="descripcion_observacion" placeholder="Descripción" required></textarea>
  
  <input type="file" id="evidencias" multiple accept="image/*" />
  
  <button type="submit">Crear Reporte</button>
</form>
```

### **2. Manejo del Envío**
```javascript
document.getElementById('reporteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const archivos = document.getElementById('evidencias').files;
  
  // Agregar archivos con el nombre correcto
  Array.from(archivos).forEach(archivo => {
    formData.append('evidencias', archivo);
  });

  try {
    const response = await fetch('/api/reportes-completos/completo', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Reporte creado exitosamente');
      e.target.reset();
    } else {
      alert('Error: ' + (data.error || 'Error desconocido'));
    }
  } catch (error) {
    alert('Error de conexión: ' + error.message);
  }
});
```

## 📊 Respuestas de la API

### **Éxito (201)**
```json
{
  "message": "Reporte creado exitosamente con evidencias",
  "reporte": {
    "id": 1,
    "numero_registro": "REP-2024-001",
    "tipo_documento": "DNI",
    "estado": "SinRevisar",
    "fecha_registro": "2024-01-15T10:30:00Z",
    "evidencias": [...]
  },
  "evidencias": [
    {
      "id": 1,
      "url": "https://res.cloudinary.com/...",
      "reporteId": 1
    }
  ],
  "totalEvidencias": 3
}
```

### **Error de Validación (400)**
```json
{
  "errors": [
    {
      "path": "correo_institucional",
      "message": "El correo institucional debe ser válido",
      "code": "invalid_string"
    }
  ]
}
```

## 🎯 Recomendaciones

1. **Usar la Opción 1** (reporte completo) para mejor experiencia de usuario
2. **Validar archivos** en el frontend antes de enviar
3. **Mostrar progreso** durante la subida de archivos
4. **Manejar errores** de forma amigable
5. **Confirmar** antes de enviar el formulario
