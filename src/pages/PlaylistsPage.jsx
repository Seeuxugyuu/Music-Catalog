// src/pages/PlaylistsPage.jsx
import { useEffect, useState } from "react";
import {
  createPlaylist,
  deletePlaylist,
  getPlaylists,
  getPlaylistTracks,
} from "../services/api";
import { useAuth } from "../context/AuthProvider";
import { Plus, Trash2, X, ChevronRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../context/PlayerProvider";

export default function PlaylistsPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { setQueue } = usePlayer();

  const [playlists, setPlaylists] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    getPlaylists(user.id).then(setPlaylists);
  }, [user.id]);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      const p = await createPlaylist(user.id, name.trim());
      setPlaylists((arr) => [p, ...arr]);
      setName("");
      setOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (playlistId) => {
    const ok = confirm("Hapus playlist ini?");
    if (!ok) return;
    try {
      await deletePlaylist(playlistId);
      setPlaylists((arr) => arr.filter((p) => p.id !== playlistId));
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ tombol play playlist
  const onPlayPlaylist = async (playlistId) => {
    try {
      setPlayingId(playlistId);

      const tracks = await getPlaylistTracks(playlistId);

      if (!tracks.length) {
        alert("Playlist ini masih kosong.");
        return;
      }

      // set queue = hanya lagu playlist itu
      setQueue(tracks, 0);

      // masuk ke detail lagu pertama (biar langsung kebuka playernya)
      nav(`/tracks/${tracks[0].id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setPlayingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Playlist</h1>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
        >
          <Plus className="h-4 w-4" />
          Playlist
        </button>
      </div>

      {/* LIST PLAYLIST clickable */}
      {playlists.map((p) => (
        <div
          key={p.id}
          onClick={() => nav(`/playlists/${p.id}`)}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-left cursor-pointer"
          role="button"
        >
          <div className="min-w-0">
            <div className="font-semibold truncate">{p.name}</div>
            <div className="text-xs text-slate-400">
              Dibuat: {new Date(p.created_at).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* ✅ PLAY BUTTON (kiri) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayPlaylist(p.id);
              }}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-emerald-300"
              title="Play playlist"
              disabled={playingId === p.id}
              type="button"
            >
              <Play className="h-4 w-4" />
            </button>

            {/* DELETE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(p.id);
              }}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-rose-300"
              title="Hapus"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      ))}

      {!playlists.length && (
        <div className="text-sm text-slate-400">Belum ada playlist.</div>
      )}

      {/* MODAL CREATE PLAYLIST */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Buat Playlist</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={onCreate} className="mt-3 space-y-3">
              <input
                className="w-full p-2 rounded-xl bg-black/30 border border-white/10"
                placeholder="Nama playlist..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />

              <button
                disabled={saving}
                className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 font-semibold disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
