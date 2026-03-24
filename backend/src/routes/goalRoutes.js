import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { goalValidator } from "../validators/goalValidators.js";
import { createGoal, deleteGoal, getGoals, updateGoal } from "../controllers/goalController.js";

const router = Router();

router.use(protect);
router.get("/", getGoals);
router.post("/", goalValidator, validateRequest, createGoal);
router.put("/:id", goalValidator, validateRequest, updateGoal);
router.delete("/:id", deleteGoal);

export default router;

