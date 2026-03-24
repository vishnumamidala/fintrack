import { StatusCodes } from "http-status-codes";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const buildAuthResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
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

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Preferences updated successfully",
    data: {
      user: buildAuthResponse(user),
    },
  });
});
