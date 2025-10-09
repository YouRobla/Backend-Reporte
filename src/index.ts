import express from "express";
import cors from "cors";
import morgan from "morgan";
import { accionRoutes } from "./routes/accionRoutes.js";
import { evidenceRoutes } from "./routes/evidenceRoutes.js";
import { uploadRoutes } from "./routes/uploadRoutes.js";
import { reporteCompletoRoutes } from "./routes/reporteCompletoRoutes.js";
import { profesorRoutes } from "./routes/profesorRoutes.js";

const app = express();
app.use(express.json());

// 🔍 MIDDLEWARE DE DEBUG PARA TODAS LAS RUTAS
app.use((req, _res, next) => {
  if (req.url.includes('/estado')) {
    console.log('🚨 MIDDLEWARE DEBUG - Ruta de estado detectada');
    console.log('  - URL:', req.url);
    console.log('  - Method:', req.method);
    console.log('  - Content-Type:', req.headers['content-type']);
    console.log('  - Body:', req.body);
  }
  next();
});

// Configuración CORS - Permitir todos los dominios
const corsOptions = {
  origin: true, // Permitir todos los dominios
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Logging para producción
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); 

// Rutas de la API
app.use("/api/acciones", accionRoutes);
app.use("/api/evidencias", evidenceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reportes", reporteCompletoRoutes); // Solo reportes con evidencias
app.use("/api/profesores", profesorRoutes); // Gestión de profesores/destinatarios

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
