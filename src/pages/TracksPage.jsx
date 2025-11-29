import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrackCard from "../components/TrackCard";
import { getFavorites, getTracks, toggleFavorite } from "../services/api";
import { useAuth } from "../context/AuthProvider";
import { usePlayer } from "../context/PlayerProvider";

export default function TracksPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { setQueue } = usePlayer();

  const [tracks, setTracks] = useState([]);
  const [favIds, setFavIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [allTracks, ids] = await Promise.all([
          getTracks(),
          getFavorites(user.id),
        ]);
        setTracks(allTracks);
        setFavIds(ids);
        setPage(1);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.id]);

  const totalPages = Math.max(1, Math.ceil(tracks.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return tracks.slice(start, start + PAGE_SIZE);
  }, [tracks, page]);

  const onToggleFavorite = async (trackId) => {
    const nowFav = await toggleFavorite(user.id, trackId);
    setFavIds((arr) =>
      nowFav ? [...arr, trackId] : arr.filter((x) => x !== trackId)
    );
  };

  const onOpenTrack = (trackId) => {
    const index = tracks.findIndex((t) => t.id === trackId);
    setQueue(tracks, Math.max(0, index));
    nav(`/tracks/${trackId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Daftar Lagu</h1>
        <button
          onClick={() => nav("/upload")}
          className="px-3 py-2 text-xs rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
        >
          + Tambah Lagu
        </button>
      </div>

      {loading && (
        <div className="text-sm text-slate-400">Loading lagu...</div>
      )}

      {!loading && tracks.length === 0 && (
        <div className="text-sm text-slate-400">
          Belum ada lagu. Klik “Tambah Lagu” untuk mulai.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {pageItems.map((t) => (
          <TrackCard
            key={t.id}
            track={t}
            onOpen={onOpenTrack}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favIds.includes(t.id)}
          />
        ))}
      </div>

      {tracks.length > PAGE_SIZE && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-lg border text-sm font-semibold
                ${
                  p === page
                    ? "bg-emerald-500/25 border-emerald-400/30 text-emerald-100"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
