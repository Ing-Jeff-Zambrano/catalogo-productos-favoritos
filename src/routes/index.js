import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productosRoutes from "./productos.routes.js";
import favoritosRoutes from "./favoritos.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/productos", productosRoutes);
router.use("/favoritos", favoritosRoutes);

export default router;
