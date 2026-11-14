import express from "express";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: "API de catálogo lista",
  });
});

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    mensaje: "Error interno del servidor",
  });
});

export default app;
