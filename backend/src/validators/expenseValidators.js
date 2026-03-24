import { body, query } from "express-validator";

export const expenseValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 120 })
    .withMessage("Title cannot exceed 120 characters"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
  body("type")
    .optional()
    .isIn(["expense", "income"])
    .withMessage("Type must be either income or expense"),
  body("merchant").optional().trim().isLength({ max: 80 }).withMessage("Merchant cannot exceed 80 characters"),
  body("paymentMethod")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Payment method cannot exceed 50 characters"),
  body("notes").optional().trim().isLength({ max: 300 }).withMessage("Notes cannot exceed 300 characters"),
];

export const expenseQueryValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be at least 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("search").optional().isLength({ max: 120 }).withMessage("Search cannot exceed 120 characters"),
  query("sort")
    .optional()
    .isIn(["date_desc", "date_asc", "amount_desc", "amount_asc"])
    .withMessage("Sort value is invalid"),
  query("type").optional().isIn(["expense", "income"]).withMessage("Type must be either income or expense"),
  query("dateFrom").optional().isISO8601().withMessage("dateFrom must be a valid date"),
  query("dateTo").optional().isISO8601().withMessage("dateTo must be a valid date"),
];
