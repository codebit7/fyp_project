const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");
const rateLimit = require("express-rate-limit");

const routes = require("./routes/index");
const {
  prismaErrorHandler,
  globalErrorHandler,
  notFoundHandler,
} = require("./middleware/error.middleware");

const app = express();

// ─────────────────────────────────────────────
// Security headers
// ─────────────────────────────────────────────
app.use(helmet());

// ─────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─────────────────────────────────────────────
// Request logging (skip in test env)
// ─────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// ─────────────────────────────────────────────
// Body parsing
// ─────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));       // JSON payloads
app.use(express.urlencoded({ extended: true })); // form-encoded

// ─────────────────────────────────────────────
// Global rate limiter
// ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down and try again later.",
  },
});
app.use("/api", limiter);

// ─────────────────────────────────────────────
// API routes — all prefixed with /api
// ─────────────────────────────────────────────
app.use("/api", routes);

// ─────────────────────────────────────────────
// 404 — must be after all real routes
// ─────────────────────────────────────────────
app.use(notFoundHandler);

// ─────────────────────────────────────────────
// Error handlers — must be last, in this order
// ─────────────────────────────────────────────
app.use(prismaErrorHandler);
app.use(globalErrorHandler);

module.exports = app;
