import React, { useState } from 'react';
import { useAudio, RepeatCount } from '../context/AudioContext';
import { SURAH_LIST } from '../data/surahList';
import { RECITERS } from '../data/reciters';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Gauge,
  DownloadCloud,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  UserCheck,
  Disc3
} from 'lucide-react';
import { toArabicDigits } from '../utils/quranService';

export const AudioPlayerBar: React.FC = () => {
  const {
    isPlaying,
    isLoading,
    currentReciter,
    currentSurahNumber,
    currentAyahNumber,
    totalAyahsInSurah,
    repeatSetting,
    playbackRate,
    progress,
    currentTime,
    duration,
    isMuted,
    downloadProgress,
    isOfflineCached,
    togglePlayPause,
    nextAyah,
    previousAyah,
    setReciterById,
    setRepeatSetting,
    setPlaybackRate,
    toggleMute,
    seekTo,
    cacheCurrentSurahOffline
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showReciterMenu, setShowReciterMenu] = useState<boolean>(false);
  const [showRepeatMenu, setShowRepeatMenu] = useState<boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);

  const surahMeta = SURAH_LIST.find(s => s.number === currentSurahNumber) || SURAH_LIST[0];

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const repeatOptions: { value: RepeatCount; label: string }[] = [
    { value: 1, label: 'بدون تكرار' },
    { value: 2, label: 'تكرار مرتين' },
    { value: 3, label: 'تكرار 3 مرات' },
    { value: 999, label: 'تكرار مستمر للآية' },
  ];

  const speedOptions = [0.75, 1.0, 1.25, 1.5];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1821]/95 backdrop-blur-md border-t border-emerald-500/20 shadow-2xl transition-all duration-300">
      {/* Progress scrubbing line */}
      <div
        className="w-full h-1.5 bg-slate-800/80 cursor-pointer relative group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = (clickX / rect.width) * 100;
          seekTo(pct);
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 group-hover:h-2 transition-all relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Reciter Info & Surah Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative cursor-pointer shrink-0" onClick={() => setShowReciterMenu(!showReciterMenu)}>
            <img
              src={currentReciter.avatar}
              alt={currentReciter.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-inner"
            />
            {isPlaying && (
              <span className="absolute -bottom-0.5 -left-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm sm:text-base tracking-wide truncate">
                سورة {surahMeta.name}
              </span>
              <span className="text-xs bg-emerald-950/70 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 whitespace-nowrap">
                الآية {toArabicDigits(currentAyahNumber)} من {toArabicDigits(totalAyahsInSurah)}
              </span>
            </div>
            <button
              onClick={() => setShowReciterMenu(!showReciterMenu)}
              className="text-xs text-slate-300/80 hover:text-amber-300 flex items-center gap-1 transition-colors text-right truncate"
            >
              <span>{currentReciter.name}</span>
              <span className="text-[10px] text-amber-400/90 font-medium">({currentReciter.style === 'murattal' ? 'مرتل' : 'مجوّد'})</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Previous Ayah button */}
            <button
              onClick={previousAyah}
              title="الآية السابقة"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors active:scale-95"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Play/Pause main button */}
            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-900/40 active:scale-95 transition-all cursor-pointer"
            >
              {isLoading ? (
                <Disc3 className="w-6 h-6 animate-spin text-white" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
              )}
            </button>

            {/* Next Ayah button */}
            <button
              onClick={nextAyah}
              title="الآية التالية"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors active:scale-95"
            >
              <SkipBack className="w-5 h-5" />
            </button>
          </div>

          {/* Time display */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Secondary controls (Repeat, Speed, Offline, Reciter Select) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Repeat Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRepeatMenu(!showRepeatMenu);
                setShowSpeedMenu(false);
                setShowReciterMenu(false);
              }}
              title="تكرار الآية للحفظ"
              className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-all ${
                repeatSetting > 1
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">
                {repeatSetting === 1 ? 'تكرار' : `${repeatSetting}x`}
              </span>
            </button>

            {/* Repeat dropdown */}
            {showRepeatMenu && (
              <div className="absolute bottom-12 left-0 sm:left-auto sm:right-0 w-44 bg-[#0a1219] border border-emerald-500/30 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="px-2 py-1 text-[11px] text-amber-400/90 font-bold border-b border-slate-800">
                  تكرار الآية لتسهيل الحفظ
                </div>
                {repeatOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setRepeatSetting(opt.value);
                      setShowRepeatMenu(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                      repeatSetting === opt.value
                        ? 'bg-emerald-600/30 text-emerald-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {repeatSetting === opt.value && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Speed Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSpeedMenu(!showSpeedMenu);
                setShowRepeatMenu(false);
                setShowReciterMenu(false);
              }}
              title="سرعة التلاوة"
              className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-all ${
                playbackRate !== 1
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">{playbackRate}x</span>
            </button>

            {/* Speed dropdown */}
            {showSpeedMenu && (
              <div className="absolute bottom-12 left-0 sm:left-auto sm:right-0 w-32 bg-[#0a1219] border border-emerald-500/30 rounded-xl shadow-2xl p-1.5 z-50">
                <div className="px-2 py-1 text-[11px] text-amber-400/90 font-bold border-b border-slate-800">
                  سرعة الصوت
                </div>
                {speedOptions.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full text-center px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      playbackRate === rate
                        ? 'bg-emerald-600/30 text-emerald-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    {rate}x {rate === 1.0 && '(طبيعي)'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Offline Cache Button */}
          <button
            onClick={cacheCurrentSurahOffline}
            disabled={downloadProgress !== null}
            title="تحميل سورة كاملة للتشغيل بدون إنترنت"
            className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition-colors relative"
          >
            {downloadProgress !== null ? (
              <div className="flex items-center gap-1 text-[11px] text-amber-400">
                <Disc3 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">{downloadProgress}%</span>
              </div>
            ) : isOfflineCached ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <DownloadCloud className="w-4 h-4" />
            )}
          </button>

          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="hidden sm:block p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reciter Selector Modal / Dropdown */}
      {showReciterMenu && (
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="bg-[#070e14] border border-emerald-500/30 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">اختر القارئ ورواية التلاوة</h4>
              </div>
              <button
                onClick={() => setShowReciterMenu(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                إغلاق
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RECITERS.map((rec) => {
                const isSelected = currentReciter.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => {
                      setReciterById(rec.id);
                      setShowReciterMenu(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <img
                      src={rec.avatar}
                      alt={rec.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-white truncate">{rec.name}</h5>
                        {isSelected && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                            القارئ الحالي
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-400/90 font-medium">{rec.subname}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{rec.bio}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
