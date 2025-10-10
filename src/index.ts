import express from "express";
import cors from "cors";
import morgan from "morgan";
import { accionRoutes } from "./routes/accionRoutes.js";
import { evidenceRoutes } from "./routes/evidenceRoutes.js";
import { uploadRoutes } from "./routes/uploadRoutes.js";
import { reporteCompletoRoutes } from "./routes/reporteCompletoRoutes.js";
import { profesorRoutes } from "./routes/profesorRoutes.js";
import { metricasRoutes } from "./routes/metricasRoutes.js";
import emailTestRoutes from "./routes/emailTestRoutes.js";

const app = express();
app.use(express.json());

// 🌐 CORS completamente abierto usando middleware oficial
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: false
}));

// Logger
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rutas
app.use("/api/acciones", accionRoutes);
app.use("/api/evidencias", evidenceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reportes", reporteCompletoRoutes);
app.use("/api/profesores", profesorRoutes);
app.use("/api/metricas", metricasRoutes);
app.use("/api/email", emailTestRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
