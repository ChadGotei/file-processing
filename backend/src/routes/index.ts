import { Router } from "express";
import authRoutes from "./auth.routes.js";
import fileRoutes from "./files.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/file", fileRoutes);

export default router;