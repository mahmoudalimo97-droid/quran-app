import React, { useState, useEffect, useRef } from 'react';
import { SURAH_LIST } from '../data/surahList';
import { getSurahByNumber, QuranSurahData, toArabicDigits, removeTashkeel } from '../utils/quranService';
import { useAudio } from '../context/AudioContext';
import { Bookmark, SurahMeta } from '../types/quran';
import {
  BookOpen,
  Search,
  Bookmark as BookmarkIcon,
  BookmarkCheck,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Copy,
  Share2,
  Sliders,
  Sparkles,
  BookText,
  List,
  Check,
  Disc3,
  Compass,
  Headphones,
  X
} from 'lucide-react';

interface QuranReaderProps {
  initialSurah?: number;
  onOpenReciters?: () => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({ initialSurah = 1, onOpenReciters }) => {
  const {
    playAyah,
    playSurah,
    isPlaying,
    currentSurahNumber,
    currentAyahNumber,
    currentReciter,
    setReciterById
  } = useAudio();

  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(initialSurah);
  const [surahData, setSurahData] = useState<QuranSurahData | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(true);

  // View preferences
  const [viewMode, setViewMode] = useState<'mushaf' | 'cards'>('cards');
  const [theme, setTheme] = useState<'emerald' | 'navy' | 'sepia' | 'dark'>('emerald');
  const [fontSize, setFontSize] = useState<number>(28); // px
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSurahModalOpen, setIsSurahModalOpen] = useState<boolean>(false);
  const [surahListFilter, setSurahListFilter] = useState<string>('');
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);
  const [activeAyahPopup, setActiveAyahPopup] = useState<{
    numberInSurah: number;
    text: string;
  } | null>(null);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('quran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const ayahRefs = useRef<Record<number, HTMLElement | null>>({});

  // Sync with audio if playing another surah
  useEffect(() => {
    if (isPlaying && currentSurahNumber !== selectedSurahNumber) {
      setSelectedSurahNumber(currentSurahNumber);
    }
  }, [currentSurahNumber, isPlaying]);

  // Load Surah data
  useEffect(() => {
    let isMounted = true;
    setIsLoadingSurah(true);

    getSurahByNumber(selectedSurahNumber).then((data) => {
      if (isMounted) {
        setSurahData(data);
        setIsLoadingSurah(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSurahNumber]);

  // Auto-scroll to active ayah when playing
  useEffect(() => {
    if (isPlaying && currentSurahNumber === selectedSurahNumber) {
      const el = ayahRefs.current[currentAyahNumber];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentAyahNumber, currentSurahNumber, selectedSurahNumber, isPlaying]);

  const currentMeta = SURAH_LIST.find((s) => s.number === selectedSurahNumber) || SURAH_LIST[0];

  const handleNextSurah = () => {
    if (selectedSurahNumber < 114) {
      setSelectedSurahNumber((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevSurah = () => {
    if (selectedSurahNumber > 1) {
      setSelectedSurahNumber((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle bookmark
  const toggleBookmark = (ayahNumber: number) => {
    const isBookmarked = bookmarks.some(
      (b) => b.surahNumber === selectedSurahNumber && b.ayahNumber === ayahNumber
    );

    let updated: Bookmark[];
    if (isBookmarked) {
      updated = bookmarks.filter(
        (b) => !(b.surahNumber === selectedSurahNumber && b.ayahNumber === ayahNumber)
      );
    } else {
      const newBookmark: Bookmark = {
        surahNumber: selectedSurahNumber,
        surahName: currentMeta.name,
        ayahNumber,
        timestamp: Date.now()
      };
      updated = [newBookmark, ...bookmarks];
    }

    setBookmarks(updated);
    try {
      localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Copy Ayah text
  const handleCopyAyah = (text: string, ayahNum: number) => {
    const formatted = `﴿ ${text} ﴾ [سورة ${currentMeta.name}: ${ayahNum}]`;
    navigator.clipboard.writeText(formatted).then(() => {
      setCopiedAyahNumber(ayahNum);
      setTimeout(() => setCopiedAyahNumber(null), 2000);
    });
  };

  // Filtered surahs for modal
  const filteredSurahs = SURAH_LIST.filter((s) => {
    if (!surahListFilter.trim()) return true;
    const q = removeTashkeel(surahListFilter.trim());
    const nameClean = removeTashkeel(s.name);
    return (
      nameClean.includes(q) ||
      s.englishName.toLowerCase().includes(q.toLowerCase()) ||
      String(s.number) === q ||
      String(s.juz) === q
    );
  });

  // Filtered ayahs if in-page search active
  const filteredAyahs = surahData?.ayahs.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = removeTashkeel(searchQuery.trim());
    const textClean = removeTashkeel(a.text);
    return textClean.includes(q) || String(a.numberInSurah) === q;
  });

  // Theme container classes
  const themeClasses = {
    emerald: 'bg-[#081313] text-[#e3f4ea] border-emerald-900/40',
    navy: 'bg-[#080e18] text-[#e0edfa] border-blue-900/40',
    sepia: 'bg-[#1a1612] text-[#f7edd9] border-amber-900/40',
    dark: 'bg-[#050505] text-[#ececec] border-neutral-800'
  }[theme];

  const themePaperClasses = {
    emerald: 'bg-[#0c1c1c]/90 border-emerald-800/30 shadow-emerald-950/50',
    navy: 'bg-[#0d1624]/90 border-blue-800/30 shadow-blue-950/50',
    sepia: 'bg-[#221c17]/90 border-amber-800/40 shadow-amber-950/50',
    dark: 'bg-[#0f0f0f]/90 border-neutral-800 shadow-black'
  }[theme];

  return (
    <div className={`min-h-screen py-6 px-3 sm:px-6 transition-colors duration-300 pb-36 ${themeClasses}`}>
      <div className="max-w-4xl mx-auto">
        {/* Top Control Bar */}
        <div className="sticky top-20 z-40 mb-6 bg-[#0a151b]/95 backdrop-blur-md border border-emerald-500/25 rounded-2xl p-3 sm:p-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Surah Switcher Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSurahModalOpen(true)}
                className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-emerald-800/50 to-emerald-900/30 hover:from-emerald-700/60 hover:to-emerald-800/40 border border-emerald-500/40 rounded-xl text-white font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>سورة {currentMeta.name}</span>
                <span className="text-xs text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {currentMeta.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </span>
              </button>

              <button
                onClick={() => playSurah(selectedSurahNumber)}
                title="استماع للسورة كاملة بصوت القارئ الحالي"
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">تشغيل السورة</span>
              </button>

              {/* Reciter Toggle: Hussary vs Minshawi */}
              <div className="flex items-center gap-1 bg-[#071118] p-1 rounded-xl border border-emerald-500/30">
                <button
                  onClick={() => setReciterById('hussary_murattal')}
                  title="الشيخ محمود خليل الحصري"
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentReciter.id.startsWith('hussary')
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الحصري
                </button>
                <button
                  onClick={() => setReciterById('minshawi_murattal')}
                  title="الشيخ محمد صديق المنشاوي"
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentReciter.id.startsWith('minshawi')
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  المنشاوي
                </button>
              </div>
            </div>

            {/* Reciter badge & navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSurah}
                disabled={selectedSurahNumber <= 1}
                className="p-2 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800/60 rounded-lg transition-colors"
                title="السورة السابقة"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <span className="text-xs text-slate-400 font-mono">
                {toArabicDigits(selectedSurahNumber)} / ١١٤
              </span>

              <button
                onClick={handleNextSurah}
                disabled={selectedSurahNumber >= 114}
                className="p-2 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800/60 rounded-lg transition-colors"
                title="السورة التالية"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Second toolbar row: View mode, font size, theme */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('mushaf')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === 'mushaf'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookText className="w-3.5 h-3.5" />
                <span>مصحف متصل</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === 'cards'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>آية بآية</span>
              </button>
            </div>

            {/* Font size adjustment */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800 text-slate-300">
              <span className="text-[11px] text-slate-400">حجم الخط:</span>
              <button
                onClick={() => setFontSize((s) => Math.max(20, s - 2))}
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-800 text-slate-200 font-bold"
                title="تصغير الخط"
              >
                -
              </button>
              <span className="font-mono text-xs w-6 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize((s) => Math.min(48, s + 2))}
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-800 text-slate-200 font-bold"
                title="تكبير الخط"
              >
                +
              </button>
            </div>

            {/* Reading Theme selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 hidden sm:inline">المظهر:</span>
              <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setTheme('emerald')}
                  title="زمردي إسلامي"
                  className={`w-6 h-6 rounded-lg bg-[#081313] border-2 transition-all ${
                    theme === 'emerald' ? 'border-emerald-400 scale-110' : 'border-slate-700'
                  }`}
                />
                <button
                  onClick={() => setTheme('navy')}
                  title="كحلي هادئ"
                  className={`w-6 h-6 rounded-lg bg-[#080e18] border-2 transition-all ${
                    theme === 'navy' ? 'border-blue-400 scale-110' : 'border-slate-700'
                  }`}
                />
                <button
                  onClick={() => setTheme('sepia')}
                  title="ورق المصحف الدافئ"
                  className={`w-6 h-6 rounded-lg bg-[#221c17] border-2 transition-all ${
                    theme === 'sepia' ? 'border-amber-400 scale-110' : 'border-slate-700'
                  }`}
                />
                <button
                  onClick={() => setTheme('dark')}
                  title="أسود داكن"
                  className={`w-6 h-6 rounded-lg bg-[#050505] border-2 transition-all ${
                    theme === 'dark' ? 'border-neutral-400 scale-110' : 'border-slate-700'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoadingSurah && (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-emerald-400">
            <Disc3 className="w-10 h-10 animate-spin" />
            <p className="text-sm font-medium">جاري فتح صفحات المصحف الشريف...</p>
          </div>
        )}

        {/* Main Surah Content */}
        {!isLoadingSurah && surahData && (
          <div className={`p-6 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${themePaperClasses}`}>
            {/* Traditional Ornate Islamic Header Frame */}
            <div className="relative mb-8 text-center">
              <div className="inline-block relative px-8 sm:px-14 py-4 rounded-2xl bg-gradient-to-b from-amber-500/10 via-emerald-950/40 to-transparent border border-amber-500/40 shadow-inner">
                {/* Islamic corner ornaments */}
                <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400/80 rounded-tr" />
                <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400/80 rounded-tl" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400/80 rounded-br" />
                <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400/80 rounded-bl" />

                <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-['Amiri',serif] tracking-wider">
                  سُورَةُ {currentMeta.name}
                </h2>
                <div className="flex items-center justify-center gap-3 mt-1 text-xs text-emerald-300/90 font-medium">
                  <span>{currentMeta.revelationType === 'Meccan' ? 'مَكِّيَّة' : 'مَدَنِيَّة'}</span>
                  <span>•</span>
                  <span>آيَاتُهَا {toArabicDigits(currentMeta.numberOfAyahs)}</span>
                  <span>•</span>
                  <span>الجُزْءُ {toArabicDigits(currentMeta.juz)}</span>
                </div>
              </div>

              {/* Basmala (shown for all surahs except At-Tawbah #9) */}
              {selectedSurahNumber !== 9 && selectedSurahNumber !== 1 && (
                <div className="mt-8 mb-6 text-center">
                  <span className="font-['Amiri_Quran',serif] text-2xl sm:text-3xl text-amber-200/90 tracking-wide select-none drop-shadow">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </span>
                </div>
              )}
            </div>

            {/* View Mode 1: Mushaf Continuous Reading */}
            {viewMode === 'mushaf' ? (
              <div
                className="text-justify leading-[2.6] sm:leading-[2.8] font-['Amiri_Quran',serif] text-slate-100 select-text"
                style={{ fontSize: `${fontSize}px` }}
              >
                {filteredAyahs?.map((ayah) => {
                  const isCurrent =
                    isPlaying &&
                    currentSurahNumber === selectedSurahNumber &&
                    currentAyahNumber === ayah.numberInSurah;

                  const isBookmarked = bookmarks.some(
                    (b) =>
                      b.surahNumber === selectedSurahNumber &&
                      b.ayahNumber === ayah.numberInSurah
                  );

                  // If Ayah 1 of Al-Fatiha, text already includes Basmala
                  return (
                    <span
                      key={ayah.numberInSurah}
                      ref={(el) => {
                        ayahRefs.current[ayah.numberInSurah] = el;
                      }}
                      onClick={() =>
                        setActiveAyahPopup({ numberInSurah: ayah.numberInSurah, text: ayah.text })
                      }
                      className={`inline cursor-pointer transition-colors duration-200 rounded px-1 group ${
                        isCurrent
                          ? 'bg-amber-400/25 text-amber-200 ring-2 ring-amber-400/50 font-bold'
                          : activeAyahPopup?.numberInSurah === ayah.numberInSurah
                          ? 'bg-emerald-500/30 text-white ring-1 ring-emerald-400'
                          : 'hover:bg-emerald-500/15'
                      }`}
                    >
                      <span className="text-inherit">{ayah.text}</span>
                      {/* Decorative Ayah Number Bracket ﴿١﴾ */}
                      <span
                        className={`inline-flex items-center justify-center mx-1.5 font-['Scheherazade_New',serif] text-[0.8em] font-normal transition-transform group-hover:scale-110 ${
                          isCurrent
                            ? 'text-amber-400 font-bold'
                            : isBookmarked
                            ? 'text-emerald-400 font-bold'
                            : 'text-amber-400/80'
                        }`}
                        title={`الآية ${ayah.numberInSurah} - اضغط للاستماع بصوت الحصري أو المنشاوي`}
                      >
                        <span className="text-amber-500/70 font-serif">﴿</span>
                        <span className="mx-0.5">{toArabicDigits(ayah.numberInSurah)}</span>
                        <span className="text-amber-500/70 font-serif">﴾</span>
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : (
              /* View Mode 2: Interactive Ayah-by-Ayah Cards */
              <div className="space-y-4">
                {filteredAyahs?.map((ayah) => {
                  const isCurrent =
                    isPlaying &&
                    currentSurahNumber === selectedSurahNumber &&
                    currentAyahNumber === ayah.numberInSurah;

                  const isBookmarked = bookmarks.some(
                    (b) =>
                      b.surahNumber === selectedSurahNumber &&
                      b.ayahNumber === ayah.numberInSurah
                  );

                  return (
                    <div
                      key={ayah.numberInSurah}
                      ref={(el) => {
                        ayahRefs.current[ayah.numberInSurah] = el;
                      }}
                      className={`p-4 sm:p-6 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-amber-950/30 border-amber-500/70 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/40'
                          : 'bg-black/30 border-slate-800/80 hover:border-emerald-600/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-800/60 pb-2.5 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-amber-300 font-bold text-xs flex items-center justify-center font-['Scheherazade_New',serif]">
                            {toArabicDigits(ayah.numberInSurah)}
                          </span>
                          <span className="text-xs text-slate-400">
                            سورة {currentMeta.name} : الآية {toArabicDigits(ayah.numberInSurah)}
                          </span>
                        </div>

                        {/* Dual Reciter Buttons on Ayah Card */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Hussary Play Button */}
                          <button
                            onClick={() => {
                              setReciterById('hussary_murattal');
                              playAyah(
                                selectedSurahNumber,
                                ayah.numberInSurah,
                                currentMeta.numberOfAyahs
                              );
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              isCurrent && isPlaying && currentReciter.id.startsWith('hussary')
                                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                                : 'bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200'
                            }`}
                            title="استماع للآية بصوت الشيخ محمود خليل الحصري"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>الحصري</span>
                          </button>

                          {/* Minshawi Play Button */}
                          <button
                            onClick={() => {
                              setReciterById('minshawi_murattal');
                              playAyah(
                                selectedSurahNumber,
                                ayah.numberInSurah,
                                currentMeta.numberOfAyahs
                              );
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              isCurrent && isPlaying && currentReciter.id.startsWith('minshawi')
                                ? 'bg-amber-400 text-black font-extrabold shadow-md'
                                : 'bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-200'
                            }`}
                            title="استماع للآية بصوت الشيخ محمد صديق المنشاوي"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>المنشاوي</span>
                          </button>

                          <button
                            onClick={() => toggleBookmark(ayah.numberInSurah)}
                            className={`p-2 rounded-lg transition-colors ${
                              isBookmarked
                                ? 'text-amber-400 bg-amber-500/10'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                            title="حفظ علامة مرجعية"
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-4 h-4" />
                            ) : (
                              <BookmarkIcon className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleCopyAyah(ayah.text, ayah.numberInSurah)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="نسخ الآية"
                          >
                            {copiedAyahNumber === ayah.numberInSurah ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Ayah text */}
                      <p
                        className="font-['Amiri_Quran',serif] leading-[2.4] text-slate-100 text-justify"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        {ayah.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Next/Prev Surah buttons */}
            <div className="mt-12 pt-6 border-t border-slate-800/80 flex items-center justify-between">
              {selectedSurahNumber > 1 ? (
                <button
                  onClick={handlePrevSurah}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                  <span>السورة السابقة: {SURAH_LIST[selectedSurahNumber - 2]?.name}</span>
                </button>
              ) : <div />}

              {selectedSurahNumber < 114 && (
                <button
                  onClick={handleNextSurah}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all"
                >
                  <span>السورة التالية: {SURAH_LIST[selectedSurahNumber]?.name}</span>
                  <ChevronLeft className="w-4 h-4 text-amber-400" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Surah Selection Modal / Index */}
      {isSurahModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b161c] border border-emerald-500/40 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#070e13] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base sm:text-lg">فهرس سور القرآن الكريم (١١٤ سورة)</h3>
              </div>
              <button
                onClick={() => setIsSurahModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                إغلاق ✕
              </button>
            </div>

            {/* Filter Search */}
            <div className="p-4 border-b border-slate-800 bg-[#091319]">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث باسم السورة، رقمها، أو الجزء..."
                  value={surahListFilter}
                  onChange={(e) => setSurahListFilter(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-slate-950/80 border border-emerald-500/25 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Surah List Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredSurahs.map((meta) => {
                const isSelected = selectedSurahNumber === meta.number;
                return (
                  <div
                    key={meta.number}
                    onClick={() => {
                      setSelectedSurahNumber(meta.number);
                      setIsSurahModalOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-white font-bold shadow-md'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-950/90 border border-emerald-500/30 text-amber-300 font-bold text-xs flex items-center justify-center font-mono">
                        {meta.number}
                      </span>
                      <div>
                        <div className="font-bold text-sm font-['Amiri',serif]">{meta.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {meta.englishName} • {meta.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                        </div>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-xs text-emerald-400/90 font-mono">
                        {toArabicDigits(meta.numberOfAyahs)} آية
                      </span>
                      <div className="text-[10px] text-slate-500">جزء {toArabicDigits(meta.juz)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Ayah Reciter Audio Popup (عند الضغط على الآية السماع بصوتين: الحصري والمنشاوي) */}
      {activeAyahPopup && (
        <div className="fixed inset-x-0 bottom-24 z-50 p-4 max-w-lg mx-auto animate-in slide-in-from-bottom duration-300">
          <div className="bg-[#09151e]/95 backdrop-blur-md border-2 border-amber-400/70 rounded-3xl p-5 shadow-2xl text-white">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center font-['Scheherazade_New',serif]">
                  {toArabicDigits(activeAyahPopup.numberInSurah)}
                </span>
                <span className="text-sm font-bold text-amber-300 font-['Amiri',serif]">
                  الآية {toArabicDigits(activeAyahPopup.numberInSurah)} من سورة {currentMeta.name}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleBookmark(activeAyahPopup.numberInSurah)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                  title="حفظ علامة مرجعية"
                >
                  <BookmarkIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopyAyah(activeAyahPopup.text, activeAyahPopup.numberInSurah)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="نسخ الآية"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveAyahPopup(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ayah Snippet preview */}
            <p className="font-['Amiri_Quran',serif] text-sm sm:text-base text-slate-200 line-clamp-2 mb-4 leading-relaxed text-center">
              ﴿ {activeAyahPopup.text} ﴾
            </p>

            <div className="text-[11px] text-slate-400 mb-2 font-medium text-center">
              اختر صوت القارئ للاستماع الفوري للآية:
            </div>

            {/* Dual Reciter Big Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Hussary Button */}
              <button
                onClick={() => {
                  setReciterById('hussary_murattal');
                  playAyah(
                    selectedSurahNumber,
                    activeAyahPopup.numberInSurah,
                    currentMeta.numberOfAyahs
                  );
                }}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  isPlaying &&
                  currentAyahNumber === activeAyahPopup.numberInSurah &&
                  currentReciter.id.startsWith('hussary')
                    ? 'bg-emerald-600 border-emerald-300 text-white shadow-lg ring-2 ring-emerald-400'
                    : 'bg-emerald-950/70 hover:bg-emerald-900 border-emerald-500/40 text-emerald-100 hover:border-emerald-400'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center mb-1">
                  <Play className="w-4 h-4 fill-current text-white" />
                </div>
                <div className="text-xs sm:text-sm font-bold font-['Amiri',serif]">
                  الشيخ الحصري
                </div>
                <div className="text-[10px] opacity-80 mt-0.5">المصحف المرتل</div>
              </button>

              {/* Minshawi Button */}
              <button
                onClick={() => {
                  setReciterById('minshawi_murattal');
                  playAyah(
                    selectedSurahNumber,
                    activeAyahPopup.numberInSurah,
                    currentMeta.numberOfAyahs
                  );
                }}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  isPlaying &&
                  currentAyahNumber === activeAyahPopup.numberInSurah &&
                  currentReciter.id.startsWith('minshawi')
                    ? 'bg-amber-500 border-amber-300 text-black shadow-lg ring-2 ring-amber-400 font-bold'
                    : 'bg-amber-950/70 hover:bg-amber-900 border-amber-500/40 text-amber-100 hover:border-amber-400'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center mb-1">
                  <Play className="w-4 h-4 fill-current text-amber-200" />
                </div>
                <div className="text-xs sm:text-sm font-bold font-['Amiri',serif]">
                  الشيخ المنشاوي
                </div>
                <div className="text-[10px] opacity-80 mt-0.5">الصوت الخاشع</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
