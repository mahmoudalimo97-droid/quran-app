import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Heart, ArrowLeft, CheckCircle } from 'lucide-react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // 3.2 seconds total duration
    const totalDuration = 3200;
    const intervalTime = 40;
    const step = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          handleFinish();
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 500); // 500ms fade transition
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050c12] text-white select-none transition-opacity duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Islamic Atmospheric background lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-amber-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />

        {/* Delicate arabesque pattern dots */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#d4af37 1.5px, transparent 1.5px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Main Intro Card */}
      <div className="relative z-10 max-w-lg w-full px-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
        {/* Basmala Calligraphy */}
        <div className="text-amber-200/90 font-['Amiri',serif] text-xl sm:text-2xl mb-6 tracking-wide drop-shadow-md">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>

        {/* Central Glowing Emblem */}
        <div className="relative mb-7">
          {/* Animated spinning outer ring */}
          <div className="absolute inset-[-10px] rounded-full border border-dashed border-amber-400/40 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-[-4px] rounded-full border border-emerald-400/30 animate-[spin_15s_linear_infinite_reverse]" />

          {/* Glowing core */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-1 shadow-2xl shadow-emerald-950 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#08131b] flex flex-col items-center justify-center">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300 font-['Amiri',serif] mb-2 tracking-wide">
          القرآن الكريم وروحانيات
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          المصحف الشريف • تلاوات الحصري والمنشاوي • مواقيت الصلاة • الخلفيات
        </p>

        {/* ========================================================================= */}
        {/* 🌟 DEVELOPER CREDIT BANNER (تم تطوير التطبيق بواسطة أ/ محمود علي محمد) 🌟 */}
        {/* ========================================================================= */}
        <div className="w-full bg-gradient-to-r from-emerald-950/80 via-[#0d221c] to-emerald-950/80 border border-amber-400/50 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>إهداء وتطوير خاص</span>
          </div>

          <div className="text-sm sm:text-base text-slate-200 font-medium">
            تم تطوير هذا التطبيق المبارك بواسطة:
          </div>

          {/* Developer Name in Grand Arabic Typography */}
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 font-['Amiri',serif] mt-1.5 tracking-wide drop-shadow-md">
            أ / محمود علي محمد
          </div>

          <div className="text-[11px] sm:text-xs text-emerald-300/80 mt-2">
            نسأل الله تبارك وتعالى أن يتقبل هذا العمل خالصاً لوجهه الكريم وأن يجعله صدقة جارية ونفعاً للمسلمين
          </div>
        </div>

        {/* Progress Bar & Skip Button */}
        <div className="w-full max-w-xs space-y-3">
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-emerald-900/50">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-75 rounded-full"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>دخول التطبيق مباشرة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
