import { Router } from "express";
import {
  agregar,
  listar,
  quitar,
} from "../controllers/favoritos.controller.js";

const router = Router();

router.get("/", listar);
router.post("/", agregar);
router.delete("/:productoId", quitar);

export default router;
