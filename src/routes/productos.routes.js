import { Router } from "express";
import {
  actualizar,
  crear,
  eliminar,
  listar,
  obtenerPorId,
} from "../controllers/productos.controller.js";

const router = Router();

router.get("/", listar);
router.get("/:id", obtenerPorId);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;
