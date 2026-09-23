export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  juz: number;
}

export interface Ayah {
  numberInSurah: number;
  text: string;
  tafsir?: string;
  juz?: number;
}

export interface Reciter {
  id: string;
  name: string;
  subname: string;
  bio: string;
  style: 'murattal' | 'mujawwad';
  avatar: string;
  // EveryAyah subfolder for verse-by-verse
  everyAyahFolder: string;
  // Mp3Quran server URL for full Surah MP3
  serverUrl: string;
}

export interface NameOfAllah {
  id: number;
  name: string;
  transliteration: string;
  meaning: string;
  explanation: string;
  quranicEvidence: string;
  category: 'mercy' | 'majesty' | 'knowledge' | 'creation' | 'forgiveness';
}

export interface Wallpaper {
  id: string;
  title: string;
  category: 'kaaba' | 'madinah' | 'mosques' | 'calligraphy' | 'nature' | 'art';
  categoryAr: string;
  url: string;
  thumbUrl: string;
  photographer?: string;
  aspectRatio?: '9:16' | '16:9';
  descriptionAr: string;
}

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
  note?: string;
}
