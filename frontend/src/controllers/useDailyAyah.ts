import { useState, useCallback } from 'react';
import { Ayah } from '../models/types';
import { SURAHS } from '../data/quranData';

interface DailyAyahState {
  dailyAyah: { ayah: Ayah; surahName: string; surahId: number } | null;
  refreshDailyAyah: () => void;
}

/**
 * useDailyAyah
 *
 * Picks a random ayah from the first two surahs (which have full ayat data).
 * Call refreshDailyAyah() to pick a new one.
 */
export const useDailyAyah = (): DailyAyahState => {
  const pickRandomAyah = () => {
    const surahIndex = Math.floor(Math.random() * 2);
    const surah = SURAHS[surahIndex];

    if (!surah.ayats?.length) return null;

    const ayahIndex = Math.floor(Math.random() * surah.ayats.length);
    return {
      ayah: surah.ayats[ayahIndex],
      surahName: surah.name,
      surahId: surah.id,
    };
  };

  const [dailyAyah, setDailyAyah] = useState(pickRandomAyah);

  const refreshDailyAyah = useCallback(() => {
    setDailyAyah(pickRandomAyah());
  }, []);

  return { dailyAyah, refreshDailyAyah };
};
