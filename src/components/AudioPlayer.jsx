import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

function formatTime(s = 0) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src, onEnded, autoPlay = true }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.8);

  // attach listeners sekali
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onTime = () => setCur(a.currentTime);
    const onMeta = () => setDur(a.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      onEnded?.();
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
  }, [onEnded]);

  // update volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = vol;
  }, [vol]);

  // 🔥 AUTO PLAY tiap src ganti
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !src) return;

    // reset posisi
    setCur(0);
    setDur(0);

    a.load(); // reload source baru

    if (autoPlay) {
      const tryPlay = async () => {
        try {
          await a.play();
          setPlaying(true);
        } catch {
          // kalau browser blok autoplay, user tinggal klik play
          setPlaying(false);
        }
      };
      tryPlay();
    } else {
      setPlaying(false);
    }
  }, [src, autoPlay]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play();
    setPlaying(!playing);
  };

  const seek = (v) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = v;
    setCur(v);
  };

  return (
    <div className="rounded-2xl p-4 bg-white/5 border border-white/10 space-y-3">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="h-12 w-12 grid place-items-center rounded-full bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
        >
          {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>

        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>{formatTime(cur)}</span>
            <span>{formatTime(dur)}</span>
          </div>

          <input
            type="range"
            min="0"
            max={dur || 0}
            value={cur}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={vol}
            onChange={(e) => setVol(Number(e.target.value))}
            className="w-24 accent-emerald-400"
          />
        </div>
      </div>
    </div>
  );
}
