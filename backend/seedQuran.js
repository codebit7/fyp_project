/**
 * ─────────────────────────────────────────────────────────────
 * Quran Seeder — True Tilawah (Arabic Only)
 * ─────────────────────────────────────────────────────────────
 * Source  : https://api.alquran.cloud/v1/quran/quran-uthmani
 * Edition : quran-uthmani (Uthmani Arabic script only)
 *
 * Tables filled:
 *   quranic_texts  → 114 rows  (surahNumber, surahName, surahNameAr, surahType, totalAyahs)
 *   ayahs          → 6,236 rows (surahId, ayahNumber, uthmaniText)
 *
 * Run:
 *   node seedQuran.js
 * ─────────────────────────────────────────────────────────────
 */

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const API_URL   = "https://api.alquran.cloud/v1/quran/quran-uthmani";
const BATCH_SIZE = 20; // ayahs per DB transaction

// ─────────────────────────────────────────────
// Step 1 — Fetch full Quran (Arabic only)
// ─────────────────────────────────────────────
async function fetchQuran() {
  console.log("📡  Fetching Quran (quran-uthmani) ...");

  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error(`API request failed: HTTP ${res.status}`);
  }

  const json = await res.json();

  if (json.code !== 200 || json.status !== "OK") {
    throw new Error(`API returned error: ${json.status}`);
  }

  console.log("✅  Quran data received.\n");
  return json.data; // { surahs: [...] }
}

// ─────────────────────────────────────────────
// Step 2 — Seed quranic_texts table (Surahs)
// ─────────────────────────────────────────────
async function seedSurahs(surahs) {
  console.log(`📖  Seeding ${surahs.length} rows into quranic_texts ...\n`);

  for (const surah of surahs) {
    await prisma.quranicText.upsert({
      where: { surahNumber: surah.number },

      // If row already exists — update names/type in case they changed
      update: {
        surahName  : surah.englishName,
        surahNameAr: surah.name,
        surahType  : surah.revelationType === "Meccan" ? "Makki" : "Madni",
        totalAyahs : surah.ayahs.length,   // API doesn't expose numberOfAyahs on this endpoint
      },

      // First-time insert — maps every column defined in schema
      create: {
        surahNumber : surah.number,
        surahName   : surah.englishName,   // e.g. "Al-Fatihah"
        surahNameAr : surah.name,           // e.g. "الفاتحة"
        surahType   : surah.revelationType === "Meccan" ? "Makki" : "Madni",
        totalAyahs  : surah.ayahs.length,  // count actual ayahs in the array
      },
    });

    console.log(
      `  ✔  [${String(surah.number).padStart(3, "0")}] ${surah.englishName} — ${surah.numberOfAyahs} ayahs`
    );
  }

  console.log("\n✅  quranic_texts seeding complete.\n");
}

// ─────────────────────────────────────────────
// Step 3 — Seed ayahs table
// ─────────────────────────────────────────────
async function seedAyahs(surahs) {
  let grandTotal = 0;

  console.log("📝  Seeding ayahs ...\n");

  for (const surah of surahs) {

    // Resolve the UUID that Prisma generated for this surah
    const surahRecord = await prisma.quranicText.findUnique({
      where : { surahNumber: surah.number },
      select: { id: true },
    });

    if (!surahRecord) {
      throw new Error(`Surah ${surah.number} not found in quranic_texts. Run seedSurahs first.`);
    }

    // Build the ayah rows exactly matching the Ayah model columns
    const ayahRows = surah.ayahs.map((ayah) => ({
      surahId      : surahRecord.id,    // FK → quranic_texts.id
      ayahNumber   : ayah.numberInSurah,
      uthmaniText  : ayah.text,          // Arabic Uthmani script
      // translationEn, translationUr, audioUrl — not seeding, left as null (optional fields)
    }));

    // Process in chunks of BATCH_SIZE to keep transactions small
    const chunks = [];
    for (let i = 0; i < ayahRows.length; i += BATCH_SIZE) {
      chunks.push(ayahRows.slice(i, i + BATCH_SIZE));
    }

    for (const chunk of chunks) {
      await prisma.$transaction(
        chunk.map((ayah) =>
          prisma.ayah.upsert({
            where: {
              surahId_ayahNumber: {
                surahId   : ayah.surahId,
                ayahNumber: ayah.ayahNumber,
              },
            },
            update: {
              uthmaniText: ayah.uthmaniText, // re-seed if text changed
            },
            create: ayah,
          })
        )
      );
    }

    grandTotal += ayahRows.length;
    console.log(
      `  ✔  Surah ${String(surah.number).padStart(3, "0")} — ${ayahRows.length} ayahs inserted (total: ${grandTotal})`
    );
  }

  console.log(`\n✅  ayahs seeding complete. Total rows: ${grandTotal}\n`);
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log("   True Tilawah — Quran Seeder (Arabic Only)  ");
  console.log("═══════════════════════════════════════════════\n");

  try {
    await prisma.$connect();
    console.log("✅  Database connected.\n");

    const data   = await fetchQuran();
    const surahs = data.surahs;

    await seedSurahs(surahs); // → fills quranic_texts
    await seedAyahs(surahs);  // → fills ayahs

    console.log("═══════════════════════════════════════════════");
    console.log("  🎉  Done!  114 Surahs + 6,236 Ayahs seeded. ");
    console.log("═══════════════════════════════════════════════");

  } catch (error) {
    console.error("\n❌  Seeder failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
