import { StatusCodes } from "http-status-codes";
import { AssistantChat } from "../models/AssistantChat.js";
import { Expense } from "../models/Expense.js";
import { Goal } from "../models/Goal.js";
import { generateHybridAssistantResponse } from "../services/aiAssistantService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getExpenseAnalytics } from "../utils/expenseAnalytics.js";
import { buildExpenseFilters } from "../utils/expenseQuery.js";
import { logActivity } from "../utils/logActivity.js";

export const getAssistantChat = asyncHandler(async (req, res) => {
  const chat = await AssistantChat.findOne({ user: req.user._id }).lean();

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      messages: chat?.messages || [],
    },
  });
});

export const askAssistant = asyncHandler(async (req, res) => {
  const filters = buildExpenseFilters(req.user._id, req.body.filters || {});

  const [analytics, recentExpenses, chat, goals] = await Promise.all([
    getExpenseAnalytics(filters, req.user),
    Expense.find(filters).sort({ date: -1, createdAt: -1 }).limit(12).lean(),
    AssistantChat.findOne({ user: req.user._id }),
    Goal.find({ user: req.user._id }).sort({ targetDate: 1 }).lean(),
  ]);

  const history = chat?.messages || [];
  analytics.goals = goals;

  const answer = await generateHybridAssistantResponse({
    user: req.user,
    prompt: req.body.prompt,
    analytics,
    expenses: recentExpenses,
    filters: req.body.filters || {},
    history: history.slice(-10),
  });

  const nextMessages = [
    ...history,
    { role: "user", content: req.body.prompt },
    { role: "assistant", content: answer },
  ].slice(-20);

  await AssistantChat.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, messages: nextMessages },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await logActivity({
    userId: req.user._id,
    action: "assistant.asked",
    entityType: "assistant",
    title: "Assistant conversation continued",
    description: `Asked the assistant: ${req.body.prompt.slice(0, 90)}`,
    metadata: {
      prompt: req.body.prompt.slice(0, 140),
      conversationLength: nextMessages.length,
    },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      answer,
      messages: nextMessages,
      generatedAt: new Date().toISOString(),
    },
  });
});

export const resetAssistantChat = asyncHandler(async (req, res) => {
  await AssistantChat.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, messages: [] },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await logActivity({
    userId: req.user._id,
    action: "assistant.cleared",
    entityType: "assistant",
    title: "Assistant chat cleared",
    description: "Conversation history was reset by the user.",
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Assistant chat cleared",
    data: {
      messages: [],
    },
  });
});
