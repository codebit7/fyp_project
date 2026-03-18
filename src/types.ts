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

export interface User {
  name: string;
  level: string;
  avatar: string;
}
