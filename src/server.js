import app from "./app.js";
import { env } from "./config/env.js";
import { pool, testConnection } from "./config/db.js";

async function start() {
  try {
    await testConnection();
    console.log("Conexión a PostgreSQL verificada");

    app.listen(env.port, () => {
      console.log(`Servidor escuchando en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

start();
