const prisma = require("../models/prismaClient");

/**
 * Creates a new ACTIVE session for the user.
 */
const createSession = async (userId, { surahId, ayahStart, ayahEnd }) => {
  // Verify the surah exists
  const surah = await prisma.quranicText.findUnique({
    where: { surahNumber: surahId },
  });

  if (!surah) {
    const err = new Error(`Surah number ${surahId} does not exist.`);
    err.statusCode = 404;
    throw err;
  }

  // Validate ayah range
  if (ayahStart < 1 || ayahEnd > surah.totalAyahs || ayahStart > ayahEnd) {
    const err = new Error(
      `Invalid Ayah range. Surah ${surah.surahName} has ${surah.totalAyahs} Ayahs.`
    );
    err.statusCode = 400;
    throw err;
  }

  const session = await prisma.session.create({
    data: { userId, surahId, ayahStart, ayahEnd },
    include: { quranicText: { select: { surahName: true, surahNameAr: true } } },
  });

  return session;
};

/**
 * Returns all sessions for the authenticated user (paginated).
 */
const getUserSessions = async (userId, { page = 1, limit = 10, status } = {}) => {
  const skip = (page - 1) * limit;

  const where = { userId };
  if (status) where.status = status;

  const [sessions, total] = await prisma.$transaction([
    prisma.session.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        quranicText: { select: { surahName: true, surahNameAr: true } },
        _count: { select: { feedbacks: true, recordings: true } },
      },
    }),
    prisma.session.count({ where }),
  ]);

  return {
    sessions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Returns a single session with its feedbacks and recordings.
 * Ensures the session belongs to the requesting user.
 */
const getSessionById = async (sessionId, userId) => {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId },
    include: {
      quranicText: true,
      feedbacks: {
        include: { tajweedRule: true },
        orderBy: { createdAt: "asc" },
      },
      recordings: { orderBy: { timestampStart: "asc" } },
    },
  });

  if (!session) {
    const err = new Error("Session not found.");
    err.statusCode = 404;
    throw err;
  }

  return session;
};

/**
 * Marks a session as COMPLETED, saves final transcript + accuracy,
 * and recalculates the user's overall Progress record.
 */
const completeSession = async (sessionId, userId, { transcript, accuracyScore }) => {
  // Verify ownership
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId, status: "ACTIVE" },
  });

  if (!session) {
    const err = new Error("Active session not found.");
    err.statusCode = 404;
    throw err;
  }

  const endTime = new Date();
  const durationSec = Math.round(
    (endTime.getTime() - session.startTime.getTime()) / 1000
  );

  // Update session + progress atomically
  const [updatedSession] = await prisma.$transaction([
    prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        endTime,
        durationSec,
        transcript,
        accuracyScore,
      },
    }),
    // Recalculate progress stats
    prisma.$executeRaw`
      UPDATE progress p
      JOIN (
        SELECT
          userId,
          COUNT(*) AS totalSessions,
          AVG(accuracyScore) AS averageAccuracy,
          SUM(durationSec) / 60 AS totalTimeMin
        FROM sessions
        WHERE userId = ${userId} AND status = 'COMPLETED'
      ) s ON p.userId = s.userId
      SET
        p.totalSessions   = s.totalSessions,
        p.averageAccuracy = s.averageAccuracy,
        p.totalTimeMin    = s.totalTimeMin,
        p.lastPracticed   = NOW()
      WHERE p.userId = ${userId}
    `,
  ]);

  return updatedSession;
};

/**
 * Marks a session as ABANDONED.
 */
const abandonSession = async (sessionId, userId) => {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId, status: "ACTIVE" },
  });

  if (!session) {
    const err = new Error("Active session not found.");
    err.statusCode = 404;
    throw err;
  }

  return prisma.session.update({
    where: { id: sessionId },
    data: { status: "ABANDONED", endTime: new Date() },
  });
};

/**
 * Deletes a session (and cascades recordings + feedbacks).
 */
const deleteSession = async (sessionId, userId) => {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId },
  });

  if (!session) {
    const err = new Error("Session not found.");
    err.statusCode = 404;
    throw err;
  }

  await prisma.session.delete({ where: { id: sessionId } });
  return { deleted: true };
};

module.exports = {
  createSession,
  getUserSessions,
  getSessionById,
  completeSession,
  abandonSession,
  deleteSession,
};
