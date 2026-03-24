import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be greater than or equal to 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
      index: true,
    },
    merchant: {
      type: String,
      trim: true,
      maxlength: [80, "Merchant cannot exceed 80 characters"],
    },
    paymentMethod: {
      type: String,
      trim: true,
      maxlength: [50, "Payment method cannot exceed 50 characters"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, "Notes cannot exceed 300 characters"],
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

expenseSchema.index({ user: 1, date: -1 });

export const Expense = mongoose.model("Expense", expenseSchema);
