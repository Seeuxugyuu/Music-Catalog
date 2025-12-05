// src/components/TrackCard.jsx
import React from "react";
// Import Trash2 dan Heart dari lucide-react
import { Play, Trash2, Heart } from "lucide-react"; 

/**
 * TrackCard
 * - Wrapper pakai <div> (BUKAN button) supaya tidak ada nested button error.
 * - Action buttons stopPropagation biar kliknya gak ikut onOpen.
 * - onOpen / onPlay / onAddToPlaylist / onDelete dikirim track.id sebagai argumen pertama
 * (argumen kedua track object, opsional).
 */
export default function TrackCard({
  track,
  onOpen,            // klik card -> buka detail
  onPlay,            // klik play
  onToggleFavorite,  // klik heart
  isFavorite,
  onAddToPlaylist,   // klik plus playlist
  onDelete,          // opsional
  showActions = true
}) {
  const cover =
    // FIX IMAGE: Gunakan track.cover atau track.cover_url
    track?.cover ||
    track?.cover_url ||
    "https://placehold.co/96x96/png?text=Cover";

  return (
    <div
      onClick={() => onOpen?.(track.id, track)}
      className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
      role="button"
    >
      {/* kiri: cover + info */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={cover}
          alt={track?.title || "cover"}
          className="w-12 h-12 rounded-xl object-cover bg-slate-800"
        />
        <div className="min-w-0">
          <p className="font-semibold truncate">
            {track?.title || "Untitled"}
          </p>
          <p className="text-sm text-slate-300 truncate">
            {track?.artist || "Unknown artist"}
          </p>
        </div>
      </div>

      {/* kanan: actions */}
      {showActions && (
        <div className="flex items-center gap-2 shrink-0">
          {/* ✅ Play (icon sama kayak playlist) */}
          {onPlay && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.(track.id, track);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition text-slate-200"
              title="Play"
              type="button"
            >
              <Play className="h-4 w-4" />
            </button>
          )}

          {/* Add to playlist */}
          {onAddToPlaylist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToPlaylist?.(track.id, track);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              title="Tambah ke playlist"
              type="button"
            >
              <span className="text-lg">➕</span>
            </button>
          )}

          {/* Favorite - DIGANTI DENGAN ICON LUCIDE HEART */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(track.id);
              }}
              // Tailwind class menentukan warna icon saat aktif/tidak aktif
              className={`p-2 rounded-lg hover:bg-white/10 transition ${
                isFavorite ? "text-rose-400" : "text-slate-300"
              }`}
              title="Favorit"
              type="button"
            >
              {/* Menggunakan Lucide Heart.
                  Ketika isFavorite, kita tambahkan class 'fill-current'
                  agar icon terisi (filled) dengan warna dari parent ('text-rose-400'). */}
              <Heart 
                className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} 
              />
            </button>
          )}

          {/* Delete (opsional) - DIGANTI DENGAN ICON LUCIDE TRASH2 */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(track.id, track);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition text-rose-300 hover:text-rose-400"
              title="Hapus"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
