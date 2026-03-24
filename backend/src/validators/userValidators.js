import { body } from "express-validator";

export const profileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("avatar")
    .optional()
    .isString()
    .isLength({ max: 600000 })
    .withMessage("Avatar image is too large"),
];

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
