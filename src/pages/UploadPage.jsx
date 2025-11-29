// src/pages/UploadPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadCover, uploadAudio, createTrack } from "../services/api";
import { useAuth } from "../context/AuthProvider";

export default function UploadPage() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !audioFile) {
      alert("Judul, penyanyi, dan file audio wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      // upload ke storage
      const cover_url = await uploadCover(coverFile, user.id);
      const audio_url = await uploadAudio(audioFile, user.id);

      // insert ke table tracks (TANPA user_id)
      await createTrack({
        title: title.trim(),
        artist: artist.trim(),
        cover_url,
        audio_url,
      });

      nav("/tracks");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <button
        onClick={() => nav(-1)}
        className="text-xs text-slate-400 hover:text-white"
      >
        ← Kembali
      </button>

      <h1 className="text-xl font-bold">Tambah Lagu</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-slate-300">Cover / Foto</label>
          <input
            type="file"
            accept="image/*"
            className="block w-full mt-1 text-sm"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Judul lagu</label>
          <input
            className="w-full p-2 rounded-xl bg-black/30 border border-white/10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul..."
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Penyanyi / Artist</label>
          <input
            className="w-full p-2 rounded-xl bg-black/30 border border-white/10"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Masukkan penyanyi..."
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">
            File Audio (mp3/m4a)
          </label>
          <input
            type="file"
            accept="audio/*"
            className="block w-full mt-1 text-sm"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 font-semibold disabled:opacity-50"
        >
          {loading ? "Mengupload..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
