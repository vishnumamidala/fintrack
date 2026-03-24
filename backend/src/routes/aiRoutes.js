import { Router } from "express";
import { askAssistant, getAssistantChat, resetAssistantChat } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { aiAssistantValidator } from "../validators/aiValidators.js";

const router = Router();

router.get("/assistant", protect, getAssistantChat);
router.post("/assistant", protect, aiAssistantValidator, validateRequest, askAssistant);
router.delete("/assistant", protect, resetAssistantChat);

export default router;
