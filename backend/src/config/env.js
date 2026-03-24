import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: (process.env.CLIENT_URL || "http://localhost:5173").trim(),
  ollamaHost: process.env.OLLAMA_HOST || "http://127.0.0.1:11434",
  ollamaModel: process.env.OLLAMA_MODEL || "llama3.2:3b",
};
