import { StatusCodes } from "http-status-codes";
import { env } from "../config/env.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { logActivity } from "../utils/logActivity.js";

const buildAuthResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || "",
  monthlyBudget: user.monthlyBudget,
  categoryBudgets: user.categoryBudgets || [],
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, "Email is already registered");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken({ userId: user._id }, env.jwtSecret, env.jwtExpiresIn);
  await logActivity({
    userId: user._id,
    action: "auth.register",
    entityType: "auth",
    title: "Account created",
    description: "User registered and completed initial onboarding.",
    metadata: {
      email: user.email,
    },
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: buildAuthResponse(user),
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const token = generateToken({ userId: user._id }, env.jwtSecret, env.jwtExpiresIn);
  await logActivity({
    userId: user._id,
    action: "auth.login",
    entityType: "auth",
    title: "Signed in",
    description: "User authenticated successfully.",
    metadata: {
      email: user.email,
    },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: buildAuthResponse(user),
      token,
    },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const updates = {};

  if (req.body.monthlyBudget !== undefined) {
    updates.monthlyBudget = req.body.monthlyBudget;
  }

  if (req.body.categoryBudgets !== undefined) {
    updates.categoryBudgets = req.body.categoryBudgets;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  await logActivity({
    userId: req.user._id,
    action: "user.preferences.updated",
    entityType: "preferences",
    entityId: user._id,
    title: "Preferences updated",
    description: "Budget preferences were updated.",
    metadata: {
      monthlyBudget: updates.monthlyBudget,
      categoryBudgetCount: updates.categoryBudgets?.length,
    },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Preferences updated successfully",
    data: {
      user: buildAuthResponse(user),
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};

  if (req.body.name !== undefined) {
    updates.name = req.body.name;
  }

  if (req.body.avatar !== undefined) {
    updates.avatar = req.body.avatar;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  await logActivity({
    userId: req.user._id,
    action: "user.profile.updated",
    entityType: "profile",
    entityId: user._id,
    title: "Profile updated",
    description: "Profile details were updated.",
    metadata: {
      changedName: updates.name !== undefined,
      changedAvatar: updates.avatar !== undefined,
    },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user: buildAuthResponse(user),
    },
  });
});

export const getActivityFeed = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const activity = await ActivityLog.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(limit).lean();

  res.status(StatusCodes.OK).json({
    success: true,
    data: activity,
  });
});
