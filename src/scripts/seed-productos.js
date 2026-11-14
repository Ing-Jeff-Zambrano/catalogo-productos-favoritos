import { pool, query } from "../config/db.js";
import { productosData } from "../data/productos.data.js";

const PRODUCTOS_EJEMPLO = [
  {
    nombre: "Audifonos inalambricos",
    descripcion: "Audifonos Bluetooth con cancelacion de ruido y 30 horas de bateria.",
    categoria: "Electronica",
    precio: 59.99,
  },
  {
    nombre: "Mochila urbana",
    descripcion: "Mochila resistente al agua con compartimento para laptop de 15 pulgadas.",
    categoria: "Accesorios",
    precio: 39.5,
  },
  {
    nombre: "Botella termica",
    descripcion: "Botella de acero inoxidable de 750 ml que conserva temperatura 12 horas.",
    categoria: "Hogar",
    precio: 18.75,
  },
  {
    nombre: "Teclado mecanico",
    descripcion: "Teclado mecanico compacto con switches rojos e iluminacion RGB.",
    categoria: "Electronica",
    precio: 89.0,
  },
  {
    nombre: "Cuaderno puntillado",
    descripcion: "Cuaderno A5 de 120 hojas con papel de 90 g ideal para apuntes.",
    categoria: "Papeleria",
    precio: 8.25,
  },
];

async function seed() {
  try {
    const total = await productosData.contar();
    if (total > 0) {
      console.log(`Ya existen ${total} productos. No se insertaron duplicados.`);
      return;
    }

    for (const producto of PRODUCTOS_EJEMPLO) {
      const creado = await productosData.crear(producto);
      console.log(`Producto creado: ${creado.nombre} (${creado.id})`);
    }

    const insertados = await query("SELECT COUNT(*)::int AS total FROM productos");
    console.log(`Seed completado. Total de productos: ${insertados.rows[0].total}`);
  } catch (error) {
    console.error("Error en el seed de productos:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
