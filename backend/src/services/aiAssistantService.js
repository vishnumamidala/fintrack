import { env } from "../config/env.js";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const getTopExpenseCategories = (categoryBreakdown) =>
  categoryBreakdown
    .filter((item) => item._id.type === "expense")
    .slice(0, 3)
    .map((item) => ({
      category: item._id.category,
      total: item.total,
    }));

const buildSummary = ({ user, analytics, expenses }) => {
  const { totals, insights } = analytics;
  const latest = expenses[0];
  const trend =
    insights.changePercentage === null
      ? "There is not enough month-over-month history yet, so the guidance focuses on your current totals and category mix."
      : insights.changePercentage > 0
        ? `Your monthly expenses are up ${insights.changePercentage}% compared with the previous month.`
        : `Your monthly expenses are down ${Math.abs(insights.changePercentage)}% compared with the previous month.`;

  return `${user.name}, your current balance is ${formatCurrency(totals.balance)} with income at ${formatCurrency(
    totals.income
  )} and expenses at ${formatCurrency(totals.expense)}. ${trend}${
    latest ? ` Your latest transaction was ${latest.title} for ${formatCurrency(latest.amount)}.` : ""
  }`;
};

const buildActionItems = ({ analytics, expenses, prompt }) => {
  const items = [];
  const { totals, insights } = analytics;
  const topCategories = getTopExpenseCategories(analytics.categoryBreakdown);
  const lowerPrompt = prompt.toLowerCase();

  if (topCategories[0]) {
    items.push(
      `Your highest spending category is ${topCategories[0].category} at ${formatCurrency(
        topCategories[0].total
      )}. Review recurring purchases there first for the fastest savings opportunity.`
    );
  }

  if (totals.income > 0) {
    const savingsRate = (((totals.balance || 0) / totals.income) * 100).toFixed(1);
    items.push(
      `Your current savings rate is ${savingsRate}%. Keep it positive by trimming non-essential categories before increasing fixed costs.`
    );
  } else {
    items.push("No income entries are recorded yet, so add salary or other inflows to unlock stronger cash-flow guidance.");
  }

  if (insights.changePercentage !== null && insights.changePercentage > 15) {
    items.push(
      `Spending has accelerated sharply this month. Set a short-term cap on ${insights.topSpendingCategory || "your top category"} until the trend settles.`
    );
  } else if (insights.changePercentage !== null && insights.changePercentage < 0) {
    items.push("Your spending trend is improving. Preserve that momentum by repeating the habits that reduced last month’s spend.");
  }

  if (lowerPrompt.includes("budget")) {
    items.push(
      `Use your current monthly expense level of ${formatCurrency(
        insights.currentMonth
      )} as a baseline budget, then reduce it by 5-10% for a realistic target.`
    );
  }

  if (lowerPrompt.includes("cash flow") || lowerPrompt.includes("income")) {
    items.push(
      "Keep income and expense entries updated weekly so your cash-flow trend stays accurate and sudden drops in balance are easier to explain."
    );
  }

  if (lowerPrompt.includes("save") || lowerPrompt.includes("reduce") || lowerPrompt.includes("overspending")) {
    const recentExpense = expenses.find((item) => item.type === "expense");
    if (recentExpense) {
      items.push(
        `Start with your recent ${recentExpense.category} purchases and identify one repeat expense to pause or cap for the rest of the month.`
      );
    }
  }

  return items.slice(0, 4);
};

export const generateAssistantResponse = async ({ user, prompt, analytics, expenses }) => {
  const summary = buildSummary({ user, analytics, expenses });
  const actionItems = buildActionItems({ analytics, expenses, prompt });

  return [summary, "", ...actionItems.map((item) => `- ${item}`)].join("\n");
};

const buildLocalModelPrompt = ({ user, prompt, analytics, expenses }) => `
You are a concise personal finance assistant inside an expense tracker.
Use only the data provided below. Do not invent facts.
Give one short summary paragraph followed by 2 to 4 actionable bullet points.

User: ${user.name}
Question: ${prompt}
Totals: ${JSON.stringify(analytics.totals)}
Insights: ${JSON.stringify(analytics.insights)}
Category breakdown: ${JSON.stringify(analytics.categoryBreakdown)}
Monthly totals: ${JSON.stringify(analytics.monthlyTotals)}
Recent transactions: ${JSON.stringify(
  expenses.map((expense) => ({
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    type: expense.type,
    date: expense.date,
  }))
)}
`;

export const generateHybridAssistantResponse = async ({ user, prompt, analytics, expenses }) => {
  try {
    const response = await fetch(`${env.ollamaHost}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.ollamaModel,
        prompt: buildLocalModelPrompt({ user, prompt, analytics, expenses }),
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = await response.json();
    if (data.response?.trim()) {
      return data.response.trim();
    }

    throw new Error("Empty Ollama response");
  } catch (error) {
    return generateAssistantResponse({ user, prompt, analytics, expenses });
  }
};
