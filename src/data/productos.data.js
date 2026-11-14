import { query } from "../config/db.js";

function mapProducto(row) {
  if (!row) return null;
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    categoria: row.categoria,
    precio: Number(row.precio),
    creadoEn: row.creado_en,
    actualizadoEn: row.actualizado_en,
  };
}

export const productosData = {
  async listar({ categoria } = {}) {
    if (categoria) {
      const result = await query(
        `SELECT id, nombre, descripcion, categoria, precio, creado_en, actualizado_en
         FROM productos
         WHERE LOWER(categoria) = LOWER($1)
         ORDER BY nombre ASC`,
        [categoria]
      );
      return result.rows.map(mapProducto);
    }

    const result = await query(
      `SELECT id, nombre, descripcion, categoria, precio, creado_en, actualizado_en
       FROM productos
       ORDER BY nombre ASC`
    );
    return result.rows.map(mapProducto);
  },

  async obtenerPorId(id) {
    const result = await query(
      `SELECT id, nombre, descripcion, categoria, precio, creado_en, actualizado_en
       FROM productos
       WHERE id = $1`,
      [id]
    );
    return mapProducto(result.rows[0]);
  },

  async crear({ nombre, descripcion, categoria, precio }) {
    const result = await query(
      `INSERT INTO productos (nombre, descripcion, categoria, precio)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, descripcion, categoria, precio, creado_en, actualizado_en`,
      [nombre, descripcion, categoria, precio]
    );
    return mapProducto(result.rows[0]);
  },

  async actualizar(id, { nombre, descripcion, categoria, precio }) {
    const result = await query(
      `UPDATE productos
       SET nombre = $1,
           descripcion = $2,
           categoria = $3,
           precio = $4,
           actualizado_en = NOW()
       WHERE id = $5
       RETURNING id, nombre, descripcion, categoria, precio, creado_en, actualizado_en`,
      [nombre, descripcion, categoria, precio, id]
    );
    return mapProducto(result.rows[0]);
  },

  async eliminar(id) {
    const result = await query(
      `DELETE FROM productos
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    return result.rowCount > 0;
  },

  async contar() {
    const result = await query(`SELECT COUNT(*)::int AS total FROM productos`);
    return result.rows[0].total;
  },
};
