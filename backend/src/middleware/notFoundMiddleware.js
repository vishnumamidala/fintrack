import { StatusCodes } from "http-status-codes";

export const notFoundMiddleware = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    error: {
      message: `Route not found: ${req.originalUrl}`,
    },
  });
};

