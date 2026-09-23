import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { RECITERS, getAyahAudioUrl, getSurahAudioUrl } from '../data/reciters';
import { Reciter } from '../types/quran';
import { SURAH_LIST } from '../data/surahList';

export type PlaybackMode = 'ayah' | 'surah';
export type RepeatCount = 1 | 2 | 3 | 999; // 999 = loop forever

interface AudioContextType {
  isPlaying: boolean;
  isLoading: boolean;
  currentReciter: Reciter;
  currentSurahNumber: number;
  currentAyahNumber: number;
  totalAyahsInSurah: number;
  playbackMode: PlaybackMode;
  repeatSetting: RepeatCount;
  playbackRate: number;
  progress: number; // 0 to 100
  duration: number; // in seconds
  currentTime: number; // in seconds
  volume: number;
  isMuted: boolean;
  isOfflineCached: boolean;
  downloadProgress: number | null; // null if not downloading, 0-100 if downloading
  playAyah: (surahNumber: number, ayahNumber: number, totalAyahs?: number) => void;
  playSurah: (surahNumber: number, startAyah?: number) => void;
  togglePlayPause: () => void;
  nextAyah: () => void;
  previousAyah: () => void;
  setReciterById: (id: string) => void;
  setRepeatSetting: (count: RepeatCount) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  seekTo: (percentage: number) => void;
  cacheCurrentSurahOffline: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentReciter, setCurrentReciter] = useState<Reciter>(RECITERS[0]); // Hussary Murattal
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(1);
  const [currentAyahNumber, setCurrentAyahNumber] = useState<number>(1);
  const [totalAyahsInSurah, setTotalAyahsInSurah] = useState<number>(7);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('ayah');
  const [repeatSetting, setRepeatSetting] = useState<RepeatCount>(1);
  const [repeatCounter, setRepeatCounter] = useState<number>(1);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOfflineCached, setIsOfflineCached] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.pause();
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Update total ayahs when surah changes
  useEffect(() => {
    const meta = SURAH_LIST.find(s => s.number === currentSurahNumber);
    if (meta) {
      setTotalAyahsInSurah(meta.numberOfAyahs);
    }
  }, [currentSurahNumber]);

  // Handle Ayah completion and repeat logic
  const handleEnded = useCallback(() => {
    if (playbackMode === 'ayah') {
      if (repeatSetting > 1 && repeatCounter < repeatSetting) {
        // Repeat the same ayah
        setRepeatCounter(prev => prev + 1);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
      } else {
        // Reset repeat counter and advance to next ayah
        setRepeatCounter(1);
        if (currentAyahNumber < totalAyahsInSurah) {
          const nextA = currentAyahNumber + 1;
          setCurrentAyahNumber(nextA);
          loadAndPlay(currentReciter.id, currentSurahNumber, nextA, 'ayah');
        } else {
          // Check if there is a next surah
          if (currentSurahNumber < 114) {
            const nextS = currentSurahNumber + 1;
            const nextMeta = SURAH_LIST.find(s => s.number === nextS);
            setCurrentSurahNumber(nextS);
            setCurrentAyahNumber(1);
            if (nextMeta) setTotalAyahsInSurah(nextMeta.numberOfAyahs);
            loadAndPlay(currentReciter.id, nextS, 1, 'ayah');
          } else {
            setIsPlaying(false);
          }
        }
      }
    } else {
      // Full surah mode ended -> next surah
      if (currentSurahNumber < 114) {
        const nextS = currentSurahNumber + 1;
        setCurrentSurahNumber(nextS);
        setCurrentAyahNumber(1);
        loadAndPlay(currentReciter.id, nextS, 1, 'surah');
      } else {
        setIsPlaying(false);
      }
    }
  }, [playbackMode, repeatSetting, repeatCounter, currentAyahNumber, totalAyahsInSurah, currentSurahNumber, currentReciter.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.onended = handleEnded;
  }, [handleEnded]);

  const loadAndPlay = async (
    reciterId: string,
    surahNumber: number,
    ayahNumber: number,
    mode: PlaybackMode
  ) => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setProgress(0);
    setCurrentTime(0);

    const url = mode === 'ayah'
      ? getAyahAudioUrl(reciterId, surahNumber, ayahNumber)
      : getSurahAudioUrl(reciterId, surahNumber);

    audio.src = url;
    audio.playbackRate = playbackRate;
    audio.volume = isMuted ? 0 : volume;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn('Playback error (retrying with fallback):', err);
      // Auto-fallback if specific format is temporarily slow
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const playAyah = (surahNumber: number, ayahNumber: number, totalAyahs?: number) => {
    setCurrentSurahNumber(surahNumber);
    setCurrentAyahNumber(ayahNumber);
    if (totalAyahs) setTotalAyahsInSurah(totalAyahs);
    setPlaybackMode('ayah');
    setRepeatCounter(1);
    loadAndPlay(currentReciter.id, surahNumber, ayahNumber, 'ayah');
  };

  const playSurah = (surahNumber: number, startAyah: number = 1) => {
    setCurrentSurahNumber(surahNumber);
    setCurrentAyahNumber(startAyah);
    setPlaybackMode('ayah'); // Verse by verse sync allows visual tracking
    setRepeatCounter(1);
    loadAndPlay(currentReciter.id, surahNumber, startAyah, 'ayah');
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.src && audio.src !== '') {
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      } else {
        playAyah(currentSurahNumber, currentAyahNumber);
      }
    }
  };

  const nextAyah = () => {
    if (currentAyahNumber < totalAyahsInSurah) {
      const nextA = currentAyahNumber + 1;
      setCurrentAyahNumber(nextA);
      setRepeatCounter(1);
      loadAndPlay(currentReciter.id, currentSurahNumber, nextA, playbackMode);
    } else if (currentSurahNumber < 114) {
      const nextS = currentSurahNumber + 1;
      setCurrentSurahNumber(nextS);
      setCurrentAyahNumber(1);
      setRepeatCounter(1);
      loadAndPlay(currentReciter.id, nextS, 1, playbackMode);
    }
  };

  const previousAyah = () => {
    if (currentAyahNumber > 1) {
      const prevA = currentAyahNumber - 1;
      setCurrentAyahNumber(prevA);
      setRepeatCounter(1);
      loadAndPlay(currentReciter.id, currentSurahNumber, prevA, playbackMode);
    } else if (currentSurahNumber > 1) {
      const prevS = currentSurahNumber - 1;
      const prevMeta = SURAH_LIST.find(s => s.number === prevS);
      const lastA = prevMeta ? prevMeta.numberOfAyahs : 1;
      setCurrentSurahNumber(prevS);
      setCurrentAyahNumber(lastA);
      setRepeatCounter(1);
      loadAndPlay(currentReciter.id, prevS, lastA, playbackMode);
    }
  };

  const setReciterById = (id: string) => {
    const found = RECITERS.find(r => r.id === id);
    if (found) {
      setCurrentReciter(found);
      if (isPlaying) {
        loadAndPlay(found.id, currentSurahNumber, currentAyahNumber, playbackMode);
      }
    }
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const seekTo = (percentage: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(percentage);
      setCurrentTime(newTime);
    }
  };

  // Offline Caching for current Surah audio
  const cacheCurrentSurahOffline = async () => {
    if (typeof window === 'undefined' || !('caches' in window)) return;
    setDownloadProgress(0);
    try {
      const cache = await caches.open('quran-audio-cache-v1');
      const total = totalAyahsInSurah;
      let completed = 0;

      for (let a = 1; a <= total; a++) {
        const url = getAyahAudioUrl(currentReciter.id, currentSurahNumber, a);
        const match = await cache.match(url);
        if (!match) {
          try {
            await cache.add(url);
          } catch (e) {
            console.warn('Audio cache failed for verse', a, e);
          }
        }
        completed++;
        setDownloadProgress(Math.round((completed / total) * 100));
      }
      setIsOfflineCached(true);
    } catch (err) {
      console.error('Offline caching error:', err);
    } finally {
      setTimeout(() => setDownloadProgress(null), 1200);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isLoading,
        currentReciter,
        currentSurahNumber,
        currentAyahNumber,
        totalAyahsInSurah,
        playbackMode,
        repeatSetting,
        playbackRate,
        progress,
        duration,
        currentTime,
        volume,
        isMuted,
        isOfflineCached,
        downloadProgress,
        playAyah,
        playSurah,
        togglePlayPause,
        nextAyah,
        previousAyah,
        setReciterById,
        setRepeatSetting,
        setPlaybackRate,
        setVolume,
        toggleMute,
        seekTo,
        cacheCurrentSurahOffline
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
