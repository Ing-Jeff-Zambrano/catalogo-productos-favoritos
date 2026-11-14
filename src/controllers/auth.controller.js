import bcrypt from "bcryptjs";
import { usuariosData } from "../data/usuarios.data.js";
import { firmarToken } from "../utils/jwt.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarRegistro({ nombre, correo, password }) {
  const errores = [];

  if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
    errores.push("El nombre es obligatorio");
  }
  if (!correo || typeof correo !== "string" || !correo.trim()) {
    errores.push("El correo es obligatorio");
  } else if (!EMAIL_REGEX.test(correo.trim())) {
    errores.push("El correo no tiene un formato valido");
  }
  if (!password || typeof password !== "string") {
    errores.push("La contrasena es obligatoria");
  } else if (password.length < 6) {
    errores.push("La contrasena debe tener al menos 6 caracteres");
  }

  return {
    ok: errores.length === 0,
    errores,
    datos: {
      nombre: typeof nombre === "string" ? nombre.trim() : nombre,
      correo: typeof correo === "string" ? correo.trim().toLowerCase() : correo,
      password,
    },
  };
}

export async function registro(req, res) {
  try {
    const validacion = validarRegistro(req.body || {});
    if (!validacion.ok) {
      return res.status(400).json({
        mensaje: "Datos de registro invalidos",
        errores: validacion.errores,
      });
    }

    const { nombre, correo, password } = validacion.datos;
    const existente = await usuariosData.buscarPorCorreo(correo);
    if (existente) {
      return res.status(409).json({ mensaje: "El correo ya esta registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // El registro publico siempre crea rol "usuario"
    const usuario = await usuariosData.crear({
      nombre,
      correo,
      passwordHash,
      rol: "usuario",
    });

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al registrar el usuario" });
  }
}

export async function login(req, res) {
  try {
    const correo =
      typeof req.body?.correo === "string" ? req.body.correo.trim().toLowerCase() : "";
    const password = req.body?.password;

    if (!correo || !password || typeof password !== "string") {
      return res.status(400).json({
        mensaje: "Correo y contrasena son obligatorios",
      });
    }

    const usuario = await usuariosData.buscarPorCorreo(correo);
    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const valida = await bcrypt.compare(password, usuario.password_hash);
    if (!valida) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const token = firmarToken({
      sub: usuario.id,
      rol: usuario.rol,
      correo: usuario.correo,
    });

    return res.status(200).json({
      mensaje: "Inicio de sesion correcto",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al iniciar sesion" });
  }
}
