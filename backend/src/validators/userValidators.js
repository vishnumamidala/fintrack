import { body } from "express-validator";

export const preferenceValidator = [
  body("monthlyBudget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly budget must be greater than or equal to 0"),
  body("categoryBudgets").optional().isArray().withMessage("Category budgets must be an array"),
  body("categoryBudgets.*.category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
  body("categoryBudgets.*.limit")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Category budget must be greater than or equal to 0"),
];

