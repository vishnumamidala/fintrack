import { StatusCodes } from "http-status-codes";
import { Goal } from "../models/Goal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { logActivity } from "../utils/logActivity.js";

const enrichGoal = (goal) => {
  const targetAmount = goal.targetAmount || 0;
  const currentAmount = goal.currentAmount || 0;
  const progress = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
  const today = new Date();
  const targetDate = new Date(goal.targetDate);
  const monthsRemaining = Math.max(
    (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth()) + 1,
    1
  );

  return {
    ...goal.toObject?.() ?? goal,
    progress: Number(progress.toFixed(1)),
    requiredMonthlySavings: Number(Math.max((targetAmount - currentAmount) / monthsRemaining, 0).toFixed(2)),
  };
};

export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ targetDate: 1 });
  res.status(StatusCodes.OK).json({
    success: true,
    data: goals.map(enrichGoal),
  });
});

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({ ...req.body, user: req.user._id });

  await logActivity({
    userId: req.user._id,
    action: "goal.created",
    entityType: "goal",
    entityId: goal._id,
    title: "Savings goal created",
    description: `${goal.title} was added with a target of ${goal.targetAmount}.`,
    metadata: {
      title: goal.title,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate,
    },
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Goal created successfully",
    data: enrichGoal(goal),
  });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!goal) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Goal not found");
  }

  await logActivity({
    userId: req.user._id,
    action: "goal.updated",
    entityType: "goal",
    entityId: goal._id,
    title: "Savings goal updated",
    description: `${goal.title} progress or target details changed.`,
    metadata: {
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
    },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Goal updated successfully",
    data: enrichGoal(goal),
  });
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Goal not found");
  }

  await logActivity({
    userId: req.user._id,
    action: "goal.deleted",
    entityType: "goal",
    entityId: goal._id,
    title: "Savings goal removed",
    description: `${goal.title} was deleted.`,
    metadata: {
      title: goal.title,
    },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Goal deleted successfully",
  });
});
