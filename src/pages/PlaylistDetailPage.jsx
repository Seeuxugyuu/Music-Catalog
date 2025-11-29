// src/pages/PlaylistDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPlaylistTracks,
  removeTrackFromPlaylist,
} from "../services/api";
import { Trash2 } from "lucide-react";

export default function PlaylistDetailPage() {
  const { id } = useParams(); // playlist id
  const nav = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getPlaylistTracks(id);
      setTracks(data);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onRemove = async (trackId) => {
    const ok = confirm("Hapus lagu dari playlist?");
    if (!ok) return;
    try {
      await removeTrackFromPlaylist(id, trackId);
      setTracks((arr) => arr.filter((t) => t.id !== trackId));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-slate-300">Loading...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-3">
      <button
        onClick={() => nav(-1)}
        className="text-xs text-slate-400 hover:text-white"
      >
        ← Kembali
      </button>

      <h1 className="text-xl font-bold">Isi Playlist</h1>

      {tracks.map((t) => (
        <div
          key={t.id}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
        >
          {/* klik ke detail track HARUS pakai t.id */}
          <button
            onClick={() => nav(`/tracks/${t.id}`)}
            className="text-left flex-1"
          >
            <div className="font-semibold">{t.title}</div>
            <div className="text-xs text-slate-400">{t.artist}</div>
          </button>

          <button
            onClick={() => onRemove(t.id)}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-rose-300"
            title="Hapus dari playlist"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {!tracks.length && (
        <div className="text-sm text-slate-400">
          Belum ada lagu di playlist ini.
        </div>
      )}
    </div>
  );
}
