// ─── Navigation ────────────────────────────────────────────────────────────────

export type Screen =
  | 'onboarding'
  | 'auth'
  | 'dashboard'
  | 'quran_list'
  | 'surah_detail'
  | 'para_detail'
  | 'page_detail'
  | 'hizb_detail'
  | 'recite'
  | 'track'
  | 'retain'
  | 'retain_test'
  | 'retain_results'
  | 'bookmarks'
  | 'profile'
  | 'settings'
  | 'help';

// ─── Quran Entities ────────────────────────────────────────────────────────────

export interface Ayah {
  number: number;
  text: string;
  translation: string;
}

export interface Surah {
  id: number;
  name: string;
  arabicName: string;
  type: 'MECCAN' | 'MEDINIAN';
  versesCount: number;
  ayats?: Ayah[];
}

export interface Para {
  id: number;
  name: string;
  arabicName: string;
  surahRange: string;
  ayatsCount: number;
  ayats?: Ayah[];
}

export interface Page {
  id: number;
  name: string;
  arabicName: string;
  surahName: string;
  ayatsCount: number;
  ayats?: Ayah[];
}

export interface Hizb {
  id: number;
  name: string;
  arabicName: string;
  surahRange: string;
  ayatsCount: number;
  ayats?: Ayah[];
}

// ─── User ──────────────────────────────────────────────────────────────────────

export interface User {
  name: string;
  level: string;
  avatar: string;
}

// ─── Search ────────────────────────────────────────────────────────────────────

export type SearchResultType = 'surah' | 'para' | 'page' | 'hizb' | 'ayah';

export interface SearchResult {
  type: SearchResultType;
  data: Surah | Para | Page | Hizb | (Ayah & { surahId: number; surahName: string });
  label: string;
  sub: string;
}

// ─── Audio / WebSocket ─────────────────────────────────────────────────────────

export interface AudioAnalysisResult {
  type: 'mistake' | 'correct' | 'info';
  message: string;
  timestamp: number;
}

export type AudioStreamCallback = (result: AudioAnalysisResult) => void;
export type ConnectionCallback = (connected: boolean) => void;
