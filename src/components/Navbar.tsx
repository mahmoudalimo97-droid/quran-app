import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Headphones,
  Sparkles,
  Image as ImageIcon,
  Heart,
  Droplets,
  Bookmark as BookmarkIcon,
  WifiOff,
  Search,
  Menu,
  X,
  Volume2
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { Bookmark } from '../types/quran';

export type ActiveTab = 'home' | 'quran' | 'reciters' | 'learning' | 'wallpapers' | 'adhkar' | 'names';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSurahSearch?: () => void;
  onSelectBookmark?: (surahNumber: number, ayahNumber: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSurahSearch,
  onSelectBookmark
}) => {
  const { isPlaying, currentReciter } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [bookmarksOpen, setBookmarksOpen] = useState<boolean>(false);

  // Load bookmarks from local storage
  const getBookmarks = (): Bookmark[] => {
    try {
      const s = localStorage.getItem('quran_bookmarks');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  };

  const navItems = [
    { id: 'home' as ActiveTab, label: 'الرئيسية', icon: Home },
    { id: 'quran' as ActiveTab, label: 'المصحف الشريف', icon: BookOpen },
    { id: 'learning' as ActiveTab, label: 'بطاقات الوضوء والصلاة', icon: Droplets },
    { id: 'reciters' as ActiveTab, label: 'الحصري والمنشاوي', icon: Headphones },
    { id: 'wallpapers' as ActiveTab, label: 'خلفيات إسلامية', icon: ImageIcon },
    { id: 'adhkar' as ActiveTab, label: 'أذكار ومواقيت الصلاة', icon: Heart },
    { id: 'names' as ActiveTab, label: 'أسماء الله الحسنى', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#09131a]/95 backdrop-blur-md border-b border-emerald-500/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 p-0.5 shadow-lg shadow-emerald-950/60 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-[#081219] rounded-[14px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400 group-hover:rotate-6 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-white font-['Amiri',serif] tracking-wide">
                القرآن الكريم
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-emerald-400" />
                <span>بدون نت</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400/90 font-medium hidden sm:block">
              تلاوات الحصري والمنشاوي والخلفيات
            </div>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action icons (Bookmarks, Audio status, Mobile toggle) */}
        <div className="flex items-center gap-2">
          {/* Audio Indicator button */}
          {isPlaying && (
            <button
              onClick={() => setActiveTab('reciters')}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1.5 animate-pulse"
              title="تلاوة قيد التشغيل"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{currentReciter.name.split(' ')[2]}</span>
            </button>
          )}

          {/* Bookmarks toggle */}
          <div className="relative">
            <button
              onClick={() => setBookmarksOpen(!bookmarksOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors relative"
              title="العلامات المرجعية المحفوظة"
            >
              <BookmarkIcon className="w-5 h-5 text-amber-400" />
              {getBookmarks().length > 0 && (
                <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            {/* Bookmarks Dropdown */}
            {bookmarksOpen && (
              <div className="absolute left-0 top-12 w-64 bg-[#0a141c] border border-emerald-500/30 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold text-white">
                  <span>الفواصل والعلامات المرجعية</span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {getBookmarks().length} علامة
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5">
                  {getBookmarks().length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      لم تقم بحفظ أي علامة بعد. اضغط على أيقونة الإشارة المرجعية بجانب أي آية لحفظها.
                    </p>
                  ) : (
                    getBookmarks().map((bm, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          if (onSelectBookmark) {
                            onSelectBookmark(bm.surahNumber, bm.ayahNumber);
                          }
                          setActiveTab('quran');
                          setBookmarksOpen(false);
                        }}
                        className="p-2 rounded-xl bg-slate-900/60 hover:bg-emerald-950/60 hover:border-emerald-500/40 border border-slate-800/60 cursor-pointer transition-all"
                      >
                        <div className="text-xs font-bold text-amber-300">
                          سورة {bm.surahName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          الآية رقم {bm.ayahNumber}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-[#070e14] px-4 py-3 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
