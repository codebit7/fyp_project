/**
 * audio.ws.js  →  place at: backend/src/routes/audio.ws.js
 *
 * WebSocket endpoint: ws://localhost:5000/ws/audio
 * Query params:  ?token=<accessToken>&sessionId=<uuid>
 *
 * Protocol:
 *  ┌───────────────────────────────────────────────────────────────┐
 *  │  Client → Server : binary frame = [4-byte seqNo][audioChunk] │
 *  │  Server → Client : JSON text frame = AudioAnalysisResult      │
 *  └───────────────────────────────────────────────────────────────┘
 *
 * The 4-byte big-endian sequence number lets us detect and skip
 * out-of-order packets so we never pass a broken chunk to the ASR engine.
 *
 * Replace  analyseAudio()  with your real ASR / NLP call.
 */

const { verifyAccessToken } = require('../utils/jwt.util');
const prisma                = require('../models/prismaClient');

// ─── Stub analyser – replace with Whisper / DeepSpeech / your model ──────────

/**
 * Receives a Buffer of audio bytes (already stripped of the sequence header)
 * and returns an AudioAnalysisResult object or null (no mistake detected).
 *
 * @param {Buffer}  audioChunk   - raw audio bytes
 * @param {object}  ctx          - { sessionId, userId, surahId, ayahStart, ayahEnd }
 * @returns {object|null}
 */
async function analyseAudio(audioChunk, ctx) {
  // TODO: replace this stub with a real call, e.g.:
  //   const response = await fetch('http://localhost:8001/analyse', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'audio/webm' },
  //     body: audioChunk,
  //   });
  //   if (!response.ok) return null;
  //   return response.json(); // { errorType, incorrectWord, correctWord, message }

  // Demo: randomly inject a mistake so the UI feedback panel is testable
  if (Math.random() > 0.88) {
    const demos = [
      {
        errorType:     'TAJWEED_VIOLATION',
        incorrectWord: 'الرَّحْمَنِ',
        correctWord:   'الرَّحْمَٰنِ',
        message:       "Tajweed: Madd is too short on 'Ar-Rahman'",
      },
      {
        errorType:     'MISPRONUNCIATION',
        incorrectWord: 'رَبِّ',
        correctWord:   'رَبِّ',
        message:       "Mispronunciation: 'Ra' should be Tafkheem (heavy)",
      },
      {
        errorType:     'UNCLEAR_SPEECH',
        incorrectWord: '',
        correctWord:   '',
        message:       'Unclear speech – please speak more clearly',
      },
    ];
    return demos[Math.floor(Math.random() * demos.length)];
  }

  return null;
}

// ─── WebSocket handler ────────────────────────────────────────────────────────

/**
 * Registers GET /ws/audio on the express-ws–enhanced Express app.
 * Call once from server.js after  expressWs(app).
 */
function registerAudioWebSocket(app) {
  app.ws('/ws/audio', async (ws, req) => {
    // ── 1. Authenticate ──────────────────────────────────────────────────────

    const { token, sessionId } = req.query;

    if (!token || !sessionId) {
      ws.close(4001, 'token and sessionId query params are required');
      return;
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      ws.close(4001, 'Invalid or expired token');
      return;
    }

    // Verify the session is ACTIVE and belongs to this user
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: decoded.id, status: 'ACTIVE' },
    }).catch(() => null);

    if (!session) {
      ws.close(4003, 'Session not found or not active');
      return;
    }

    const ctx = {
      sessionId,
      userId:    decoded.id,
      surahId:   session.surahId,
      ayahStart: session.ayahStart,
      ayahEnd:   session.ayahEnd,
    };

    console.log(`🎙️  WS opened  — user:${decoded.id}  session:${sessionId}`);

    // ── 2. Expected packet sequence counter ──────────────────────────────────
    let expectedSeq = 0;

    // ── 3. Receive audio chunks ──────────────────────────────────────────────

    ws.on('message', async (data) => {
      try {
        // data must be an ArrayBuffer / Buffer (binary frame from MediaRecorder)
        const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);

        if (buf.byteLength < 4) return; // malformed – ignore

        // Extract 4-byte big-endian sequence number
        const seqNo = buf.readUInt32BE(0);

        // Drop out-of-order packets so broken words never reach the ASR engine
        if (seqNo < expectedSeq) {
          console.warn(`WS: dropped out-of-order packet seq=${seqNo}`);
          return;
        }
        expectedSeq = seqNo + 1;

        // Audio payload starts after the 4-byte header
        const audioChunk = buf.slice(4);

        const result = await analyseAudio(audioChunk, ctx);

        if (result && ws.readyState === ws.OPEN) {
          ws.send(
            JSON.stringify({
              type:            'mistake',
              message:         result.message,
              timestamp:       Date.now(),
              errorType:       result.errorType,
              incorrectWord:   result.incorrectWord,
              correctWord:     result.correctWord,
              confidenceScore: Math.random() * 0.3 + 0.7,  // demo 0.70–1.00
              ayahNumber:      ctx.ayahStart,
            })
          );
        }
      } catch (err) {
        console.error('WS: analysis error', err.message);
      }
    });

    ws.on('close', (code, reason) => {
      console.log(`🔌  WS closed  — session:${sessionId}  code:${code}`);
    });

    ws.on('error', (err) => {
      console.error('WS error:', err.message);
    });
  });
}

module.exports = { registerAudioWebSocket };
