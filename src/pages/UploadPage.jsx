// src/pages/UploadPage.jsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadCover, uploadAudio, createTrack } from "../services/api";
import { useAuth } from "../context/AuthProvider";

export default function UploadPage() {
  const nav = useNavigate();
  const { user } = useAuth();

  const coverInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onPickCover = (file) => {
    setCoverFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    } else {
      setCoverPreview(null);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !audioFile) {
      alert("Judul, penyanyi, dan file audio wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      // upload ke storage
      const coverUrl = await uploadCover(coverFile, user.id);
      const audioUrl = await uploadAudio(audioFile, user.id);

      console.log("coverUrl:", coverUrl);
      console.log("audioUrl:", audioUrl);

      const payload = {
        title: title.trim(),
        artist: artist.trim(),
        cover_url: coverUrl,
        audio_url: audioUrl,
      };

      console.log("payload insert:", payload);

      const inserted = await createTrack(payload);
      console.log("inserted:", inserted);

      alert("Lagu berhasil ditambah!");
      nav("/tracks");
    } catch (err) {
      console.error("UPLOAD/INSERT ERROR =>", err);
      alert(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <button
        onClick={() => nav(-1)}
        className="text-xs text-slate-400 hover:text-white"
        type="button"
      >
        ← Kembali
      </button>

      <h1 className="text-xl font-bold">Tambah Lagu</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* COVER */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Cover / Foto</label>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickCover(e.target.files?.[0] || null)}
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm"
            >
              Pilih Cover
            </button>

            <span className="text-xs text-slate-300 truncate">
              {coverFile ? coverFile.name : "Belum ada file"}
            </span>
          </div>

          {coverPreview && (
            <img
              src={coverPreview}
              alt="preview"
              className="w-28 h-28 rounded-xl object-cover border border-white/10"
            />
          )}
        </div>

        {/* TITLE */}
        <div>
          <label className="text-sm text-slate-300">Judul lagu</label>
          <input
            className="w-full p-2 rounded-xl bg-black/30 border border-white/10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul..."
          />
        </div>

        {/* ARTIST */}
        <div>
          <label className="text-sm text-slate-300">Penyanyi / Artist</label>
          <input
            className="w-full p-2 rounded-xl bg-black/30 border border-white/10"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Masukkan penyanyi..."
          />
        </div>

        {/* AUDIO */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300">
            File Audio (mp3/m4a)
          </label>

          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => audioInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm"
            >
              Pilih Audio
            </button>

            <span className="text-xs text-slate-300 truncate">
              {audioFile ? audioFile.name : "Belum ada file"}
            </span>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 font-semibold disabled:opacity-50"
          type="submit"
        >
          {loading ? "Mengupload..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
