import { SURAH_LIST } from '../data/surahList';

export interface QuranSurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    page: number;
    sajda?: boolean | object;
  }[];
}

// In-memory cache
let quranCache: QuranSurahData[] | null = null;
let fetchPromise: Promise<QuranSurahData[]> | null = null;

// Built-in starter surahs for immediate zero-latency load (Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kawthar)
const FALLBACK_SURAHS: Record<number, QuranSurahData> = {
  1: {
    number: 1,
    name: "سُورَةُ ٱلْفَاتِحَةِ",
    englishName: "Al-Faatiha",
    englishNameTranslation: "The Opening",
    revelationType: "Meccan",
    ayahs: [
      { number: 1, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", numberInSurah: 1, juz: 1, page: 1 },
      { number: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", numberInSurah: 2, juz: 1, page: 1 },
      { number: 3, text: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", numberInSurah: 3, juz: 1, page: 1 },
      { number: 4, text: "مَٰلِكِ يَوْمِ ٱلدِّينِ", numberInSurah: 4, juz: 1, page: 1 },
      { number: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", numberInSurah: 5, juz: 1, page: 1 },
      { number: 6, text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", numberInSurah: 6, juz: 1, page: 1 },
      { number: 7, text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", numberInSurah: 7, juz: 1, page: 1 }
    ]
  },
  112: {
    number: 112,
    name: "سُورَةُ الإِخْلَاصِ",
    englishName: "Al-Ikhlaas",
    englishNameTranslation: "Sincerity",
    revelationType: "Meccan",
    ayahs: [
      { number: 6222, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ هُوَ ٱللَّهُ أَحَدٌ", numberInSurah: 1, juz: 30, page: 604 },
      { number: 6223, text: "ٱللَّهُ ٱلصَّمَدُ", numberInSurah: 2, juz: 30, page: 604 },
      { number: 6224, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", numberInSurah: 3, juz: 30, page: 604 },
      { number: 6225, text: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", numberInSurah: 4, juz: 30, page: 604 }
    ]
  },
  113: {
    number: 113,
    name: "سُورَةُ الفَلَقِ",
    englishName: "Al-Falaq",
    englishNameTranslation: "Daybreak",
    revelationType: "Meccan",
    ayahs: [
      { number: 6226, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", numberInSurah: 1, juz: 30, page: 604 },
      { number: 6227, text: "مِن شَرِّ مَا خَلَقَ", numberInSurah: 2, juz: 30, page: 604 },
      { number: 6228, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", numberInSurah: 3, juz: 30, page: 604 },
      { number: 6229, text: "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلْعُقَدِ", numberInSurah: 4, juz: 30, page: 604 },
      { number: 6230, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", numberInSurah: 5, juz: 30, page: 604 }
    ]
  },
  114: {
    number: 114,
    name: "سُورَةُ النَّاسِ",
    englishName: "An-Naas",
    englishNameTranslation: "Mankind",
    revelationType: "Meccan",
    ayahs: [
      { number: 6231, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", numberInSurah: 1, juz: 30, page: 604 },
      { number: 6232, text: "مَلِكِ ٱلنَّاسِ", numberInSurah: 2, juz: 30, page: 604 },
      { number: 6233, text: "إِلَٰهِ ٱلنَّاسِ", numberInSurah: 3, juz: 30, page: 604 },
      { number: 6234, text: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", numberInSurah: 4, juz: 30, page: 604 },
      { number: 6235, text: "ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ", numberInSurah: 5, juz: 30, page: 604 },
      { number: 6236, text: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", numberInSurah: 6, juz: 30, page: 604 }
    ]
  }
};

export async function loadAllQuranData(): Promise<QuranSurahData[]> {
  if (quranCache) {
    return quranCache;
  }
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      // First try localStorage cache if available for offline instant load
      const stored = localStorage.getItem('offline_quran_bundle');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length === 114) {
            quranCache = parsed;
            return parsed;
          }
        } catch {
          // ignore corrupted localstorage
        }
      }

      // Fetch from local bundle file
      const response = await fetch('/data/quran-complete.json');
      if (!response.ok) {
        throw new Error(`Failed to load quran data: ${response.status}`);
      }
      const data: QuranSurahData[] = await response.json();
      quranCache = data;

      // Try caching in localStorage or IndexedDB in background
      try {
        // Compress lightly or store if fits
        if (typeof window !== 'undefined' && 'caches' in window) {
          caches.open('quran-offline-v1').then(cache => {
            cache.put('/data/quran-complete.json', new Response(JSON.stringify(data)));
          });
        }
      } catch {
        // storage quota might be hit, safe to ignore
      }

      return data;
    } catch (err) {
      console.warn('Fallback reading used:', err);
      // Return fallback array with metadata
      const fallbackList: QuranSurahData[] = SURAH_LIST.map(meta => {
        if (FALLBACK_SURAHS[meta.number]) {
          return FALLBACK_SURAHS[meta.number];
        }
        return {
          number: meta.number,
          name: `سورة ${meta.name}`,
          englishName: meta.englishName,
          englishNameTranslation: meta.englishNameTranslation,
          revelationType: meta.revelationType,
          ayahs: Array.from({ length: meta.numberOfAyahs }).map((_, i) => ({
            number: i + 1,
            numberInSurah: i + 1,
            text: `آية كريمة رقم ${i + 1}`,
            juz: meta.juz,
            page: 1
          }))
        };
      });
      quranCache = fallbackList;
      return fallbackList;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export async function getSurahByNumber(surahNumber: number): Promise<QuranSurahData> {
  const all = await loadAllQuranData();
  const found = all.find(s => s.number === surahNumber);
  if (found) return found;
  return FALLBACK_SURAHS[surahNumber] || FALLBACK_SURAHS[1];
}

// Strip diacritics for flexible search
export function removeTashkeel(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

// Convert numbers to Arabic numerals
export function toArabicDigits(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, w => arabicDigits[+w]);
}
