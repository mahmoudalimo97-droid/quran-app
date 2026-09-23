import React, { useState } from 'react';
import { NAMES_OF_ALLAH } from '../data/namesOfAllah';
import { NameOfAllah } from '../types/quran';
import { removeTashkeel, toArabicDigits } from '../utils/quranService';
import {
  Search,
  Sparkles,
  Heart,
  Shield,
  BookOpen,
  Volume2,
  CheckCircle,
  RotateCcw,
  Star,
  Flame,
  Info
} from 'lucide-react';

export const NamesOfAllahView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeName, setActiveName] = useState<NameOfAllah | null>(null);

  // Dhikr counter for active name modal
  const [dhikrCount, setDhikrCount] = useState<number>(0);

  const categories = [
    { id: 'all', label: 'جميع الأسماء (٩٩)' },
    { id: 'mercy', label: 'الرحمة واللطف' },
    { id: 'majesty', label: 'العظمة والجلال' },
    { id: 'knowledge', label: 'العلم والإحاطة' },
    { id: 'creation', label: 'الخلق والإبداع' },
    { id: 'forgiveness', label: 'المغفرة والعفو' },
  ];

  const filteredNames = NAMES_OF_ALLAH.filter((item) => {
    // category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = removeTashkeel(searchQuery.trim());
    const nameClean = removeTashkeel(item.name);
    const meaningClean = removeTashkeel(item.meaning);
    const expClean = removeTashkeel(item.explanation);

    return (
      nameClean.includes(q) ||
      meaningClean.includes(q) ||
      expClean.includes(q) ||
      item.transliteration.toLowerCase().includes(q.toLowerCase()) ||
      String(item.id) === q
    );
  });

  const handleOpenDetail = (item: NameOfAllah) => {
    setActiveName(item);
    setDhikrCount(0);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto pb-36 text-slate-100">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>«إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلَّا وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ»</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300 font-['Amiri',serif] mb-3">
          أسماء الله الحسنى ومعانيها
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          تعرف على المعاني الجليلة لأسماء الله الحسنى، واستشعر آثارها الإيمانية في حياتك وتدبر ورودها في القرآن الكريم مع ورد الذكر والتأمل.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0b161f]/90 border border-emerald-500/20 rounded-3xl p-4 sm:p-6 mb-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث باسم، معنى، أو رقم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-[#060c12] border border-emerald-500/30 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950 border border-emerald-400/40'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Names Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
        {filteredNames.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenDetail(item)}
            className="group relative bg-gradient-to-b from-[#0e1a24] to-[#081017] hover:from-[#132332] hover:to-[#0c1822] border border-emerald-500/20 hover:border-amber-400/60 rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-emerald-950/60 cursor-pointer overflow-hidden"
          >
            {/* Islamic geometric top accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* ID Badge */}
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {toArabicDigits(item.id)}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                {item.transliteration}
              </span>
            </div>

            {/* Arabic Name with Harakat */}
            <div className="my-3 sm:my-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-['Amiri',serif] tracking-wide group-hover:text-amber-200 transition-colors drop-shadow-sm">
                {item.name}
              </h3>
            </div>

            {/* Short meaning snippet */}
            <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed h-9">
              {item.meaning}
            </p>

            {/* Bottom action indicator */}
            <div className="mt-3 pt-2 border-t border-slate-800/80 w-full flex items-center justify-center gap-1 text-[11px] text-emerald-400 font-medium group-hover:text-amber-300 transition-colors">
              <Info className="w-3.5 h-3.5" />
              <span>الشرح والتدبر</span>
            </div>
          </div>
        ))}
      </div>

      {filteredNames.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          <p className="text-base">لم يتم العثور على اسم يطابق بحثك</p>
        </div>
      )}

      {/* Name Detail Modal */}
      {activeName && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1721] border border-amber-500/40 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 relative p-6 sm:p-8">
            {/* Close button */}
            <button
              onClick={() => setActiveName(null)}
              className="absolute top-5 left-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* Top header */}
            <div className="text-center pt-2 pb-6 border-b border-slate-800">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
                الاسم رقم {toArabicDigits(activeName.id)} • {activeName.transliteration}
              </div>

              {/* Huge Calligraphy */}
              <h2 className="text-4xl sm:text-5xl font-extrabold text-amber-300 font-['Amiri',serif] tracking-wider my-3 drop-shadow-md">
                {activeName.name}
              </h2>
            </div>

            {/* Content Sections */}
            <div className="space-y-5 my-6 text-sm">
              {/* Meaning */}
              <div className="bg-[#0e1d2a] p-4 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1.5 text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>المعنى والبيان:</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {activeName.meaning}
                </p>
              </div>

              {/* Contemplation */}
              <div className="bg-[#0e1d2a] p-4 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1.5 text-xs sm:text-sm">
                  <Heart className="w-4 h-4" />
                  <span>التدبر والأثر الإيماني:</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {activeName.explanation}
                </p>
              </div>

              {/* Quranic Citation */}
              <div className="bg-[#0e1d2a] p-4 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1.5 text-xs sm:text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>من الآيات الكريمة في القرآن:</span>
                </div>
                <p className="text-amber-200/95 font-['Amiri_Quran',serif] text-base sm:text-lg leading-relaxed text-center py-1">
                  ﴿ {activeName.quranicEvidence} ﴾
                </p>
              </div>

              {/* Interactive Dhikr Counter */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 p-4 rounded-2xl border border-emerald-500/30 text-center">
                <div className="text-xs text-emerald-300 font-semibold mb-2">
                  ورد الاستحضار والذكر بالاسم الشريف:
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setDhikrCount((prev) => prev + 1)}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all text-sm flex items-center gap-2"
                  >
                    <span>يا {activeName.name}</span>
                    <span className="w-6 h-6 rounded-full bg-emerald-900/80 text-amber-300 text-xs flex items-center justify-center font-mono">
                      {dhikrCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setDhikrCount(0)}
                    title="تصفير العداد"
                    className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer close */}
            <div className="text-center pt-2">
              <button
                onClick={() => setActiveName(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
