import { productosData } from "../data/productos.data.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function esUuid(valor) {
  return typeof valor === "string" && UUID_REGEX.test(valor);
}

function validarCamposProducto({ nombre, descripcion, categoria, precio }) {
  const errores = [];

  if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
    errores.push("El nombre es obligatorio");
  }
  if (!descripcion || typeof descripcion !== "string" || !descripcion.trim()) {
    errores.push("La descripcion es obligatoria");
  }
  if (!categoria || typeof categoria !== "string" || !categoria.trim()) {
    errores.push("La categoria es obligatoria");
  }

  const precioNumero = Number(precio);
  if (precio === undefined || precio === null || precio === "") {
    errores.push("El precio es obligatorio");
  } else if (Number.isNaN(precioNumero) || precioNumero <= 0) {
    errores.push("El precio debe ser un numero mayor que cero");
  }

  return {
    ok: errores.length === 0,
    errores,
    datos: {
      nombre: typeof nombre === "string" ? nombre.trim() : nombre,
      descripcion: typeof descripcion === "string" ? descripcion.trim() : descripcion,
      categoria: typeof categoria === "string" ? categoria.trim() : categoria,
      precio: precioNumero,
    },
  };
}

export async function listar(req, res) {
  try {
    const categoria =
      typeof req.query.categoria === "string" ? req.query.categoria.trim() : undefined;
    const productos = await productosData.listar({
      categoria: categoria || undefined,
    });
    return res.status(200).json({ productos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al listar productos" });
  }
}

export async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;
    if (!esUuid(id)) {
      return res.status(400).json({ mensaje: "Identificador de producto invalido" });
    }

    const producto = await productosData.obtenerPorId(id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    return res.status(200).json({ producto });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al consultar el producto" });
  }
}

export async function crear(req, res) {
  try {
    const validacion = validarCamposProducto(req.body || {});
    if (!validacion.ok) {
      return res.status(400).json({
        mensaje: "Datos de producto invalidos",
        errores: validacion.errores,
      });
    }

    const producto = await productosData.crear(validacion.datos);
    return res.status(201).json({ producto });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al crear el producto" });
  }
}

export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    if (!esUuid(id)) {
      return res.status(400).json({ mensaje: "Identificador de producto invalido" });
    }

    const validacion = validarCamposProducto(req.body || {});
    if (!validacion.ok) {
      return res.status(400).json({
        mensaje: "Datos de producto invalidos",
        errores: validacion.errores,
      });
    }

    const producto = await productosData.actualizar(id, validacion.datos);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    return res.status(200).json({ producto });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al actualizar el producto" });
  }
}

export async function eliminar(req, res) {
  try {
    const { id } = req.params;
    if (!esUuid(id)) {
      return res.status(400).json({ mensaje: "Identificador de producto invalido" });
    }

    const eliminado = await productosData.eliminar(id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al eliminar el producto" });
  }
}
