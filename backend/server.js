/**
 * server.js  →  replace backend/server.js with this file
 *
 * Changes from original:
 *  - Adds express-ws so the app supports WebSocket routes
 *  - Registers /ws/audio for real-time audio analysis
 *
 * Install once:
 *   npm install express-ws
 */

require('dotenv').config();

const app       = require('./src/app');
const cors      = require('cors');
const expressWs = require('express-ws');

const { connectDatabase, disconnectDatabase } = require('./src/config/database');
const { registerAudioWebSocket }              = require('./src/routes/audio.ws');

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function start() {
  // Enable CORS for all origins
  app.use(cors());
  await connectDatabase();

  // Upgrade the Express app to support WebSocket routes (mutates app in-place)
  expressWs(app);

  // Register /ws/audio endpoint
  registerAudioWebSocket(app);

  const server = app.listen(PORT, () => {
    console.log(`\n🚀  True Tilawah API is running`);
    console.log(`   REST  →  http://localhost:${PORT}/api`);
    console.log(`   WS    →  ws://localhost:${PORT}/ws/audio`);
    console.log(`   Health → http://localhost:${PORT}/api/health\n`);
  });

  // ── Graceful shutdown ────────────────────────────────────────────────────────

  const shutdown = async (signal) => {
    console.log(`\n⚠️  ${signal} received – shutting down…`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('✅  Clean shutdown complete');
      process.exit(0);
    });
    // Force-exit if graceful shutdown takes too long
    setTimeout(() => { console.error('❌  Forced exit'); process.exit(1); }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('unhandledRejection', (r) => console.error('Unhandled rejection:', r));
  process.on('uncaughtException',  (e) => { console.error('Uncaught exception:', e); process.exit(1); });
}

start();
