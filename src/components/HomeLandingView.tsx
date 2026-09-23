import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Clock,
  MapPin,
  Sun,
  Moon,
  Volume2,
  Headphones,
  Compass,
  CheckCircle,
  Play,
  RotateCw,
  Navigation,
  ChevronLeft,
  Award,
  Droplets,
  Heart
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { RECITERS } from '../data/reciters';
import {
  getTodayPrayerItems,
  formatRemainingTime,
  getApproxHijriDate,
  POPULAR_CITIES,
  CityOption,
  PrayerTimeItem
} from '../utils/prayerTimes';
import { toArabicDigits } from '../utils/quranService';
import { ActiveTab } from './Navbar';

interface HomeLandingViewProps {
  onNavigate: (tab: ActiveTab, params?: { surahNumber?: number; azkarTab?: 'morning' | 'evening' }) => void;
}

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({ onNavigate }) => {
  const { currentReciter, setReciterById, playSurah, isPlaying } = useAudio();

  // Location state
  const [selectedCity, setSelectedCity] = useState<CityOption>(() => {
    try {
      const saved = localStorage.getItem('user_prayer_city');
      if (saved) return JSON.parse(saved);
    } catch {}
    return POPULAR_CITIES[0]; // Default: Cairo
  });

  const [customCoordinates, setCustomCoordinates] = useState<{
    lat: number;
    lng: number;
    nameAr: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('user_gps_coords');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string>('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);

  const [currentTime24, setCurrentTime24] = useState<string>(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  });

  // Prayer times state
  const [prayerData, setPrayerData] = useState<{
    items: PrayerTimeItem[];
    nextPrayer: PrayerTimeItem;
    remainingSeconds: number;
  }>(() => {
    const lat = customCoordinates ? customCoordinates.lat : selectedCity.lat;
    const lng = customCoordinates ? customCoordinates.lng : selectedCity.lng;
    const tz = customCoordinates ? undefined : selectedCity.timezone;
    return getTodayPrayerItems(new Date(), lat, lng, tz);
  });

  const [remainingCountdown, setRemainingCountdown] = useState<string>('');

  // Live timer for prayer countdown and 24h clock
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime24(`${h}:${m}:${s}`);

      const lat = customCoordinates ? customCoordinates.lat : selectedCity.lat;
      const lng = customCoordinates ? customCoordinates.lng : selectedCity.lng;
      const tz = customCoordinates ? undefined : selectedCity.timezone;
      const data = getTodayPrayerItems(now, lat, lng, tz);
      setPrayerData(data);
      setRemainingCountdown(formatRemainingTime(data.remainingSeconds));
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [selectedCity, customCoordinates]);

  // Handle GPS location click
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatusMessage('خاصية الموقع غير مدعومة في متصفحك، تم الاعتماد على المدينة الافتراضية.');
      return;
    }

    setIsLocating(true);
    setLocationStatusMessage('جاري تحديد موقعك الجغرافي بالـ GPS...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = {
          lat: latitude,
          lng: longitude,
          nameAr: 'موقعي الحالي (GPS)'
        };
        setCustomCoordinates(coords);
        try {
          localStorage.setItem('user_gps_coords', JSON.stringify(coords));
        } catch {}
        setIsLocating(false);
        setLocationStatusMessage('تم تحديد أوقات الصلاة وفق إحداثيات موقعك الدقيق بنجاح!');
        setTimeout(() => setLocationStatusMessage(''), 4000);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        setLocationStatusMessage('تعذر الوصول إلى الـ GPS تلقائياً، يمكنك اختيار مدينتك من القائمة أدناه.');
        setTimeout(() => setLocationStatusMessage(''), 5000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectCity = (city: CityOption) => {
    setSelectedCity(city);
    setCustomCoordinates(null);
    try {
      localStorage.removeItem('user_gps_coords');
      localStorage.setItem('user_prayer_city', JSON.stringify(city));
    } catch {}
    setIsCityDropdownOpen(false);
    setLocationStatusMessage(`تم ضبط أوقات الصلاة على: ${city.nameAr} - ${city.countryAr}`);
    setTimeout(() => setLocationStatusMessage(''), 3000);
  };

  // Reciter choice: Al-Hussary vs Al-Minshawi
  const isHussary = currentReciter.id.startsWith('hussary');
  const isMinshawi = currentReciter.id.startsWith('minshawi');

  const hijri = getApproxHijriDate();

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-3 sm:py-6 px-3 sm:px-6 max-w-5xl mx-auto w-full min-h-[calc(100dvh-140px)] text-slate-100 animate-in fade-in duration-300">
      {/* Top Welcome & Hijri Date Banner */}
      <div className="text-center max-w-xl mx-auto mb-3 sm:mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] sm:text-xs font-semibold mb-1 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{hijri.formatted} • بوابة روحانيات المسلم</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300 font-['Amiri',serif] leading-tight">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h1>
        <p className="text-slate-300 text-[11px] sm:text-xs max-w-md mx-auto mt-0.5 line-clamp-1 sm:line-clamp-none">
          المصحف كامل • تلاوات الحصري والمنشاوي • خلفيات وأذكار وبطاقات الوضوء والصلاة
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 THE FOUR TARGET HERO CIRCLES - CENTERED PERFECTLY FOR MOBILE (2x2) 🌟 */}
      {/* 1. دائرة خلفيات إسلامية */}
      {/* 2. دائرة القرآن الكريم كامل المسموع (عند الضغط على الآية السماع بالحصرى والمنشاوى) */}
      {/* 3. دائرة أذكار الصباح والمساء */}
      {/* 4. دائرة تعليم الوضوء والصلاة بالأنيميشن للأطفال والمبتدئين */}
      {/* ========================================================================= */}
      <div className="relative mb-5 sm:mb-8 w-full max-w-sm sm:max-w-xl lg:max-w-4xl flex flex-col items-center">
        {/* Glow ambient background behind the circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 sm:w-[480px] h-48 sm:h-64 bg-emerald-600/15 rounded-full blur-3xl" />
          <div className="w-64 sm:w-[480px] h-48 sm:h-64 bg-amber-500/10 rounded-full blur-3xl -translate-x-10" />
        </div>

        {/* 2x2 Grid on Mobile, 4 columns on desktop */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full items-center justify-items-center">
          {/* ==================== CIRCLE 1: خلفيات إسلامية ==================== */}
          <div className="flex flex-col items-center group w-full">
            <button
              onClick={() => onNavigate('wallpapers')}
              aria-label="الدخول إلى قسم خلفيات إسلامية"
              className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full p-1.5 sm:p-2 bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-200 shadow-xl shadow-amber-950/70 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              {/* Spinning animated outer ring */}
              <div className="absolute inset-[-4px] rounded-full border border-dashed border-amber-400/60 animate-[spin_25s_linear_infinite] pointer-events-none" />

              {/* Inner Circle Content */}
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#121f1a] to-[#070e12] border border-amber-300/40 overflow-hidden relative flex flex-col items-center justify-center p-2 text-center">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-300"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060c10] via-black/40 to-transparent" />

                <div className="relative z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mb-1 group-hover:rotate-12 transition-transform">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                </div>

                <div className="relative z-10 font-['Amiri',serif] text-base xs:text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-200 tracking-wide drop-shadow">
                  خلفيات إسلامية
                </div>

                <div className="relative z-10 text-[9px] sm:text-[10px] text-amber-200/90 font-medium">
                  مكة • المدينة • المساجد
                </div>

                <div className="relative z-10 mt-1 inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-300 text-[9px] sm:text-[10px] font-bold group-hover:bg-amber-400 group-hover:text-black transition-colors">
                  <span>ادخل الآن</span>
                  <ChevronLeft className="w-2.5 h-2.5 group-hover:-translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium text-center">
              معرض الصور وتوليد الخلفيات
            </span>
          </div>

          {/* ==================== CIRCLE 2: القرآن الكريم كامل المسموع ==================== */}
          <div className="flex flex-col items-center group w-full">
            <button
              onClick={() => onNavigate('quran')}
              aria-label="الدخول إلى القرآن الكريم كامل المسموع"
              className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full p-1.5 sm:p-2 bg-gradient-to-tr from-emerald-600 via-teal-400 to-amber-300 shadow-xl shadow-emerald-950/70 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              {/* Spinning animated outer ring */}
              <div className="absolute inset-[-4px] rounded-full border border-dashed border-emerald-400/60 animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />

              {/* Inner Circle Content */}
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#09221b] to-[#05110d] border border-emerald-400/50 overflow-hidden relative flex flex-col items-center justify-center p-2 text-center">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-300"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05110d] via-black/40 to-transparent" />

                <div className="relative z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                </div>

                <div className="relative z-10 font-['Amiri',serif] text-base xs:text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-amber-200 tracking-wide drop-shadow">
                  القرآن الكريم
                </div>

                <div className="relative z-10 text-[9px] sm:text-[10px] text-emerald-200/90 font-bold">
                  سماع: الحصري والمنشاوي
                </div>

                <div className="relative z-10 mt-1 inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/60 text-emerald-200 text-[9px] sm:text-[10px] font-bold group-hover:bg-emerald-400 group-hover:text-black transition-colors">
                  <span>تصفح واستمع</span>
                  <ChevronLeft className="w-2.5 h-2.5 group-hover:-translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium text-center">
              اضغط على الآية للسماع
            </span>
          </div>

          {/* ==================== CIRCLE 3: أذكار الصباح والمساء ==================== */}
          <div className="flex flex-col items-center group w-full">
            <button
              onClick={() => onNavigate('adhkar')}
              aria-label="الدخول إلى أذكار الصباح والمساء"
              className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full p-1.5 sm:p-2 bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-300 shadow-xl shadow-cyan-950/70 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              {/* Spinning animated outer ring */}
              <div className="absolute inset-[-4px] rounded-full border border-dashed border-cyan-400/60 animate-[spin_22s_linear_infinite] pointer-events-none" />

              {/* Inner Circle Content */}
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#081f28] to-[#040e14] border border-cyan-400/50 overflow-hidden relative flex flex-col items-center justify-center p-2 text-center">
                <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-black/60" />

                <div className="relative z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center mb-1 group-hover:rotate-12 transition-transform">
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                </div>

                <div className="relative z-10 font-['Amiri',serif] text-base xs:text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-sky-300 to-teal-200 tracking-wide drop-shadow">
                  أذكار الصباح والمساء
                </div>

                <div className="relative z-10 text-[9px] sm:text-[10px] text-cyan-200/90 font-medium">
                  حصن المسلم بدون نت
                </div>

                <div className="relative z-10 mt-1 inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-cyan-500/30 border border-cyan-400/60 text-cyan-200 text-[9px] sm:text-[10px] font-bold group-hover:bg-cyan-400 group-hover:text-black transition-colors">
                  <span>ابدأ الأذكار</span>
                  <ChevronLeft className="w-2.5 h-2.5 group-hover:-translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium text-center">
              حصن المسلم وعداد رقمي
            </span>
          </div>

          {/* ==================== CIRCLE 4: بطاقات تعليم الوضوء والصلاة ==================== */}
          <div className="flex flex-col items-center group w-full">
            <button
              onClick={() => onNavigate('learning')}
              aria-label="الدخول إلى بطاقات تعليم الوضوء والصلاة"
              className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full p-1.5 sm:p-2 bg-gradient-to-tr from-teal-500 via-emerald-400 to-yellow-300 shadow-xl shadow-emerald-950/70 hover:shadow-teal-400/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              {/* Spinning animated outer ring */}
              <div className="absolute inset-[-4px] rounded-full border border-dashed border-teal-300/60 animate-[spin_18s_linear_infinite_reverse] pointer-events-none" />

              {/* Inner Circle Content */}
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#08241d] to-[#04110d] border border-yellow-400/50 overflow-hidden relative flex flex-col items-center justify-center p-2 text-center">
                <div className="absolute inset-0 bg-radial from-teal-400/10 via-transparent to-black/60" />

                <div className="relative z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-yellow-400/20 border border-yellow-300/60 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                </div>

                <div className="relative z-10 font-['Amiri',serif] text-base xs:text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-emerald-200 tracking-wide drop-shadow">
                  الوضوء والصلاة
                </div>

                <div className="relative z-10 text-[9px] sm:text-[10px] text-yellow-200/90 font-bold">
                  بطاقات Flash Cards
                </div>

                <div className="relative z-10 mt-1 inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-yellow-400/30 border border-yellow-300/60 text-yellow-200 text-[9px] sm:text-[10px] font-bold group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                  <span>تعلّم الآن</span>
                  <ChevronLeft className="w-2.5 h-2.5 group-hover:-translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium text-center">
              بطاقات فلاش كارد تفاعلية
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🕌 أوقات الصلاة باللوكيشن (Prayer Times by Location) 🕌 */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-b from-[#0b1922] to-[#071118] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 mb-10 shadow-2xl relative overflow-hidden">
        {/* Top bar with location picker */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Amiri',serif]">
                مواقيت الصلاة حسب موقعك الجغرافي
              </h2>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                حساب فلكي بدون نت
              </span>
              <span className="text-[11px] bg-slate-900 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                الساعة الآن: {currentTime24} (نظام ٢٤ ساعة)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>الموقع الحالي:</span>
              <span className="text-amber-300 font-semibold">
                {customCoordinates ? customCoordinates.nameAr : `${selectedCity.nameAr} (${selectedCity.countryAr})`}
              </span>
            </div>
          </div>

          {/* Location Controls (GPS Button & City Picker) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* GPS Auto Detect */}
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="تحديد الموقع الحالي تلقائياً عبر GPS"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'جاري التحديد...' : 'موقعي بالـ GPS'}</span>
            </button>

            {/* City Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="px-3.5 py-2 rounded-xl bg-[#09151e] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>تغيير المدينة</span>
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 top-11 w-56 max-h-64 overflow-y-auto bg-[#09141d] border border-emerald-500/40 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="text-[11px] font-bold text-slate-400 px-2.5 py-1 border-b border-slate-800 mb-1">
                    اختر المدينة:
                  </div>
                  {POPULAR_CITIES.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectCity(c)}
                      className={`w-full text-right px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedCity.nameAr === c.nameAr && !customCoordinates
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{c.nameAr}</span>
                      <span className="text-[10px] opacity-75 font-mono">{c.countryAr}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status toast message */}
        {locationStatusMessage && (
          <div className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs text-center animate-in fade-in">
            {locationStatusMessage}
          </div>
        )}

        {/* Next Prayer Countdown Callout */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs text-slate-300">
                الصلاة القادمة بإذن الله:
              </div>
              <div className="text-base sm:text-lg font-bold text-amber-300 font-['Amiri',serif]">
                صلاة {prayerData.nextPrayer.nameAr} في تمام الساعة ({prayerData.nextPrayer.time})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">الوقت المتبقي:</span>
            <div className="px-4 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-base sm:text-lg tracking-wider">
              {remainingCountdown}
            </div>
          </div>
        </div>

        {/* 6 Prayer Times Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {prayerData.items.map((p) => {
            const isNext = prayerData.nextPrayer.id === p.id;
            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center ${
                  isNext
                    ? 'bg-gradient-to-b from-amber-950/60 to-slate-900 border-amber-400/70 shadow-lg shadow-amber-950/60 ring-2 ring-amber-400/30'
                    : 'bg-[#081219] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <span className="text-xs text-slate-400 mb-1">{p.nameAr}</span>
                <span
                  className={`text-xl sm:text-2xl font-bold font-mono tracking-wide ${
                    isNext ? 'text-amber-300' : 'text-white'
                  }`}
                >
                  {p.time}
                </span>
                {isNext && (
                  <span className="mt-1.5 text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/40 font-semibold animate-pulse">
                    الصلاة القادمة
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📿 أذكار الصباح والمساء بدون نت (Morning & Evening Adhkar offline) 📿 */}
      {/* ========================================================================= */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white font-['Amiri',serif]">
              أذكار الصباح والمساء (حصن المسلم بدون نت)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('adhkar')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>جميع الأذكار والسبحة</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card: أذكار الصباح */}
          <div
            onClick={() => onNavigate('adhkar', { azkarTab: 'morning' })}
            className="group p-6 rounded-3xl bg-gradient-to-br from-[#12221b] via-[#091512] to-[#070e0c] border border-emerald-500/30 hover:border-amber-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
                <Sun className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white font-['Amiri',serif] group-hover:text-amber-300 transition-colors">
                    أذكار الصباح
                  </h3>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    بدون نت
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  «أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ» • حفظ وبركة ونور ليومك
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <span>ابدأ قراءة أذكار الصباح الآن</span>
                  <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Card: أذكار المساء */}
          <div
            onClick={() => onNavigate('adhkar', { azkarTab: 'evening' })}
            className="group p-6 rounded-3xl bg-gradient-to-br from-[#0c1825] via-[#08111a] to-[#050b11] border border-blue-500/30 hover:border-blue-400/60 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 group-hover:scale-110 group-hover:-rotate-6 transition-all shrink-0">
                <Moon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white font-['Amiri',serif] group-hover:text-blue-300 transition-colors">
                    أذكار المساء
                  </h3>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                    بدون نت
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  «أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ» • سكينة وحصن وحفظ الليل
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 text-xs text-blue-400 font-bold">
                  <span>ابدأ قراءة أذكار المساء الآن</span>
                  <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎙️ اختيار القارئ: الحصري والمنشاوي (Reciter Choice: Hussary & Minshawi) 🎙️ */}
      {/* ========================================================================= */}
      <div className="bg-[#09151e] border border-emerald-500/25 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Amiri',serif]">
                القارئ المختار للقرآن الكريم (الحصري والمنشاوي)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              اختر صوتك المفضل للاستماع أثناء قراءة المصحف أو تشغيل السور بالكامل
            </p>
          </div>

          <button
            onClick={() => onNavigate('reciters')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <span>عرض السور والتنزيلات (١١٤ سورة)</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dual Reciter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sheikh Al-Hussary Card */}
          <div
            onClick={() => setReciterById('hussary_murattal')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              isHussary
                ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg'
                : 'bg-[#060d13] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <img
                src={RECITERS[0].avatar}
                alt="الشيخ الحصري"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-white font-['Amiri',serif]">
                    الشيخ محمود خليل الحصري
                  </h4>
                  {isHussary && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div className="text-[11px] text-emerald-300 mt-0.5">
                  شيخ عموم المقارئ المصرية • دقة التجويد والأحكام
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  المصحف المرتل والمجوّد
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  isHussary
                    ? 'bg-emerald-500 text-black'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isHussary ? 'محدد حالياً ✓' : 'اختيار'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setReciterById('hussary_murattal');
                  playSurah(1);
                }}
                title="استماع لسورة الفاتحة"
                className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Sheikh Al-Minshawi Card */}
          <div
            onClick={() => setReciterById('minshawi_murattal')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              isMinshawi
                ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg'
                : 'bg-[#060d13] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <img
                src={RECITERS[1].avatar}
                alt="الشيخ المنشاوي"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-white font-['Amiri',serif]">
                    الشيخ محمد صديق المنشاوي
                  </h4>
                  {isMinshawi && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div className="text-[11px] text-amber-300 mt-0.5">
                  الصوت الباكي الخاشع • عذوبة النبرة وخشوع القلب
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  المصحف المرتل والمجوّد
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  isMinshawi
                    ? 'bg-emerald-500 text-black'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isMinshawi ? 'محدد حالياً ✓' : 'اختيار'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setReciterById('minshawi_murattal');
                  playSurah(1);
                }}
                title="استماع لسورة الفاتحة"
                className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
