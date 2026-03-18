// Load environment variables FIRST — before any other import reads process.env
require("dotenv").config();

const app = require("./src/app");
const { connectDatabase, disconnectDatabase } = require("./src/config/database");

const PORT = parseInt(process.env.PORT) || 5000;

// ─────────────────────────────────────────────
// Boot sequence
// ─────────────────────────────────────────────
const start = async () => {
  // 1. Verify DB is reachable before accepting traffic
  await connectDatabase();

  // 2. Start HTTP server
  const server = app.listen(PORT, () => {
    console.log(`🚀  True Tilawah API running on port ${PORT}`);
    console.log(`📡  Environment : ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗  Base URL    : http://localhost:${PORT}/api`);
    console.log(`❤️   Health     : http://localhost:${PORT}/api/health`);
  });

  // ─────────────────────────────────────────────
  // Graceful shutdown handlers
  // ─────────────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`\n⚠️   Received ${signal}. Shutting down gracefully...`);

    server.close(async () => {
      await disconnectDatabase();
      console.log("✅  Server closed.");
      process.exit(0);
    });

    // Force-quit after 10 s if graceful shutdown hangs
    setTimeout(() => {
      console.error("❌  Forced shutdown after timeout.");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));

  // ─────────────────────────────────────────────
  // Catch unhandled promise rejections & exceptions
  // ─────────────────────────────────────────────
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Promise Rejection:", reason);
    // Do not crash in production; log and continue
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    // Crash the process — state is unknown
    process.exit(1);
  });
};

start();
