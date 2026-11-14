/**
 * Middlewares de autenticación y autorización.
 * Aquí se verificará firma/expiración del JWT y el rol administrador.
 */

export function verificarToken(_req, res, _next) {
  return res.status(501).json({
    mensaje: "Verificación JWT pendiente de implementación",
  });
}

export function requerirAdmin(_req, res, _next) {
  return res.status(501).json({
    mensaje: "Control de rol administrador pendiente de implementación",
  });
}
