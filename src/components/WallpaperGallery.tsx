import React, { useState, useRef, useEffect } from 'react';
import { WALLPAPERS } from '../data/wallpapers';
import { Wallpaper } from '../types/quran';
import {
  Download,
  Eye,
  Sparkles,
  Smartphone,
  Palette,
  Check,
  Share2,
  Clock,
  Layers,
  Heart,
  Sliders,
  Paintbrush
} from 'lucide-react';
import { toArabicDigits } from '../utils/quranService';

export const WallpaperGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState<boolean>(false);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Custom Wallpaper Creator State
  const [customVerse, setCustomVerse] = useState<string>('أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ');
  const [customSource, setCustomSource] = useState<string>('سورة الرعد - الآية ٢٨');
  const [customTheme, setCustomTheme] = useState<'emerald' | 'midnight' | 'gold_black' | 'royal_purple'>('emerald');
  const [customFrame, setCustomFrame] = useState<boolean>(true);
  const [customFontSize, setCustomFontSize] = useState<number>(38);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live time for phone preview
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', label: 'جميع الخلفيات' },
    { id: 'kaaba', label: 'الكعبة ومكة المكرمة' },
    { id: 'madinah', label: 'المسجد النبوي الشريف' },
    { id: 'mosques', label: 'عمارة المساجد والقباب' },
    { id: 'calligraphy', label: 'القرآن والخط العربي' },
    { id: 'nature', label: 'التفكر في الكون' },
    { id: 'art', label: 'فخامة وزخارف إسلامية' },
  ];

  const filteredWallpapers = WALLPAPERS.filter((w) => {
    if (selectedCategory === 'all') return true;
    return w.category === selectedCategory;
  });

  const handleDownload = async (wallpaper: Wallpaper) => {
    try {
      const response = await fetch(wallpaper.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `islamic-wallpaper-${wallpaper.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadSuccessId(wallpaper.id);
      setTimeout(() => setDownloadSuccessId(null), 2500);
    } catch {
      // Fallback: open directly
      window.open(wallpaper.url, '_blank');
    }
  };

  // Render Custom Canvas Wallpaper
  useEffect(() => {
    if (!isCreatorOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions: High-Res Phone Wallpaper 1080 x 1920
    canvas.width = 1080;
    canvas.height = 1920;

    // 1. Draw Background Gradient
    let grad = ctx.createLinearGradient(0, 0, 0, 1920);
    if (customTheme === 'emerald') {
      grad.addColorStop(0, '#041c14');
      grad.addColorStop(0.5, '#0a3528');
      grad.addColorStop(1, '#02130e');
    } else if (customTheme === 'midnight') {
      grad.addColorStop(0, '#05101f');
      grad.addColorStop(0.5, '#0d223f');
      grad.addColorStop(1, '#030811');
    } else if (customTheme === 'gold_black') {
      grad.addColorStop(0, '#14120e');
      grad.addColorStop(0.5, '#262016');
      grad.addColorStop(1, '#0a0805');
    } else {
      grad.addColorStop(0, '#1c0c28');
      grad.addColorStop(0.5, '#35164d');
      grad.addColorStop(1, '#0e0416');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Draw Subtle Arabesque stars in background
    ctx.fillStyle = 'rgba(212, 175, 55, 0.04)';
    for (let x = 60; x < 1080; x += 120) {
      for (let y = 80; y < 1920; y += 120) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Draw Islamic Ornate Border Frame
    if (customFrame) {
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 70, 980, 1780);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(65, 85, 950, 1750);

      // Corner rosettes
      const corners = [
        [50, 70],
        [1030, 70],
        [50, 1850],
        [1030, 1850]
      ];
      corners.forEach(([cx, cy]) => {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 4. Draw Header Calligraphy Icon / Crescent
    ctx.fillStyle = '#e6ca65';
    ctx.font = 'normal 64px "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.fillText('﷽', 540, 360);

    // 5. Draw Custom Ayah Text in Center
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${customFontSize * 2}px "Amiri Quran", "Amiri", serif`;
    ctx.textAlign = 'center';

    // Word wrap
    const words = customVerse.split(' ');
    let line = '';
    const lines: string[] = [];
    const maxWidth = 820;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const startY = 880 - (lines.length * customFontSize);
    lines.forEach((l, idx) => {
      ctx.fillText(l.trim(), 540, startY + (idx * customFontSize * 2.6));
    });

    // 6. Draw Ayah brackets & Source Citation
    ctx.fillStyle = '#d4af37';
    ctx.font = 'normal 36px "Cairo", sans-serif';
    ctx.fillText(`﴿ ${customSource} ﴾`, 540, startY + (lines.length * customFontSize * 2.6) + 70);

    // 7. Footer brand stamp
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'normal 24px "Cairo", sans-serif';
    ctx.fillText('القرآن الكريم وروحانيات', 540, 1800);

  }, [isCreatorOpen, customVerse, customSource, customTheme, customFrame, customFontSize]);

  const handleDownloadCustomCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `islamic-custom-wallpaper-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const versePresets = [
    { text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', source: 'سورة الرعد : ٢٨' },
    { text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا', source: 'سورة الشرح : ٥-٦' },
    { text: 'وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ', source: 'سورة الفرقان : ٥٨' },
    { text: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', source: 'سورة آل عمران : ١٧٣' },
    { text: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ', source: 'سورة القصص : ٢٤' },
    { text: 'لَا تَدْرِي لَعَلَّ اللَّهَ يُحْدِثُ بَعْدَ ذَٰلِكَ أَمْرًا', source: 'سورة الطلاق : ١' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto pb-36 text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-emerald-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>معرض الخلفيات الإسلامية فائقة الدقة</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300 font-['Amiri',serif]">
            خلفيات إسلامية للجوال والكمبيوتر
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            مجموعة مختارة من أروع الصور الروحانية للحرمين الشريفين والمساجد والتفكر الكوني صالحة للتحميل الفوري
          </p>
        </div>

        {/* Create Custom Wallpaper Button */}
        <button
          onClick={() => setIsCreatorOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-amber-950/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Paintbrush className="w-5 h-5 text-slate-950" />
          <span>صانع الخلفيات المخصصة</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-400/40'
                : 'bg-[#0c1822] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Wallpaper Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWallpapers.map((wallpaper) => (
          <div
            key={wallpaper.id}
            className="group relative bg-[#0a141d] border border-emerald-500/20 rounded-3xl overflow-hidden shadow-xl hover:border-amber-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/40 flex flex-col"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[9/14] overflow-hidden bg-slate-900">
              <img
                src={wallpaper.url}
                alt={wallpaper.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a141d] via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

              {/* Category chip on top */}
              <div className="absolute top-3 right-3">
                <span className="text-[11px] bg-black/60 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 font-medium">
                  {wallpaper.categoryAr}
                </span>
              </div>

              {/* Hover overlay actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] bg-black/40">
                <button
                  onClick={() => setPreviewWallpaper(wallpaper)}
                  title="معاينة شاشة القفل"
                  className="w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  <Eye className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleDownload(wallpaper)}
                  title="تحميل بجودة عالية"
                  className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  {downloadSuccessId === wallpaper.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors line-clamp-1">
                  {wallpaper.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {wallpaper.descriptionAr}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setPreviewWallpaper(wallpaper)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>معاينة الجوال</span>
                </button>

                <button
                  onClick={() => handleDownload(wallpaper)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phone Lock Screen Preview Modal */}
      {previewWallpaper && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full flex flex-col items-center">
            {/* Close button */}
            <button
              onClick={() => setPreviewWallpaper(null)}
              className="absolute -top-12 left-0 text-slate-400 hover:text-white text-sm bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700"
            >
              إغلاق المعاينة ✕
            </button>

            {/* Phone Bezel */}
            <div className="w-72 sm:w-80 h-[560px] sm:h-[620px] rounded-[48px] p-3 bg-[#111] ring-4 ring-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
              {/* Dynamic Island / Speaker notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30" />

              {/* Screen Content */}
              <div className="relative w-full h-full rounded-[38px] overflow-hidden flex flex-col justify-between p-6">
                {/* Background image */}
                <img
                  src={previewWallpaper.url}
                  alt={previewWallpaper.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                {/* Lockscreen Clock */}
                <div className="relative z-10 text-center mt-12 text-white">
                  <div className="text-xs text-slate-200/90 font-medium tracking-wide">
                    الأربعاء • رمضان المبارك
                  </div>
                  <div className="text-6xl font-light tracking-tight my-1 font-mono text-white drop-shadow-lg">
                    {currentTime}
                  </div>
                  <div className="text-xs text-amber-300/95 font-['Amiri',serif] font-bold">
                    سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
                  </div>
                </div>

                {/* Bottom Lockscreen icons */}
                <div className="relative z-10 flex items-center justify-between text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="text-[10px] text-slate-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                    اسحب للأعلى لفتح القفل
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar below mockup */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => handleDownload(previewWallpaper)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>تحميل هذه الخلفية للهاتف</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Islamic Wallpaper Generator Modal */}
      {isCreatorOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a141c] border border-amber-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#060d13]">
              <div className="flex items-center gap-2">
                <Paintbrush className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base sm:text-lg">
                  صانع الخلفيات الإسلامية المخصصة (دقة فائقة للهاتف)
                </h3>
              </div>
              <button
                onClick={() => setIsCreatorOpen(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                إغلاق ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Form Controls */}
              <div className="space-y-4">
                {/* Quick Presets */}
                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1.5">
                    اختر آية جاهزة أو اكتب آيتك المفضلة:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {versePresets.map((vp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCustomVerse(vp.text);
                          setCustomSource(vp.source);
                        }}
                        className="p-2 text-right text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white truncate"
                      >
                        {vp.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Text input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    نص الآية الكريمة أو الذكر:
                  </label>
                  <textarea
                    rows={3}
                    value={customVerse}
                    onChange={(e) => setCustomVerse(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-emerald-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Custom Source */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    اسم السورة ورقم الآية:
                  </label>
                  <input
                    type="text"
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-emerald-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    طراز اللون والزخرفة:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCustomTheme('emerald')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        customTheme === 'emerald'
                          ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      الأخضر الزمردي والذهب
                    </button>
                    <button
                      onClick={() => setCustomTheme('midnight')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        customTheme === 'midnight'
                          ? 'bg-blue-950 border-blue-400 text-blue-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      كحلي الليل والنجوم
                    </button>
                    <button
                      onClick={() => setCustomTheme('gold_black')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        customTheme === 'gold_black'
                          ? 'bg-amber-950 border-amber-400 text-amber-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      الأسود الملكي المذهّب
                    </button>
                    <button
                      onClick={() => setCustomTheme('royal_purple')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        customTheme === 'royal_purple'
                          ? 'bg-purple-950 border-purple-400 text-purple-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      البنفسجي الإمبراطوري
                    </button>
                  </div>
                </div>

                {/* Frame toggle & Font size */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customFrame}
                      onChange={(e) => setCustomFrame(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                    />
                    <span>إطار وزخارف إسلامية ذهبية</span>
                  </label>

                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>حجم الخط:</span>
                    <button
                      onClick={() => setCustomFontSize((s) => Math.max(28, s - 3))}
                      className="w-6 h-6 bg-slate-800 rounded font-bold"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs">{customFontSize}</span>
                    <button
                      onClick={() => setCustomFontSize((s) => Math.min(54, s + 3))}
                      className="w-6 h-6 bg-slate-800 rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleDownloadCustomCanvas}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40 transition-all cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>تنزيل الخلفية المصممة (1080x1920) عالية الدقة</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Canvas Preview */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs text-slate-400 mb-2">المعاينة الحية للتصميم:</div>
                <div className="max-w-[260px] aspect-[9/16] rounded-3xl overflow-hidden ring-4 ring-slate-800 shadow-2xl relative bg-black">
                  <canvas ref={canvasRef} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
