import { User } from '../models/types';

export const CURRENT_USER: User = {
  name: 'Ahmed Ali',
  level: 'Beginner Student',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
};

/** WebSocket endpoint for real-time audio analysis */
export const WS_AUDIO_URL = 'ws://localhost:8000/ws/audio';

/** How often (ms) audio chunks are sent to the WebSocket server */
export const AUDIO_CHUNK_INTERVAL_MS = 250;

/** Screens that show the bottom navigation bar */
export const SCREENS_WITH_NAV: string[] = [
  'dashboard',
  'quran_list',
  'recite',
  'track',
  'bookmarks',
  'retain',
  'surah_detail',
  'para_detail',
  'page_detail',
  'hizb_detail',
  'retain_test',
  'retain_results',
];
