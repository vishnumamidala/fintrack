import { Router } from "express";
import { getProfile, login, register, updatePreferences } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";
import { preferenceValidator } from "../validators/userValidators.js";

const router = Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.get("/me", protect, getProfile);
router.put("/me/preferences", protect, preferenceValidator, validateRequest, updatePreferences);

export default router;
