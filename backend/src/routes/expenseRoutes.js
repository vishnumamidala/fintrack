import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpenseSummary,
  getExpenses,
  runScenario,
  seedSampleExpenses,
  updateExpense,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { expenseQueryValidator, expenseValidator } from "../validators/expenseValidators.js";
import { scenarioValidator } from "../validators/goalValidators.js";

const router = Router();

router.use(protect);

router.get("/", expenseQueryValidator, validateRequest, getExpenses);
router.get("/summary", expenseQueryValidator, validateRequest, getExpenseSummary);
router.post("/scenario", scenarioValidator, validateRequest, runScenario);
router.post("/seed-sample", seedSampleExpenses);
router.post("/", expenseValidator, validateRequest, createExpense);
router.put("/:id", expenseValidator, validateRequest, updateExpense);
router.delete("/:id", deleteExpense);

export default router;
