import { body } from "express-validator";

export const goalValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
  body("targetAmount").isFloat({ min: 1 }).withMessage("Target amount must be greater than 0"),
  body("currentAmount").optional().isFloat({ min: 0 }).withMessage("Current amount must be at least 0"),
  body("targetDate").isISO8601().withMessage("Target date must be a valid date"),
];

export const scenarioValidator = [
  body("category").optional().trim().isLength({ max: 60 }).withMessage("Category cannot exceed 60 characters"),
  body("adjustmentPercent").optional().isFloat({ min: -100, max: 200 }).withMessage("Adjustment percent must be between -100 and 200"),
  body("fixedAmountDelta").optional().isFloat().withMessage("Fixed amount delta must be a number"),
];

