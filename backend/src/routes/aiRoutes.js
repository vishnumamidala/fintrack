import { Router } from "express";
import { askAssistant } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { aiAssistantValidator } from "../validators/aiValidators.js";

const router = Router();

router.post("/assistant", protect, aiAssistantValidator, validateRequest, askAssistant);

export default router;

