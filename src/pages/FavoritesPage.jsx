// src/pages/FavoritesPage.jsx
import { useEffect, useState } from "react";
import TrackCard from "../components/TrackCard";
import { getFavoriteTracks, toggleFavorite } from "../services/api";
import { useAuth } from "../context/AuthProvider";
import { usePlayer } from "../context/PlayerProvider";

export default function FavoritesPage() {
  const { user } = useAuth();
  const { setQueue } = usePlayer();

  const [tracks, setTracks] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFav() {
      try {
        setLoading(true);
        const favTracks = await getFavoriteTracks(user.id);
        setTracks(favTracks);
        setLikedIds(favTracks.map((t) => t.id));
      } catch (e) {
        console.error(e);
        alert(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadFav();
  }, [user.id]);

  // klik card => langsung play dari lagu yang diklik
  const onOpenTrack = (trackId) => {
    const index = tracks.findIndex((t) => t.id === trackId);
    setQueue(tracks, Math.max(0, index));
  };

  // klik tombol play di kanan => sama aja, play dari yang diklik
  const onPlayTrack = (trackId) => {
    const index = tracks.findIndex((t) => t.id === trackId);
    setQueue(tracks, Math.max(0, index));
  };

  const onToggleFavorite = async (trackId) => {
    const isLiked = likedIds.includes(trackId);

    try {
      const nowLiked = await toggleFavorite(user.id, trackId);

      // update state lokal
      setLikedIds((arr) =>
        nowLiked ? [...arr, trackId] : arr.filter((x) => x !== trackId)
      );

      // kalau di-unfavorite, langsung ilang dari list favorit
      if (!nowLiked) {
        setTracks((arr) => arr.filter((t) => t.id !== trackId));
      }
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-3">
      <h1 className="text-xl font-bold">Favorit</h1>

      {loading && (
        <div className="text-sm text-slate-400">Loading favorit...</div>
      )}

      {!loading && tracks.length === 0 && (
        <div className="text-sm text-slate-400">Belum ada favorit.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tracks.map((t) => (
          <TrackCard
            key={t.id}
            track={t}
            onOpen={onOpenTrack}
            onPlay={onPlayTrack}
            onToggleFavorite={onToggleFavorite}
            isFavorite={likedIds.includes(t.id)}
            onAddToPlaylist={null}
            onDelete={null}
            showActions={true}
          />
        ))}
      </div>
    </div>
  );
}
