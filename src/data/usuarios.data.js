import { query } from "../config/db.js";

function mapUsuarioPublico(row) {
  if (!row) return null;
  return {
    id: row.id,
    nombre: row.nombre,
    correo: row.correo,
    rol: row.rol,
    creadoEn: row.creado_en,
  };
}

export const usuariosData = {
  async crear({ nombre, correo, passwordHash, rol = "usuario" }) {
    const result = await query(
      `INSERT INTO usuarios (nombre, correo, password_hash, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, correo, rol, creado_en`,
      [nombre, correo, passwordHash, rol]
    );
    return mapUsuarioPublico(result.rows[0]);
  },

  async buscarPorCorreo(correo) {
    const result = await query(
      `SELECT id, nombre, correo, password_hash, rol, creado_en
       FROM usuarios
       WHERE LOWER(correo) = LOWER($1)`,
      [correo]
    );
    return result.rows[0] || null;
  },

  async buscarPorId(id) {
    const result = await query(
      `SELECT id, nombre, correo, rol, creado_en
       FROM usuarios
       WHERE id = $1`,
      [id]
    );
    return mapUsuarioPublico(result.rows[0]);
  },
};
