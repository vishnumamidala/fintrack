import mongoose from "mongoose";

const assistantMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [4000, "Message content cannot exceed 4000 characters"],
    },
  },
  { _id: false, timestamps: true }
);

const assistantChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    messages: {
      type: [assistantMessageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const AssistantChat = mongoose.model("AssistantChat", assistantChatSchema);

