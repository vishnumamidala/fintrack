import { Router } from "express";
import { getActivityFeed, getProfile, login, register, updatePreferences, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";
import { preferenceValidator, profileValidator } from "../validators/userValidators.js";

const router = Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.get("/me", protect, getProfile);
router.get("/me/activity", protect, getActivityFeed);
router.put("/me/profile", protect, profileValidator, validateRequest, updateProfile);
router.put("/me/preferences", protect, preferenceValidator, validateRequest, updatePreferences);

export default router;
