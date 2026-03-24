import { body } from "express-validator";

export const aiAssistantValidator = [
  body("prompt")
    .trim()
    .notEmpty()
    .withMessage("Prompt is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Prompt must be between 5 and 500 characters"),
  body("filters").optional().isObject().withMessage("Filters must be an object"),
];

