import { Platform } from 'react-native';

// ─── API URLs ──────────────────────────────────────────────────────────────────
// Android Emulator  → 10.0.2.2 maps to host machine localhost
// iOS Simulator     → localhost
// Physical device   → your machine's local WiFi IP (e.g. 192.168.1.x)
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api');

export const WS_AUDIO_URL =
  process.env.EXPO_PUBLIC_WS_AUDIO_URL ||
  (Platform.OS === 'android' ? 'ws://10.0.2.2:5000/ws/audio' : 'ws://localhost:5000/ws/audio');

// ─── Google OAuth ──────────────────────────────────────────────────────────────
export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
export const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';

// ─── AsyncStorage Keys ─────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  ACCESS_TOKEN:  '@tt_access_token',
  REFRESH_TOKEN: '@tt_refresh_token',
  USER_DATA:     '@tt_user_data',
};

// ─── Colors ────────────────────────────────────────────────────────────────────
export const COLORS = {
  primary:            '#1A3C34',
  primaryLight:       '#2D5A4E',
  secondary:          '#86B6A7',
  secondaryMedium:    '#5C8E7F',
  secondaryLight:     '#D1E0DB',
  secondaryUltraLight:'#E8F3F0',
  background:         '#F5F7F8',
  backgroundLight:    '#F8FAFB',
  white:              '#FFFFFF',
  black:              '#000000',
  gray100:            '#F3F4F6',
  gray200:            '#E5E7EB',
  gray300:            '#D1D5DB',
  gray400:            '#9CA3AF',
  gray500:            '#6B7280',
  gray600:            '#4B5563',
  red:                '#EF4444',
  redLight:           '#FEE2E2',
  orange:             '#F97316',
  orangeLight:        '#FFF7ED',
  green:              '#10B981',
  greenLight:         '#ECFDF5',
  blue:               '#3B82F6',
  blueLight:          '#EFF6FF',
  purple:             '#8B5CF6',
  purpleLight:        '#F5F3FF',
  yellow:             '#EAB308',
  yellowLight:        '#FEFCE8',
};

// ─── Audio ─────────────────────────────────────────────────────────────────────
export const AUDIO_CHUNK_INTERVAL_MS = 250;
