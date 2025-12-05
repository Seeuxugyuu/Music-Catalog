// src/context/PlayerProvider.jsx

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [queue, setQueueState] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // START FIX: REFRESH MECHANISM
  const [refreshKey, setRefreshKey] = useState(0); 
  // END FIX: REFRESH MECHANISM

  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.8);

  // restore queue
  useEffect(() => {
    const saved = localStorage.getItem("music_queue");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQueueState(parsed.queue || []);
        setCurrentIndex(parsed.currentIndex || 0);
      } catch {}
    }
  }, []);

  // simpan queue
  useEffect(() => {
    localStorage.setItem(
      "music_queue",
      JSON.stringify({ queue, currentIndex })
    );
  }, [queue, currentIndex]);

  const setQueue = (tracks, index = 0) => {
    setQueueState(tracks || []);
    setCurrentIndex(index || 0);
  };

  const jumpTo = (index) => {
    if (!queue.length) return;
    if (index < 0 || index >= queue.length) return;
    setCurrentIndex(index);
  };

  // START FIX: REFRESH MECHANISM
  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  // END FIX: REFRESH MECHANISM
  
  const currentTrack = queue[currentIndex] || null;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < queue.length - 1;

  const next = () => jumpTo(currentIndex + 1);
  const prev = () => jumpTo(currentIndex - 1);

  // attach audio listeners sekali
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onTime = () => setCur(a.currentTime);
    const onMeta = () => setDur(a.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      if (hasNext) next();
    };

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);

    a.volume = vol;

    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNext, currentIndex, queue.length]);

  // update volume ke element
  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = vol;
  }, [vol]);

  // AUTO PLAY tiap lagu berubah
  useEffect(() => {
    const a = audioRef.current;
    
    // FIX PLAYBACK: Gunakan 'audio' (setelah di-map di TracksPage) atau fallback ke 'audio_url'
    const audioSrc = currentTrack?.audio || currentTrack?.audio_url; 
    
    if (!a || !audioSrc) return; 

    setCur(0);
    setDur(0);
    a.src = audioSrc; 
    a.load();

    if (true) { // Asumsi selalu autoplay jika track baru.
      const tryPlay = async () => {
        try {
          await a.play();
          setPlaying(true);
        } catch {
          setPlaying(false);
        }
      };
      tryPlay();
    } else {
      setPlaying(false);
    }
  }, [currentTrack?.audio, currentTrack?.audio_url]); 

  const play = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      await a.play();
      setPlaying(true);
    } catch {}
  };

  const pause = () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    setPlaying(false);
  };

  const toggle = () => (playing ? pause() : play());

  const seek = (v) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = v;
    setCur(v);
  };

  const value = useMemo(
    () => ({
      audioRef,
      queue,
      currentIndex,
      currentTrack,
      setQueue,
      jumpTo,
      next,
      prev,
      hasNext,
      hasPrev,
      playing,
      cur,
      dur,
      vol,
      setVol,
      play,
      pause,
      toggle,
      seek,
      refreshKey, // START FIX: REFRESH MECHANISM
      triggerRefresh,
      // END FIX: REFRESH MECHANISM
    }),
    [
      queue, 
      currentIndex, 
      currentTrack, 
      hasNext, 
      hasPrev, 
      playing, 
      cur, 
      dur, 
      vol, 
      refreshKey // ADD dependency
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {/* audio global, hidden */}
      <audio ref={audioRef} hidden />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
