import { StatusCodes } from "http-status-codes";
import { Expense } from "../models/Expense.js";
import { generateHybridAssistantResponse } from "../services/aiAssistantService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getExpenseAnalytics } from "../utils/expenseAnalytics.js";
import { buildExpenseFilters } from "../utils/expenseQuery.js";

export const askAssistant = asyncHandler(async (req, res) => {
  const filters = buildExpenseFilters(req.user._id, req.body.filters || {});

  const [analytics, recentExpenses] = await Promise.all([
    getExpenseAnalytics(filters, req.user),
    Expense.find(filters).sort({ date: -1, createdAt: -1 }).limit(12).lean(),
  ]);

  const answer = await generateHybridAssistantResponse({
    user: req.user,
    prompt: req.body.prompt,
    analytics,
    expenses: recentExpenses,
    filters: req.body.filters || {},
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      answer,
      generatedAt: new Date().toISOString(),
    },
  });
});
