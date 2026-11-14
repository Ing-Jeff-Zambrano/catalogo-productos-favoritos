import { Router } from "express";
import {
  agregar,
  listar,
  quitar,
} from "../controllers/favoritos.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", listar);
router.post("/", agregar);
router.delete("/:productoId", quitar);

export default router;
