import React, { useState } from 'react';
import { AudioProvider } from './context/AudioContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { HomeLandingView } from './components/HomeLandingView';
import { QuranReader } from './components/QuranReader';
import { RecitersView } from './components/RecitersView';
import { NamesOfAllahView } from './components/NamesOfAllahView';
import { WallpaperGallery } from './components/WallpaperGallery';
import { TasbihAndAzkarView } from './components/TasbihAndAzkarView';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { IntroSplash } from './components/IntroSplash';
import { KidsWuduAndPrayerLearning } from './components/KidsWuduAndPrayerLearning';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Intro splash screen
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // First screen upon opening app: HomeLandingView with the requested Circles & Prayer Times
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [targetSurahNumber, setTargetSurahNumber] = useState<number>(1);
  const [targetAzkarTab, setTargetAzkarTab] = useState<'morning' | 'evening' | 'tasbih'>('morning');

  const handleNavigateFromHome = (
    tab: ActiveTab,
    params?: { surahNumber?: number; azkarTab?: 'morning' | 'evening' }
  ) => {
    if (params?.surahNumber) {
      setTargetSurahNumber(params.surahNumber);
    }
    if (params?.azkarTab) {
      setTargetAzkarTab(params.azkarTab);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSurahFromReciters = (surahNumber: number) => {
    setTargetSurahNumber(surahNumber);
    setActiveTab('quran');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBookmark = (surahNumber: number, _ayahNumber: number) => {
    setTargetSurahNumber(surahNumber);
    setActiveTab('quran');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AudioProvider>
      {/* Intro Screen: تم تطوير التطبيق بواسطة أ/ محمود علي محمد */}
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}

      <div className="min-h-screen bg-[#070e14] text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-emerald-600 selection:text-white">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectBookmark={handleSelectBookmark}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 flex flex-col justify-center">
          {activeTab === 'home' && (
            <HomeLandingView onNavigate={handleNavigateFromHome} />
          )}

          {activeTab === 'quran' && (
            <QuranReader
              initialSurah={targetSurahNumber}
              onOpenReciters={() => setActiveTab('reciters')}
            />
          )}

          {activeTab === 'reciters' && (
            <RecitersView onSelectSurahInReader={handleSelectSurahFromReciters} />
          )}

          {activeTab === 'wallpapers' && <WallpaperGallery />}

          {activeTab === 'adhkar' && (
            <TasbihAndAzkarView initialCategory={targetAzkarTab} />
          )}

          {activeTab === 'learning' && <KidsWuduAndPrayerLearning />}

          {activeTab === 'names' && <NamesOfAllahView />}
        </main>

        {/* Developer Attribution Footer */}
        <footer className="border-t border-emerald-500/15 bg-[#050b10] py-3 sm:py-5 px-4 text-center pb-24 sm:pb-20 mt-auto">
          <div className="max-w-xl mx-auto flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-['Amiri',serif] text-sm sm:text-base font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>تم تطوير هذا التطبيق المبارك بواسطة: أ / محمود علي محمد</span>
            </div>
            <p className="text-[11px] text-slate-400">
              صدقة جارية • نفع الله به الإسلام والمسلمين ورزقنا وإياكم الإخلاص والقبول
            </p>
            <button
              onClick={() => setShowIntro(true)}
              className="text-[10px] text-emerald-400/80 hover:text-emerald-300 underline underline-offset-2 mt-0.5 transition-colors"
            >
              عرض شاشة البداية (الانترو) مرة أخرى
            </button>
          </div>
        </footer>

        {/* Global Floating Audio Player for Hussary & Minshawi */}
        <AudioPlayerBar />
      </div>
    </AudioProvider>
  );
}
