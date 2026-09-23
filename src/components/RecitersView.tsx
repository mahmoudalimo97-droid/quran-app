import React, { useState } from 'react';
import { RECITERS } from '../data/reciters';
import { SURAH_LIST } from '../data/surahList';
import { useAudio } from '../context/AudioContext';
import { Reciter } from '../types/quran';
import {
  Play,
  Pause,
  Download,
  CheckCircle,
  Radio,
  BookOpen,
  Volume2,
  Award,
  Sparkles,
  Search,
  Disc3,
  ExternalLink
} from 'lucide-react';
import { toArabicDigits, removeTashkeel } from '../utils/quranService';

interface RecitersViewProps {
  onSelectSurahInReader?: (surahNumber: number) => void;
}

export const RecitersView: React.FC<RecitersViewProps> = ({ onSelectSurahInReader }) => {
  const {
    currentReciter,
    setReciterById,
    playSurah,
    isPlaying,
    currentSurahNumber,
    cacheCurrentSurahOffline
  } = useAudio();

  const [selectedSheikh, setSelectedSheikh] = useState<'hussary' | 'minshawi'>('hussary');
  const [selectedStyle, setSelectedStyle] = useState<'murattal' | 'mujawwad'>('murattal');
  const [searchSurah, setSearchSurah] = useState<string>('');

  // Determine current active reciter object
  const activeReciterId = `${selectedSheikh}_${selectedStyle}`;
  const reciterObj = RECITERS.find((r) => r.id === activeReciterId) || RECITERS[0];

  const filteredSurahs = SURAH_LIST.filter((s) => {
    if (!searchSurah.trim()) return true;
    const q = removeTashkeel(searchSurah.trim());
    return (
      removeTashkeel(s.name).includes(q) ||
      s.englishName.toLowerCase().includes(q.toLowerCase()) ||
      String(s.number) === q
    );
  });

  const sheikhInfo = {
    hussary: {
      name: 'الشيخ محمود خليل الحصري (رحمه الله)',
      dates: '١٩١٧ - ١٩٨٠ م',
      title: 'شيخ عموم المقارئ المصرية وأستاذ التجويد الأول',
      description:
        'أحد أبرز أعلام قراء القرآن الكريم في العالم الإسلامي، وأول من سجل المصحف المرتل برواية حفص عن عاصم، ورواية ورش وقالون والدوري. كان رحمه الله مرجعاً صارماً في الدقة الإتقانية ومخارج الحروف والوقف والابتداء، وصاحب التلاوة التعليمية التي ربّت أجيال القراء.',
      achievements: [
        'أول من سجل المصحف المرتل في تاريخ الإذاعة الإسلامية (عام ١٩٦١)',
        'رئيس اتحاد قراء العالم ورئيس لجنة تصحيح المصاحف بالأزهر الشريف',
        'تلا القرآن في مقر الأمم المتحدة والكونغرس الأمريكي وقصر الإليزيه'
      ]
    },
    minshawi: {
      name: 'الشيخ محمد صديق المنشاوي (رحمه الله)',
      dates: '١٩٢٠ - ١٩٦٩ م',
      title: 'الصوت الباكي الخاشع وريحانة القراء',
      description:
        'علم من أعلام التلاوة التاريخيين ذو نبرة شجية فريدة مسكونة بالحزن الإيماني والخشوع المهيب، حتى لُقّب بـ "الصوت الباكي". نشأ في بيت قرآني عريق بمدينة المنشأة بسوهاج، وسجل المصحف المرتل كاملاً للإذاعة المصرية فصار نغم تلاوته سلوى لكل قلب مؤمن.',
      achievements: [
        'تسجيل المصحف المرتل كاملاً برواية حفص عن عاصم للإذاعة المصرية',
        'مئات التلاوات والمحافل الخارجية في المسجد الأقصى والمسجد النبوي وسوريا والعراق',
        'تلاوة متفردة تمزج عمق الأحكام التجويدية بالنبرة الوجدانية المؤثرة'
      ]
    }
  }[selectedSheikh];

  const handlePlaySurahItem = (surahNum: number) => {
    if (currentReciter.id !== reciterObj.id) {
      setReciterById(reciterObj.id);
    }
    playSurah(surahNum, 1);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto pb-36 text-slate-100">
      {/* Top Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>تلاوات الشيخ الحصري والشيخ المنشاوي بدون نت</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300 font-['Amiri',serif] mb-3">
          أعلام التلاوة الخالدة
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          استمع إلى القرآن الكريم كاملاً (١١٤ سورة) بصوت عملاقي التلاوة في العالم الإسلامي بالروايتين المرتلة والمجودة مع إمكانية التنزيل والتشغيل دون اتصال.
        </p>
      </div>

      {/* Sheikh Switcher Tabs */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => {
            setSelectedSheikh('hussary');
            setReciterById(`hussary_${selectedStyle}`);
          }}
          className={`px-6 sm:px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center gap-3 cursor-pointer ${
            selectedSheikh === 'hussary'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-950/60 border border-emerald-400/50 scale-105'
              : 'bg-[#0d1822] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Award className="w-5 h-5 text-amber-400" />
          <span>الشيخ محمود خليل الحصري</span>
        </button>

        <button
          onClick={() => {
            setSelectedSheikh('minshawi');
            setReciterById(`minshawi_${selectedStyle}`);
          }}
          className={`px-6 sm:px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center gap-3 cursor-pointer ${
            selectedSheikh === 'minshawi'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-950/60 border border-emerald-400/50 scale-105'
              : 'bg-[#0d1822] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Award className="w-5 h-5 text-amber-400" />
          <span>الشيخ محمد صديق المنشاوي</span>
        </button>
      </div>

      {/* Reciter Bio Card */}
      <div className="bg-[#0b1620] border border-emerald-500/25 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <img
              src={reciterObj.avatar}
              alt={sheikhInfo.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-2xl"
            />
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-amber-500 text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow">
              {sheikhInfo.dates}
            </div>
          </div>

          <div className="flex-1 text-center md:text-right">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Amiri',serif]">
                {sheikhInfo.name}
              </h2>
              <span className="text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                {sheikhInfo.title}
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-2">
              {sheikhInfo.description}
            </p>

            {/* Style Selector (Murattal vs Mujawwad) */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="text-xs text-amber-300 font-bold">نوع التلاوة:</span>
              <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setSelectedStyle('murattal');
                    setReciterById(`${selectedSheikh}_murattal`);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedStyle === 'murattal'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  المصحف المرتل
                </button>
                <button
                  onClick={() => {
                    setSelectedStyle('mujawwad');
                    setReciterById(`${selectedSheikh}_mujawwad`);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedStyle === 'mujawwad'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  المصحف المجوّد
                </button>
              </div>

              {currentReciter.id === reciterObj.id && isPlaying && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>يعمل الآن في المشغّل</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Surah in Playlist */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>سور القرآن الكريم كاملة ({toArabicDigits(114)} سورة)</span>
        </h3>

        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث عن سورة..."
            value={searchSurah}
            onChange={(e) => setSearchSurah(e.target.value)}
            className="w-full pr-9 pl-3 py-2 bg-[#09141d] border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Surahs Playlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredSurahs.map((surah) => {
          const isSurahPlaying =
            isPlaying &&
            currentReciter.id === reciterObj.id &&
            currentSurahNumber === surah.number;

          const sStr = String(surah.number).padStart(3, '0');
          const directMp3 = `${reciterObj.serverUrl}/${sStr}.mp3`;

          return (
            <div
              key={surah.number}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                isSurahPlaying
                  ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-400/40'
                  : 'bg-[#0a151e] border-slate-800/80 hover:border-slate-700 hover:bg-[#0e1d2b] text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handlePlaySurahItem(surah.number)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isSurahPlaying
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-900 group-hover:bg-emerald-600 text-slate-300 group-hover:text-white'
                  }`}
                  title={isSurahPlaying ? 'سورة قيد التشغيل' : 'تشغيل السورة'}
                >
                  {isSurahPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current translate-x-[-1px]" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-amber-400/90 bg-slate-900 px-1.5 py-0.5 rounded">
                      {toArabicDigits(surah.number)}
                    </span>
                    <h4 className="font-bold text-sm text-white font-['Amiri',serif] truncate">
                      سورة {surah.name}
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {toArabicDigits(surah.numberOfAyahs)} آية • {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                {/* Jump to Reader */}
                {onSelectSurahInReader && (
                  <button
                    onClick={() => onSelectSurahInReader(surah.number)}
                    title="فتح في المصحف للقراءة"
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Direct MP3 Download link for offline listening */}
                <a
                  href={directMp3}
                  download={`Surah-${sStr}-${surah.englishName}.mp3`}
                  target="_blank"
                  rel="noreferrer"
                  title="تحميل ملف السورة MP3 بدون نت"
                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
