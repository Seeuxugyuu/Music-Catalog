import { useNavigate } from "react-router-dom";
import { usePlayer } from "../context/PlayerProvider";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";

function formatTime(s = 0) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function MiniPlayer() {
  const nav = useNavigate();
  const {
    currentTrack,
    playing,
    toggle,
    hasNext,
    hasPrev,
    next,
    prev,
    cur,
    dur,
    seek,
    vol,
    setVol,
    setQueue,
    queue,
  } = usePlayer();

  if (!currentTrack) return null;

  const closePlayer = () => {
    // stop & clear queue
    setQueue([], 0);
  };

  return (
    <div className="fixed left-3 bottom-24 z-50 w-[320px] max-w-[92vw] rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur p-3 shadow-xl">
      <div className="flex gap-3">
        <img
          src={currentTrack.cover}
          alt=""
          onClick={() => nav(`/tracks/${currentTrack.id}`)}
          className="h-16 w-16 rounded-xl object-cover border border-white/10 cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          <div
            className="font-semibold truncate cursor-pointer"
            onClick={() => nav(`/tracks/${currentTrack.id}`)}
          >
            {currentTrack.title}
          </div>
          <div className="text-xs text-slate-400 truncate">
            {currentTrack.artist}
          </div>

          {/* progress */}
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max={dur || 0}
              value={cur}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{formatTime(cur)}</span>
              <span>{formatTime(dur)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={closePlayer}
          className="h-7 w-7 grid place-items-center rounded-lg hover:bg-white/10 text-slate-400"
          title="Tutup player"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* controls */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            disabled={!hasPrev}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={toggle}
            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            onClick={next}
            disabled={!hasNext}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* volume */}
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={vol}
            onChange={(e) => setVol(Number(e.target.value))}
            className="w-20 accent-emerald-400"
          />
        </div>
      </div>
    </div>
  );
}
