import { useEffect, useMemo, useState } from "react";
import { getTracks } from "../services/api";
import { Link } from "react-router-dom";
import { Sparkles, Music2, ChevronLeft, ChevronRight } from "lucide-react";
import { usePlayer } from "../context/PlayerProvider"; // Import usePlayer untuk refreshKey

export default function HomePage() {
  const { refreshKey } = usePlayer(); // Ambil refreshKey
  const [tracks, setTracks] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    // Tambahkan refreshKey agar data me-reload jika ada lagu baru diupload
    getTracks().then((t) => setTracks(t));
  }, [refreshKey]);

  const totalPages = Math.max(1, Math.ceil(tracks.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return tracks.slice(start, start + PAGE_SIZE);
  }, [tracks, page]);

  const next = () => setPage((p) => Math.min(totalPages, p + 1));
  const prev = () => setPage((p) => Math.max(1, p - 1));

  return (
    // FIX SCROLL: Tambahkan pb-24 untuk memberi ruang BottomNav
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      {/* HERO / PESAN MENGAMBANG + GRADASI GERAK */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 p-6 hero-animated-gradient">
        {/* glow blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />

        {/* floating chip */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-200 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
          Music Catalog PWA
        </div>

        <div className="mt-4 space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Selamat datang 👋
          </h1>
          <p className="text-slate-200/90 leading-relaxed max-w-2xl">
            Disini anda dapat berkreasi terhadap musik yang anda miliki.
            Kelola katalog lagu, buat playlist favoritmu, dan nikmati musik kapan saja.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/tracks"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 px-4 py-2 text-sm font-semibold border border-emerald-400/20"
          >
            <Music2 className="h-4 w-4" />
            Jelajahi Lagu
          </Link>
          <Link
            to="/playlists"
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-100 px-4 py-2 text-sm font-semibold border border-white/10"
          >
            Buat Playlist
          </Link>
        </div>
      </section>

      {/* TERBARU + PAGINATION 5/halaman */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Terbaru</h2>
          <Link className="text-xs text-emerald-300" to="/tracks">
            Lihat semua
          </Link>
        </div>

        {pageItems.map((t) => (
          <Link
            key={t.id}
            to={`/tracks/${t.id}`}
            className="block p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
          >
            <div className="font-semibold truncate">{t.title}</div>
            <div className="text-sm text-slate-400 truncate">{t.artist}</div>
          </Link>
        ))}

        {!tracks.length && (
          <div className="text-sm text-slate-400">
            Belum ada lagu. Tambahkan lagu dulu ya.
          </div>
        )}

        {/* Pagination controls */}
        {tracks.length > PAGE_SIZE && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={prev}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <div className="text-xs text-slate-400">
              Halaman {page} / {totalPages}
            </div>

            <button
              onClick={next}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
