import mongoose from "mongoose";
import { Expense } from "../models/Expense.js";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const buildMonthlySeries = (monthlyTotals) =>
  monthlyTotals.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    type: item._id.type,
    total: item.total,
    label: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
  }));

const buildForecast = ({ totals, insights, now, monthExpenseSeries }) => {
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const projectedExpense =
    insights.currentMonth > 0 ? Number(((insights.currentMonth / currentDay) * daysInMonth).toFixed(2)) : 0;

  const recentExpenseAverage =
    monthExpenseSeries.length > 0
      ? Number(
          (
            monthExpenseSeries.reduce((sum, item) => sum + item.total, 0) / monthExpenseSeries.length
          ).toFixed(2)
        )
      : 0;

  const forecastConfidence =
    monthExpenseSeries.length >= 3 ? "high" : monthExpenseSeries.length === 2 ? "medium" : "low";

  return {
    currentDay,
    daysInMonth,
    projectedExpense,
    projectedBalance: Number((totals.income - projectedExpense).toFixed(2)),
    averageMonthlyExpense: recentExpenseAverage,
    confidence: forecastConfidence,
  };
};

const buildHealthScore = ({ totals, insights, forecast, topExpenseCategories }) => {
  const savingsRate = totals.income > 0 ? (totals.balance / totals.income) * 100 : 0;
  const spendingControlScore = clamp(50 - Math.max(insights.changePercentage || 0, 0), 10, 35);
  const savingsScore = clamp(savingsRate, 0, 35);
  const concentrationPenalty =
    totals.expense > 0 && topExpenseCategories[0]
      ? clamp((topExpenseCategories[0].total / totals.expense) * 20, 0, 20)
      : 0;
  const forecastScore = forecast.projectedBalance >= 0 ? 20 : clamp(20 + forecast.projectedBalance / 1000, 0, 20);

  const score = Math.round(clamp(spendingControlScore + savingsScore + forecastScore - concentrationPenalty + 20, 0, 100));
  const label = score >= 80 ? "Excellent" : score >= 65 ? "Strong" : score >= 45 ? "Needs Attention" : "At Risk";

  return {
    score,
    label,
    factors: {
      savingsRate: Number(savingsRate.toFixed(1)),
      topCategoryShare:
        totals.expense > 0 && topExpenseCategories[0]
          ? Number(((topExpenseCategories[0].total / totals.expense) * 100).toFixed(1))
          : 0,
      projectedBalance: forecast.projectedBalance,
    },
  };
};

const buildRecurringSignals = (recentExpenses) => {
  const recurringMap = new Map();

  recentExpenses.forEach((expense) => {
    if (expense.type !== "expense") {
      return;
    }

    const key = `${expense.title.toLowerCase()}::${expense.category.toLowerCase()}::${Math.round(expense.amount)}`;
    const current = recurringMap.get(key) || {
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      dates: [],
      count: 0,
    };

    current.dates.push(new Date(expense.date));
    current.count += 1;
    recurringMap.set(key, current);
  });

  return Array.from(recurringMap.values())
    .filter((item) => item.count >= 2)
    .map((item) => {
      const sortedDates = item.dates.sort((a, b) => a - b);
      const intervals = sortedDates.slice(1).map((date, index) => {
        const previous = sortedDates[index];
        return Math.round((date - previous) / (1000 * 60 * 60 * 24));
      });
      const averageInterval =
        intervals.length > 0
          ? Math.round(intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length)
          : null;
      const lastDate = sortedDates.at(-1);
      const nextExpectedDate =
        averageInterval && lastDate ? new Date(lastDate.getTime() + averageInterval * 24 * 60 * 60 * 1000) : null;

      return {
        title: item.title,
        category: item.category,
        amount: item.amount,
        count: item.count,
        averageIntervalDays: averageInterval,
        nextExpectedDate,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

const buildAnomalies = (recentExpenses) => {
  const expenseOnly = recentExpenses.filter((item) => item.type === "expense");
  if (!expenseOnly.length) {
    return [];
  }

  const average = expenseOnly.reduce((sum, item) => sum + item.amount, 0) / expenseOnly.length;
  const threshold = average * 1.75;

  return expenseOnly
    .filter((item) => item.amount >= threshold)
    .map((item) => ({
      id: item._id,
      title: item.title,
      category: item.category,
      amount: item.amount,
      date: item.date,
      message: `${item.title} is ${Math.round(item.amount / average)}x your recent average expense size.`,
    }))
    .slice(0, 5);
};

export const getExpenseAnalytics = async (filters, user = null) => {
  const userId = new mongoose.Types.ObjectId(filters.user);
  const matchStage = {
    user: userId,
    ...(filters.category && { category: filters.category }),
    ...(filters.type && { type: filters.type }),
    ...(filters.date && { date: filters.date }),
  };

  const [monthlyTotals, categoryBreakdown, totals, recentExpenses] = await Promise.all([
    Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
    Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            category: "$category",
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]),
    Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
    Expense.find(matchStage).sort({ date: -1, createdAt: -1 }).limit(60).lean(),
  ]);

  const totalsMap = totals.reduce(
    (acc, item) => ({
      ...acc,
      [item._id]: item.total,
    }),
    { income: 0, expense: 0 }
  );

  const series = buildMonthlySeries(monthlyTotals);
  const monthExpenseSeries = series.filter((item) => item.type === "expense");
  const currentMonth = monthExpenseSeries.at(-1)?.total || 0;
  const previousMonth = monthExpenseSeries.at(-2)?.total || 0;
  const topExpenseCategories = categoryBreakdown
    .filter((item) => item._id.type === "expense")
    .map((item) => ({
      category: item._id.category,
      total: item.total,
    }));

  const totalsSummary = {
    income: totalsMap.income || 0,
    expense: totalsMap.expense || 0,
    balance: (totalsMap.income || 0) - (totalsMap.expense || 0),
  };

  const insights = {
    currentMonth,
    previousMonth,
    difference: currentMonth - previousMonth,
    changePercentage:
      previousMonth > 0 ? Number((((currentMonth - previousMonth) / previousMonth) * 100).toFixed(2)) : null,
    topSpendingCategory: topExpenseCategories[0]?.category || null,
  };

  const forecast = buildForecast({
    totals: totalsSummary,
    insights,
    now: new Date(),
    monthExpenseSeries: monthExpenseSeries.slice(-6),
  });

  const health = buildHealthScore({
    totals: totalsSummary,
    insights,
    forecast,
    topExpenseCategories,
  });

  return {
    monthlyTotals,
    categoryBreakdown,
    totals: totalsSummary,
    insights,
    forecast,
    health,
    anomalies: buildAnomalies(recentExpenses),
    recurring: buildRecurringSignals(recentExpenses),
    recommendations: {
      topCategories: topExpenseCategories.slice(0, 3),
      suggestedBudget: Number((user?.monthlyBudget || forecast.averageMonthlyExpense * 0.95 || currentMonth).toFixed(2)),
      categoryBudgets: user?.categoryBudgets || [],
    },
  };
};
