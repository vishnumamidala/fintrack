import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";


const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
  env.clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Expense Tracker API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/goals", goalRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
