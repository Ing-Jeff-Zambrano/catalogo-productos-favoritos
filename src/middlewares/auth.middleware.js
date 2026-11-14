import { verificarJwt } from "../utils/jwt.js";

export function verificarToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      mensaje: "Token de autenticacion requerido",
    });
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({
      mensaje: "Token de autenticacion requerido",
    });
  }

  try {
    const payload = verificarJwt(token);
    req.usuario = {
      id: payload.sub,
      rol: payload.rol,
      correo: payload.correo,
    };
    return next();
  } catch (error) {
    const mensaje =
      error.name === "TokenExpiredError"
        ? "Token vencido"
        : "Token invalido";
    return res.status(401).json({ mensaje });
  }
}

export function requerirAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({
      mensaje: "Token de autenticacion requerido",
    });
  }

  if (req.usuario.rol !== "administrador") {
    return res.status(403).json({
      mensaje: "Se requiere rol administrador",
    });
  }

  return next();
}
