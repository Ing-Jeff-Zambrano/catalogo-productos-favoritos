import bcrypt from "bcryptjs";
import { pool, query } from "../config/db.js";

async function createAdmin() {
  const nombre = process.env.ADMIN_NOMBRE || "Administrador";
  const correo = process.env.ADMIN_CORREO || "admin@catalogo.local";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";

  try {
    const existente = await query(
      `SELECT id, correo, rol FROM usuarios WHERE correo = $1`,
      [correo]
    );

    if (existente.rowCount > 0) {
      console.log(`El usuario ${correo} ya existe con rol: ${existente.rows[0].rol}`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO usuarios (nombre, correo, password_hash, rol)
       VALUES ($1, $2, $3, 'administrador')
       RETURNING id, nombre, correo, rol`,
      [nombre, correo, passwordHash]
    );

    const admin = result.rows[0];
    console.log("Administrador creado:");
    console.log(`  id: ${admin.id}`);
    console.log(`  nombre: ${admin.nombre}`);
    console.log(`  correo: ${admin.correo}`);
    console.log(`  rol: ${admin.rol}`);
    console.log("Guarda la contraseña de forma segura; no se vuelve a mostrar.");
    console.log(`Contraseña usada: ${password}`);
  } catch (error) {
    console.error("Error al crear el administrador:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

createAdmin();
