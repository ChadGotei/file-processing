import { Router } from "express";
import { getAllUser, getCurrentUser, login, logout, register } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { authSchema } from "../schemas/auth.schema";
import { protectedRoute } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validate(authSchema.registerSchema), register);
router.post("/login", validate(authSchema.loginSchema), login);
router.post("/logout", logout);
router.get("/me", protectedRoute ,getCurrentUser);

// devlopment only
router.get("/get-all-users", getAllUser);

export default router;