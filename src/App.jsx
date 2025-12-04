import { Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";
import MiniPlayer from "./components/MiniPlayer";
import { useAuth } from "./context/AuthProvider"; // Import useAuth

import HomePage from "./pages/HomePage";
import TracksPage from "./pages/TracksPage";
import TrackDetailPage from "./pages/TrackDetailPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import PlaylistDetailPage from "./pages/PlaylistDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  // Ambil state otentikasi
  const { user, loading } = useAuth();
  
  // Jangan render apa pun (termasuk navbar) saat loading
  if (loading) return null;

  // Cek apakah user sudah login
  const isAuthenticated = !!user;

  return (
    // FIX SCROLL: Hapus 'pb-20'. BottomNav akan muncul hanya saat login.
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        {/* Halaman yang TIDAK memerlukan proteksi (Login/Register) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Semua halaman yang DIPROTEKSI */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tracks"
          element={
            <ProtectedRoute>
              <TracksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracks/:id"
          element={
            <ProtectedRoute>
              <TrackDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <PlaylistsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlists/:id"
          element={
            <ProtectedRoute>
              <PlaylistDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* FIX NAVBAR: Tampilkan MiniPlayer dan BottomNav HANYA jika isAuthenticated */}
      {isAuthenticated && (
        <>
          <MiniPlayer />
          <BottomNav />
        </>
      )}
    </div>
  );
}
