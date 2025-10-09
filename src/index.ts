import express from "express";
import morgan from "morgan";
import { accionRoutes } from "./routes/accionRoutes.js";
import { evidenceRoutes } from "./routes/evidenceRoutes.js";
import { uploadRoutes } from "./routes/uploadRoutes.js";
import { reporteCompletoRoutes } from "./routes/reporteCompletoRoutes.js";
import { profesorRoutes } from "./routes/profesorRoutes.js";

const app = express();
app.use(express.json());

// 🌐 CORS dinámico para frontend y dashboard
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Logger
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rutas
app.use("/api/acciones", accionRoutes);
app.use("/api/evidencias", evidenceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reportes", reporteCompletoRoutes);
app.use("/api/profesores", profesorRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
