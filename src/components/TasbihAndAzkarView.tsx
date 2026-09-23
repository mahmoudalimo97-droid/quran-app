import React, { useState, useEffect } from 'react';
import { ADHKAR, TASBIH_PRESETS, ThikrItem } from '../data/adhkar';
import { toArabicDigits } from '../utils/quranService';
import {
  Sparkles,
  RotateCcw,
  Check,
  Sun,
  Moon,
  Heart,
  Award,
  Volume2
} from 'lucide-react';

interface TasbihAndAzkarViewProps {
  initialCategory?: 'tasbih' | 'morning' | 'evening' | 'after_prayer';
}

export const TasbihAndAzkarView: React.FC<TasbihAndAzkarViewProps> = ({ initialCategory = 'morning' }) => {
  const [activeTab, setActiveTab] = useState<'tasbih' | 'morning' | 'evening' | 'after_prayer'>(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setActiveTab(initialCategory);
    }
  }, [initialCategory]);

  // Tasbih state
  const [tasbihPresetIndex, setTasbihPresetIndex] = useState<number>(0);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [totalSessionCount, setTotalSessionCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tasbih_total');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Track progress on individual Azkar cards
  const [azkarCounters, setAzkarCounters] = useState<Record<string, number>>({});

  const currentPreset = TASBIH_PRESETS[tasbihPresetIndex];

  const handleTasbihClick = () => {
    const nextCount = currentCount + 1;
    setCurrentCount(nextCount);
    const newTotal = totalSessionCount + 1;
    setTotalSessionCount(newTotal);

    try {
      localStorage.setItem('tasbih_total', String(newTotal));
    } catch (e) {
      console.error(e);
    }

    // Try subtle haptic vibration on mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };

  const handleResetTasbih = () => {
    setCurrentCount(0);
  };

  const handleIncrementThikr = (id: string, maxCount: number) => {
    setAzkarCounters((prev) => {
      const cur = prev[id] || 0;
      if (cur < maxCount) {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(20);
        }
        return { ...prev, [id]: cur + 1 };
      }
      return prev;
    });
  };

  const currentAzkarList = ADHKAR.filter((a) => {
    if (activeTab === 'tasbih') return false;
    return a.category === activeTab;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-5xl mx-auto pb-36 text-slate-100">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>«مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لَا يَذْكُرُ رَبَّهُ مَثَلُ الحَيِّ وَالمَيِّتِ»</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300 font-['Amiri',serif]">
          السبحة الإلكترونية والأذكار اليومية
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
        <button
          onClick={() => setActiveTab('tasbih')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'tasbih'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-[#0b1620] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          المسبحة التفاعلية
        </button>
        <button
          onClick={() => setActiveTab('morning')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'morning'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-[#0b1620] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-300" />
          <span>أذكار الصباح</span>
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'evening'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-[#0b1620] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Moon className="w-4 h-4 text-blue-300" />
          <span>أذكار المساء</span>
        </button>
        <button
          onClick={() => setActiveTab('after_prayer')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'after_prayer'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-[#0b1620] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          أذكار الصلاة
        </button>
      </div>

      {/* View: Electronic Tasbih */}
      {activeTab === 'tasbih' ? (
        <div className="max-w-md mx-auto">
          {/* Preset Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {TASBIH_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTasbihPresetIndex(idx);
                  setCurrentCount(0);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  tasbihPresetIndex === idx
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Interactive Tasbih Device Card */}
          <div className="bg-gradient-to-b from-[#0b1924] to-[#060e15] border border-emerald-500/30 rounded-[44px] p-8 shadow-2xl relative text-center flex flex-col items-center">
            {/* Top stats */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3 mb-6">
              <span className="flex items-center gap-1">
                <span>الهدف:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {toArabicDigits(currentPreset.target)}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span>المجموع اليومي:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {toArabicDigits(totalSessionCount)}
                </span>
              </span>
            </div>

            {/* Current Dhikr text */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-amber-300 font-['Amiri',serif] min-h-[50px] flex items-center justify-center">
              {currentPreset.label}
            </h3>

            {/* Digital LED Screen Counter */}
            <div className="my-6 px-8 py-4 rounded-3xl bg-slate-950/90 border-2 border-emerald-500/30 shadow-inner w-60">
              <div className="font-mono text-5xl font-extrabold text-emerald-400 tracking-wider">
                {String(currentCount).padStart(3, '0')}
              </div>
            </div>

            {/* Giant Press Button */}
            <button
              onClick={handleTasbihClick}
              className="w-40 h-40 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 hover:from-emerald-600 hover:to-teal-400 text-white font-black text-2xl shadow-2xl shadow-emerald-950 ring-8 ring-emerald-500/20 active:scale-90 transition-all flex flex-col items-center justify-center cursor-pointer select-none group"
            >
              <span className="text-lg text-emerald-200 group-hover:scale-110 transition-transform">
                اضغط
              </span>
              <span className="text-xs text-amber-300/90 font-mono mt-0.5">
                {toArabicDigits(currentCount)}
              </span>
            </button>

            {/* Controls bottom */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleResetTasbih}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط العداد</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* View: Daily Azkar Cards */
        <div className="space-y-4">
          {currentAzkarList.map((thikr) => {
            const count = azkarCounters[thikr.id] || 0;
            const isCompleted = count >= thikr.count;

            return (
              <div
                key={thikr.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md'
                    : 'bg-[#0a151f] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-800/80 pb-2.5">
                  <h4 className="font-bold text-amber-300 text-sm sm:text-base font-['Amiri',serif]">
                    {thikr.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      التكرار المطلوب: {toArabicDigits(thikr.count)}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                        <Check className="w-3 h-3" />
                        <span>تم الإنجاز</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-['Amiri',serif] text-base sm:text-lg leading-[2.2] text-slate-100 text-justify mb-4">
                  {thikr.text}
                </p>

                {thikr.virtue && (
                  <div className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 mb-4">
                    <span className="text-amber-400 font-semibold ml-1">الفضل:</span>
                    {thikr.virtue}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleIncrementThikr(thikr.id, thikr.count)}
                    disabled={isCompleted}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg active:scale-95'
                    }`}
                  >
                    <span>قرأت الذكر</span>
                    <span className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center font-mono text-amber-300 text-xs">
                      {count}
                    </span>
                  </button>

                  <span className="text-xs text-slate-400 font-mono">
                    {toArabicDigits(count)} / {toArabicDigits(thikr.count)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
