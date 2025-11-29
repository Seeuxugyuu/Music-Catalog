import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTrack,
  getPlaylists,
  addTrackToPlaylist,
} from "../services/api";
import { useAuth } from "../context/AuthProvider";
import { Plus, SkipBack, SkipForward } from "lucide-react";
import { usePlayer } from "../context/PlayerProvider";

export default function TrackDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const {
    queue,
    currentIndex,
    currentTrack,
    hasNext,
    hasPrev,
    jumpTo,
    cur,
    dur,
    seek,
  } = usePlayer();

  const [track, setTrack] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showPick, setShowPick] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getTrack(id).then(setTrack);
    getPlaylists(user.id).then(setPlaylists);
  }, [id, user.id]);

  // sync URL kalau currentTrack dari queue berubah
  useEffect(() => {
    if (currentTrack && currentTrack.id !== id) {
      nav(`/tracks/${currentTrack.id}`, { replace: true });
    }
  }, [currentTrack, id, nav]);

  const addToPlaylist = async (playlistId) => {
    try {
      setAdding(true);
      await addTrackToPlaylist(playlistId, track.id);
      alert("Lagu ditambahkan ke playlist!");
      setShowPick(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const goNext = () => {
    if (!hasNext) return;
    const targetIndex = currentIndex + 1;
    const target = queue[targetIndex];
    if (!target) return;

    jumpTo(targetIndex);
    nav(`/tracks/${target.id}`);
  };

  const goPrev = () => {
    if (!hasPrev) return;
    const targetIndex = currentIndex - 1;
    const target = queue[targetIndex];
    if (!target) return;

    jumpTo(targetIndex);
    nav(`/tracks/${target.id}`);
  };

  if (!track) return <div className="p-4 text-slate-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <img
        src={track.cover}
        alt=""
        className="w-full h-64 object-cover rounded-3xl border border-white/10"
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{track.title}</h1>
        <p className="text-slate-400">
          {track.artist} {track.album ? `• ${track.album}` : ""}{" "}
          {track.year ? `• ${track.year}` : ""}
        </p>
      </div>

      {track.description && (
        <p className="text-slate-200">{track.description}</p>
      )}

      {/* progress bar (ngikut audio global) */}
      {currentTrack?.id === track.id && (
        <div className="rounded-2xl p-3 bg-white/5 border border-white/10 space-y-1">
          <input
            type="range"
            min="0"
            max={dur || 0}
            value={cur}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{Math.floor(cur / 60)}:{String(Math.floor(cur % 60)).padStart(2,"0")}</span>
            <span>{Math.floor(dur / 60)}:{String(Math.floor(dur % 60)).padStart(2,"0")}</span>
          </div>
        </div>
      )}

      {/* Prev / Next Controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40"
        >
          <SkipBack className="h-5 w-5" />
          Prev
        </button>

        <button
          onClick={goNext}
          disabled={!hasNext}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40"
        >
          Next
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      {/* Add to playlist */}
      <button
        onClick={() => setShowPick(true)}
        className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-sky-500/20 text-sky-200 hover:bg-sky-500/30 font-semibold"
      >
        <Plus className="h-4 w-4" />
        Tambah ke Playlist
      </button>

      {/* Modal pilih playlist */}
      {showPick && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/10 p-4 space-y-3">
            <div className="font-semibold">Pilih Playlist</div>

            {playlists.length === 0 && (
              <div className="text-sm text-slate-400">
                Kamu belum punya playlist.
              </div>
            )}

            <div className="space-y-2 max-h-72 overflow-auto">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToPlaylist(p.id)}
                  disabled={adding}
                  className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50"
                >
                  {p.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPick(false)}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
