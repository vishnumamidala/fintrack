import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
      maxlength: [100, "Goal title cannot exceed 100 characters"],
    },
    targetAmount: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [1, "Target amount must be greater than 0"],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, "Current amount must be at least 0"],
    },
    targetDate: {
      type: Date,
      required: [true, "Target date is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1, targetDate: 1 });

export const Goal = mongoose.model("Goal", goalSchema);

