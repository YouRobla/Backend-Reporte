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

// 🔍 MIDDLEWARE DE DEBUG
app.use((req, _res, next) => {
  if (req.url.includes("/estado")) {
    console.log("🚨 DEBUG - Ruta de estado detectada");
    console.log("  URL:", req.url);
    console.log("  Método:", req.method);
    console.log("  Headers:", req.headers);
    console.log("  Body:", req.body);
  }
  next();
});

/* 🧩 CONFIGURACIÓN DE CORS GLOBAL */
app.use(
  cors({
    origin: "*", // ✅ Permite todas las URLs
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// ✅ Manejo manual del preflight (por seguridad extra en algunos hostings)
app.options("*", cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
}));

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rutas API
app.use("/api/acciones", accionRoutes);
app.use("/api/evidencias", evidenceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reportes", reporteCompletoRoutes);
app.use("/api/profesores", profesorRoutes);

// Health Check
app.get("/health", (_req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
});
