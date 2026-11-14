import { query } from "../config/db.js";

function mapFavorito(row) {
  if (!row) return null;
  return {
    id: row.id,
    usuarioId: row.usuario_id,
    productoId: row.producto_id,
    creadoEn: row.creado_en,
    producto: {
      id: row.producto_id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      categoria: row.categoria,
      precio: Number(row.precio),
    },
  };
}

export const favoritosData = {
  async listarPorUsuario(usuarioId) {
    const result = await query(
      `SELECT f.id, f.usuario_id, f.producto_id, f.creado_en,
              p.nombre, p.descripcion, p.categoria, p.precio
       FROM favoritos f
       INNER JOIN productos p ON p.id = f.producto_id
       WHERE f.usuario_id = $1
       ORDER BY f.creado_en DESC`,
      [usuarioId]
    );
    return result.rows.map(mapFavorito);
  },

  async agregar(usuarioId, productoId) {
    const result = await query(
      `INSERT INTO favoritos (usuario_id, producto_id)
       VALUES ($1, $2)
       RETURNING id, usuario_id, producto_id, creado_en`,
      [usuarioId, productoId]
    );
    return result.rows[0];
  },

  async obtenerConProducto(usuarioId, productoId) {
    const result = await query(
      `SELECT f.id, f.usuario_id, f.producto_id, f.creado_en,
              p.nombre, p.descripcion, p.categoria, p.precio
       FROM favoritos f
       INNER JOIN productos p ON p.id = f.producto_id
       WHERE f.usuario_id = $1 AND f.producto_id = $2`,
      [usuarioId, productoId]
    );
    return mapFavorito(result.rows[0]);
  },

  async quitar(usuarioId, productoId) {
    const result = await query(
      `DELETE FROM favoritos
       WHERE usuario_id = $1 AND producto_id = $2
       RETURNING id`,
      [usuarioId, productoId]
    );
    return result.rowCount > 0;
  },
};
