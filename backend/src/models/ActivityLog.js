import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: [80, "Action cannot exceed 80 characters"],
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
      maxlength: [40, "Entity type cannot exceed 40 characters"],
    },
    entityId: {
      type: String,
      trim: true,
      maxlength: [120, "Entity id cannot exceed 120 characters"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [140, "Title cannot exceed 140 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [280, "Description cannot exceed 280 characters"],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ user: 1, createdAt: -1 });

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
