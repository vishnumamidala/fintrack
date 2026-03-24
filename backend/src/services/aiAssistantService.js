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

const buildContextPayload = ({ user, analytics, expenses, history }) => ({
  user: {
    name: user.name,
    monthlyBudget: user.monthlyBudget,
    categoryBudgets: user.categoryBudgets || [],
  },
  totals: analytics.totals,
  insights: analytics.insights,
  forecast: analytics.forecast,
  health: analytics.health,
  goals: analytics.goals || [],
  recurring: analytics.recurring,
  anomalies: analytics.anomalies,
  recentTransactions: expenses.map((expense) => ({
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    type: expense.type,
    date: expense.date,
    merchant: expense.merchant,
    paymentMethod: expense.paymentMethod,
  })),
  conversationHistory: history,
});

const buildLocalModelPrompt = ({ user, prompt, analytics, expenses, history }) => `
You are a personal finance assistant inside an expense tracker.
You must behave like a helpful multi-turn chat assistant, not a one-shot generator.
Use only the financial data and conversation history provided.
If the user asks a broad question, ask one short clarifying question when helpful.
If the user already answered earlier in the chat, use that answer.
Be concise, natural, and conversational.

Context:
${JSON.stringify(buildContextPayload({ user, analytics, expenses, history }))}

Current user message:
${prompt}
`;

const buildRuleBasedChatResponse = ({ user, prompt, analytics, expenses, history }) => {
  const lowerPrompt = prompt.toLowerCase();
  const previousUserMessages = history.filter((message) => message.role === "user").map((message) => message.content.toLowerCase());
  const lastPreference = previousUserMessages.find((message) =>
    ["food", "shopping", "transport", "savings", "budget"].some((keyword) => message.includes(keyword))
  );

  if (lowerPrompt.includes("save more") || lowerPrompt.includes("how can i save")) {
    if (!analytics.insights.topSpendingCategory) {
      return "I need a little more spending history before I can suggest the best place to cut. Add a few expense entries or load sample data and I’ll help you prioritize.";
    }

    return `Your biggest spending category right now is ${analytics.insights.topSpendingCategory}. If you want, we can focus there first. Do you want to reduce ${analytics.insights.topSpendingCategory.toLowerCase()} spend, or would you rather improve your monthly budget plan?`;
  }

  if (lowerPrompt.includes("focus there") || lowerPrompt.includes("yes") || lowerPrompt.includes("reduce")) {
    const chosenCategory =
      ["food", "shopping", "transport", "health", "utilities", "entertainment"].find((item) => lowerPrompt.includes(item)) ||
      ["food", "shopping", "transport", "health", "utilities", "entertainment"].find((item) => lastPreference?.includes(item)) ||
      analytics.insights.topSpendingCategory?.toLowerCase();

    const categoryTotal =
      analytics.categoryBreakdown.find(
        (item) => item._id.type === "expense" && item._id.category.toLowerCase() === chosenCategory
      )?.total || 0;

    if (!chosenCategory) {
      return generateAssistantResponse({ user, prompt, analytics, expenses });
    }

    return `${chosenCategory[0].toUpperCase()}${chosenCategory.slice(1)} spending is about ${formatCurrency(
      categoryTotal
    )} in your current data. Cutting that by 10-15% would improve your projected month-end balance. A simple first step is to cap discretionary purchases in that category for the rest of the month.`;
  }

  return generateAssistantResponse({ user, prompt, analytics, expenses });
};

export const generateHybridAssistantResponse = async ({ user, prompt, analytics, expenses, history = [] }) => {
  try {
    const response = await fetch(`${env.ollamaHost}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.ollamaModel,
        prompt: buildLocalModelPrompt({ user, prompt, analytics, expenses, history }),
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
    return buildRuleBasedChatResponse({ user, prompt, analytics, expenses, history });
  }
};
