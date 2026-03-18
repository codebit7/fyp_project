import { Surah, Ayah } from '../../models/types';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Fetches the full list of Surahs (without ayats for performance).
 */
export const fetchSurahs = async (): Promise<Surah[]> => {
  const response = await fetch(`${API_BASE_URL}/quran/surahs`);
  if (!response.ok) throw new Error('Failed to fetch Surahs');
  return response.json() as Promise<Surah[]>;
};

/**
 * Fetches all Ayahs for a given Surah ID.
 */
export const fetchAyahsBySurah = async (surahId: number): Promise<Ayah[]> => {
  const response = await fetch(`${API_BASE_URL}/quran/surahs/${surahId}/ayahs`);
  if (!response.ok) throw new Error(`Failed to fetch ayahs for Surah ${surahId}`);
  return response.json() as Promise<Ayah[]>;
};

/**
 * Saves a bookmark for a specific ayah.
 */
export const bookmarkAyah = async (
  surahId: number,
  ayahNumber: number,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ surahId, ayahNumber }),
  });

  if (!response.ok) throw new Error('Failed to save bookmark');
};
