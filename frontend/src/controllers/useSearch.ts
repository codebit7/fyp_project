import { useState } from 'react';
import { SearchResult, SearchResultType } from '../models/types';
import { SURAHS, PARAS, PAGES, HIZBS } from '../data/quranData';

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearchVisible: boolean;
  toggleSearch: () => void;
  hideSearch: () => void;
}

/**
 * useSearch
 *
 * Filters Surahs, Paras, Pages, Hizbs and Ayahs by a text query.
 * Returns up to 10 combined results for display.
 */
export const useSearch = (): SearchState => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const searchResults: SearchResult[] = searchQuery.length > 1
    ? buildSearchResults(searchQuery)
    : [];

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearchVisible,
    toggleSearch: () => setIsSearchVisible((prev) => !prev),
    hideSearch: () => setIsSearchVisible(false),
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildSearchResults(query: string): SearchResult[] {
  const lowerQuery = query.toLowerCase();

  const surahResults: SearchResult[] = SURAHS
    .filter((s) => s.name.toLowerCase().includes(lowerQuery))
    .map((s) => ({ type: 'surah' as SearchResultType, data: s, label: s.name, sub: 'Surah' }));

  const paraResults: SearchResult[] = PARAS
    .filter((p) => p.name.toLowerCase().includes(lowerQuery))
    .map((p) => ({ type: 'para' as SearchResultType, data: p, label: p.name, sub: 'Para' }));

  const pageResults: SearchResult[] = PAGES
    .filter((p) => p.name.toLowerCase().includes(lowerQuery))
    .map((p) => ({ type: 'page' as SearchResultType, data: p, label: p.name, sub: 'Page' }));

  const hizbResults: SearchResult[] = HIZBS
    .filter((h) => h.name.toLowerCase().includes(lowerQuery))
    .map((h) => ({ type: 'hizb' as SearchResultType, data: h, label: h.name, sub: 'Hizb' }));

  const ayahResults: SearchResult[] = SURAHS.flatMap((surah) =>
    (surah.ayats ?? [])
      .filter(
        (ayah) =>
          ayah.translation.toLowerCase().includes(lowerQuery) ||
          ayah.text.includes(query)
      )
      .map((ayah) => ({
        type: 'ayah' as SearchResultType,
        data: { ...ayah, surahId: surah.id, surahName: surah.name },
        label: `Ayah ${ayah.number}`,
        sub: surah.name,
      }))
  );

  return [...surahResults, ...paraResults, ...pageResults, ...hizbResults, ...ayahResults].slice(0, 10);
}
