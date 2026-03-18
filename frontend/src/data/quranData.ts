import { Surah, Para, Page, Hizb } from '../models/types';

// ─── Surahs ────────────────────────────────────────────────────────────────────

export const SURAHS: Surah[] = [
  {
    id: 1,
    name: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    type: 'MECCAN',
    versesCount: 7,
    ayats: [
      { number: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
      { number: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: '[All] praise is [due] to Allah, Lord of the worlds -' },
      { number: 3, text: 'الرَّحْمَنِ الرَّحِيمِ', translation: 'The Entirely Merciful, the Especially Merciful,' },
      { number: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Sovereign of the Day of Recompense.' },
      { number: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'It is You we worship and You we ask for help.' },
      { number: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Guide us to the straight path -' },
      { number: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.' },
    ],
  },
  {
    id: 2,
    name: 'Al-Baqarah',
    arabicName: 'البقرة',
    type: 'MEDINIAN',
    versesCount: 286,
    ayats: [
      { number: 1, text: 'الٓمٓ', translation: 'Alif, Lam, Meem.' },
      { number: 2, text: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ', translation: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah -' },
      { number: 3, text: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ', translation: 'Who believe in the unseen, establish prayer, and spend out of what We have provided for them,' },
      { number: 4, text: 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ', translation: 'And who believe in what has been revealed to you, [O Muhammad], and what was revealed before you, and of the Hereafter they are certain [in faith].' },
      { number: 5, text: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ', translation: 'Those are upon [right] guidance from their Lord, and it is those who are the successful.' },
    ],
  },
  { id: 3,  name: 'Al-Imran',   arabicName: 'آل عمران', type: 'MEDINIAN', versesCount: 200 },
  { id: 4,  name: 'An-Nisa',    arabicName: 'النساء',   type: 'MEDINIAN', versesCount: 176 },
  { id: 5,  name: "Al-Ma'idah", arabicName: 'المائدة',  type: 'MEDINIAN', versesCount: 120 },
  { id: 6,  name: "Al-An'am",   arabicName: 'الأنعام',  type: 'MECCAN',   versesCount: 165 },
  { id: 7,  name: "Al-A'raf",   arabicName: 'الأعراف',  type: 'MECCAN',   versesCount: 206 },
  { id: 8,  name: 'Al-Anfal',   arabicName: 'الأنفال',  type: 'MEDINIAN', versesCount: 75  },
  { id: 9,  name: 'At-Tawbah',  arabicName: 'التوبة',   type: 'MEDINIAN', versesCount: 129 },
  { id: 10, name: 'Yunus',      arabicName: 'يونس',     type: 'MECCAN',   versesCount: 109 },
  { id: 11, name: 'Hud',        arabicName: 'هود',      type: 'MECCAN',   versesCount: 123 },
  { id: 12, name: 'Yusuf',      arabicName: 'يوسف',     type: 'MECCAN',   versesCount: 111 },
  { id: 13, name: "Ar-Ra'd",    arabicName: 'الرعد',    type: 'MEDINIAN', versesCount: 43  },
  { id: 14, name: 'Ibrahim',    arabicName: 'إبراهيم',  type: 'MECCAN',   versesCount: 52  },
  { id: 15, name: 'Al-Hijr',    arabicName: 'الحجر',    type: 'MECCAN',   versesCount: 99  },
  { id: 16, name: 'An-Nahl',    arabicName: 'النحل',    type: 'MECCAN',   versesCount: 128 },
  { id: 17, name: 'Al-Isra',    arabicName: 'الإسراء',  type: 'MECCAN',   versesCount: 111 },
  { id: 18, name: 'Al-Kahf',    arabicName: 'الكهف',    type: 'MECCAN',   versesCount: 110 },
  { id: 19, name: 'Maryam',     arabicName: 'مريم',     type: 'MECCAN',   versesCount: 98  },
  { id: 20, name: 'Ta-Ha',      arabicName: 'طه',       type: 'MECCAN',   versesCount: 135 },
  { id: 36, name: 'Ya-Sin',     arabicName: 'يس',       type: 'MECCAN',   versesCount: 83  },
  { id: 55, name: 'Ar-Rahman',  arabicName: 'الرحمن',   type: 'MEDINIAN', versesCount: 78  },
  { id: 56, name: "Al-Waqi'ah", arabicName: 'الواقعة',  type: 'MECCAN',   versesCount: 96  },
  { id: 67, name: 'Al-Mulk',    arabicName: 'الملك',    type: 'MECCAN',   versesCount: 30  },
  { id: 112, name: 'Al-Ikhlas', arabicName: 'الإخلاص',  type: 'MECCAN',   versesCount: 4   },
  { id: 113, name: 'Al-Falaq',  arabicName: 'الفلق',    type: 'MECCAN',   versesCount: 5   },
  { id: 114, name: 'An-Nas',    arabicName: 'الناس',    type: 'MECCAN',   versesCount: 6   },
];

// ─── Para names ────────────────────────────────────────────────────────────────

const PARA_NAMES: string[] = [
  'Alif Lam Meem',       'Sayaqool',          'Tilkal Rusull',
  'Lan Tanaloo',         'Wal Mohsanat',       'La Yuhibbullah',
  'Wa Iza Samiu',        'Walau Annana',       'Qalal Malao',
  "Wa'lamu",             "Ya'taziroon",        'Wa Ma Min Da\'abbatin',
  "Wa Ma Ubabri'u",      'Rubama',             'Subhanallazi',
  'Qal Alam',            'Iqtaraba',           'Qad Aflaha',
  'Wa Qalallazina',      'Aman Khalaqa',       'Utlu Ma Oohiya',
  'Wa Manyaqnut',        'Wa Mali',            'Faman Azlam',
  'Elahe Yuruddo',       'Ha Meem',            'Qala Fama Khatbukum',
  'Qad Sami Allah',      'Tabarakallazi',      'Amma',
];

/** Sample ayats used as placeholder content for Para / Page / Hizb items */
const SAMPLE_AYATS = [
  { number: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
  { number: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: '[All] praise is [due] to Allah, Lord of the worlds -' },
  { number: 3, text: 'الرَّحْمَنِ الرَّحِيمِ', translation: 'The Entirely Merciful, the Especially Merciful,' },
  { number: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Sovereign of the Day of Recompense.' },
  { number: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'It is You we worship and You we ask for help.' },
  { number: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Guide us to the straight path -' },
  { number: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translation: 'The path of those upon whom You have bestowed favor.' },
];

// ─── Paras ────────────────────────────────────────────────────────────────────

export const PARAS: Para[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: PARA_NAMES[i],
  arabicName: `الجزء ${i + 1}`,
  surahRange: `Surah ${i + 1} - Surah ${i + 2}`,
  ayatsCount: 200 + Math.floor(Math.random() * 50),
  ayats: SAMPLE_AYATS,
}));

// ─── Pages ────────────────────────────────────────────────────────────────────

export const PAGES: Page[] = Array.from({ length: 604 }, (_, i) => ({
  id: i + 1,
  name: `Page ${i + 1}`,
  arabicName: `صفحة ${i + 1}`,
  surahName: SURAHS[Math.floor(Math.random() * SURAHS.length)].name,
  ayatsCount: 5 + Math.floor(Math.random() * 15),
  ayats: SAMPLE_AYATS.slice(0, 2),
}));

// ─── Hizbs ────────────────────────────────────────────────────────────────────

export const HIZBS: Hizb[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  name: `Hizb ${i + 1}`,
  arabicName: `حزب ${i + 1}`,
  surahRange: `Surah ${Math.floor(i / 2) + 1} - Surah ${Math.floor(i / 2) + 2}`,
  ayatsCount: 100 + Math.floor(Math.random() * 50),
  ayats: SAMPLE_AYATS.slice(0, 2),
}));
