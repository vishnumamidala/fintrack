import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env.js";

export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong";
  let details = err.details || null;

  if (err.name === "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation failed";
    details = Object.values(err.errors).map((item) => item.message);
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = `Invalid value for ${err.path}`;
  }

  if (err.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    message = "Duplicate field value entered";
    details = err.keyValue;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Invalid authentication token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Authentication token has expired";
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      details,
      ...(env.nodeEnv !== "production" && { stack: err.stack }),
    },
  });
};

