import { Router } from "express";
import {
  actualizar,
  crear,
  eliminar,
  listar,
  obtenerPorId,
} from "../controllers/productos.controller.js";
import {
  requerirAdmin,
  verificarToken,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listar);
router.get("/:id", obtenerPorId);
router.post("/", verificarToken, requerirAdmin, crear);
router.put("/:id", verificarToken, requerirAdmin, actualizar);
router.delete("/:id", verificarToken, requerirAdmin, eliminar);

export default router;
