import { StatusCodes } from "http-status-codes";
import { Expense } from "../models/Expense.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getExpenseAnalytics } from "../utils/expenseAnalytics.js";
import { buildExpenseFilters, getSortOption } from "../utils/expenseQuery.js";

const createSampleExpenses = (userId) => {
  const today = new Date();
  const buildDate = (monthOffset, day) => new Date(today.getFullYear(), today.getMonth() + monthOffset, day);

  return [
    { title: "Salary", amount: 85000, category: "Salary", type: "income", date: buildDate(-2, 1), user: userId, paymentMethod: "Bank Transfer" },
    { title: "Rent", amount: 22000, category: "Utilities", type: "expense", date: buildDate(-2, 3), user: userId, merchant: "Landlord", paymentMethod: "UPI" },
    { title: "Groceries", amount: 5800, category: "Food", type: "expense", date: buildDate(-2, 8), user: userId, merchant: "Fresh Mart", paymentMethod: "Card" },
    { title: "Metro Card", amount: 2200, category: "Transport", type: "expense", date: buildDate(-2, 11), user: userId, paymentMethod: "UPI" },
    { title: "Salary", amount: 85000, category: "Salary", type: "income", date: buildDate(-1, 1), user: userId, paymentMethod: "Bank Transfer" },
    { title: "Rent", amount: 22000, category: "Utilities", type: "expense", date: buildDate(-1, 3), user: userId, merchant: "Landlord", paymentMethod: "UPI" },
    { title: "Netflix", amount: 649, category: "Entertainment", type: "expense", date: buildDate(-1, 5), user: userId, merchant: "Netflix", paymentMethod: "Card" },
    { title: "Groceries", amount: 6100, category: "Food", type: "expense", date: buildDate(-1, 9), user: userId, merchant: "Fresh Mart", paymentMethod: "Card" },
    { title: "Gym Membership", amount: 1800, category: "Health", type: "expense", date: buildDate(-1, 12), user: userId, merchant: "Fit Hub", paymentMethod: "Card" },
    { title: "Salary", amount: 85000, category: "Salary", type: "income", date: buildDate(0, 1), user: userId, paymentMethod: "Bank Transfer" },
    { title: "Rent", amount: 22000, category: "Utilities", type: "expense", date: buildDate(0, 3), user: userId, merchant: "Landlord", paymentMethod: "UPI" },
    { title: "Groceries", amount: 7200, category: "Food", type: "expense", date: buildDate(0, 7), user: userId, merchant: "Fresh Mart", paymentMethod: "Card" },
    { title: "Dining Out", amount: 3400, category: "Food", type: "expense", date: buildDate(0, 10), user: userId, merchant: "Cafe Ember", paymentMethod: "Card" },
    { title: "Weekend Shopping", amount: 9800, category: "Shopping", type: "expense", date: buildDate(0, 15), user: userId, merchant: "City Center", paymentMethod: "Card", notes: "Seasonal clothing refresh" },
    { title: "Internet Bill", amount: 1299, category: "Utilities", type: "expense", date: buildDate(0, 17), user: userId, merchant: "FiberNet", paymentMethod: "UPI" },
  ];
};

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Expense created successfully",
    data: expense,
  });
});

export const getExpenses = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filters = buildExpenseFilters(req.user._id, req.query);
  const sort = getSortOption(req.query.sort);

  const [expenses, total] = await Promise.all([
    Expense.find(filters).sort(sort).skip(skip).limit(limit),
    Expense.countDocuments(filters),
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: expenses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!expense) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Expense not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Expense updated successfully",
    data: expense,
  });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!expense) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Expense not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Expense deleted successfully",
  });
});

export const getExpenseSummary = asyncHandler(async (req, res) => {
  const filters = buildExpenseFilters(req.user._id, req.query);
  const analytics = await getExpenseAnalytics(filters, req.user);

  res.status(StatusCodes.OK).json({
    success: true,
    data: analytics,
  });
});

export const seedSampleExpenses = asyncHandler(async (req, res) => {
  const existingCount = await Expense.countDocuments({ user: req.user._id });

  if (existingCount > 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Sample data can only be added when your account has no transactions");
  }

  const sampleExpenses = createSampleExpenses(req.user._id);
  const expenses = await Expense.insertMany(sampleExpenses);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Sample transactions added successfully",
    data: expenses,
  });
});

export const runScenario = asyncHandler(async (req, res) => {
  const analytics = await getExpenseAnalytics(buildExpenseFilters(req.user._id, {}), req.user);
  const { category, adjustmentPercent = 0, fixedAmountDelta = 0 } = req.body;

  let impactedAmount = analytics.recommendations.topCategories[0]?.total || analytics.totals.expense;
  if (category) {
    impactedAmount =
      analytics.categoryBreakdown.find((item) => item._id.type === "expense" && item._id.category === category)?.total ||
      0;
  }

  const percentageDelta = impactedAmount * (Number(adjustmentPercent) / 100);
  const totalDelta = percentageDelta + Number(fixedAmountDelta || 0);
  const projectedExpense = Math.max(analytics.forecast.projectedExpense + totalDelta, 0);
  const projectedBalance = analytics.totals.income - projectedExpense;

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      scenario: {
        category: category || "All expenses",
        adjustmentPercent: Number(adjustmentPercent),
        fixedAmountDelta: Number(fixedAmountDelta || 0),
      },
      impact: {
        monthlyExpenseDelta: Number(totalDelta.toFixed(2)),
        projectedExpense: Number(projectedExpense.toFixed(2)),
        projectedBalance: Number(projectedBalance.toFixed(2)),
      },
    },
  });
});
