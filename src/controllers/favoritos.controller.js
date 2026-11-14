import { favoritosData } from "../data/favoritos.data.js";
import { productosData } from "../data/productos.data.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function esUuid(valor) {
  return typeof valor === "string" && UUID_REGEX.test(valor);
}

export async function listar(req, res) {
  try {
    const favoritos = await favoritosData.listarPorUsuario(req.usuario.id);
    return res.status(200).json({ favoritos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al listar favoritos" });
  }
}

export async function agregar(req, res) {
  try {
    const productoId =
      typeof req.body?.productoId === "string" ? req.body.productoId.trim() : "";

    if (!esUuid(productoId)) {
      return res.status(400).json({
        mensaje: "productoId es obligatorio y debe ser un UUID valido",
      });
    }

    const producto = await productosData.obtenerPorId(productoId);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    try {
      await favoritosData.agregar(req.usuario.id, productoId);
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          mensaje: "El producto ya esta en tus favoritos",
        });
      }
      throw error;
    }

    const favorito = await favoritosData.obtenerConProducto(
      req.usuario.id,
      productoId
    );

    return res.status(201).json({ favorito });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al agregar favorito" });
  }
}

export async function quitar(req, res) {
  try {
    const { productoId } = req.params;
    if (!esUuid(productoId)) {
      return res.status(400).json({
        mensaje: "Identificador de producto invalido",
      });
    }

    const eliminado = await favoritosData.quitar(req.usuario.id, productoId);
    if (!eliminado) {
      return res.status(404).json({
        mensaje: "Favorito no encontrado",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al quitar favorito" });
  }
}
