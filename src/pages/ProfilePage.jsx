// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import {
  ensureProfile,
  getProfile,
  uploadAvatar,
  updateProfile,
  signOut,
} from "../services/api";

export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      try {
        setLoading(true);

        // pastikan row profile ada (auto-create)
        await ensureProfile(user);

        // ambil profilnya
        const p = await getProfile(user.id);
        setProfile(p);
        setBio(p?.bio || "");
      } catch (e) {
        console.error(e);
        alert(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);

      let avatar_url = profile?.avatar_url || null;

      // kalau user pilih file baru, upload dulu
      if (avatarFile) {
        avatar_url = await uploadAvatar(avatarFile, user.id);
      }

      const updated = await updateProfile(user.id, {
        bio: bio?.trim() || "",
        avatar_url,
      });

      setProfile(updated);
      setAvatarFile(null);
      alert("Profil berhasil disimpan ✅");
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onLogout = async () => {
    const ok = confirm("Keluar dari akun?");
    if (!ok) return;
    try {
      await signOut();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="text-sm text-slate-400">Loading profil...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Profil</h1>

      <form onSubmit={onSave} className="space-y-4">
        {/* Header: avatar + email */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <img
            src={
              profile?.avatar_url ||
              "https://placehold.co/120x120/png?text=AV"
            }
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border border-white/10 bg-slate-800"
          />

          <div className="space-y-2">
            <div className="text-sm text-slate-300">Email</div>
            <div className="font-semibold break-all">{user?.email}</div>

            {/* input file disembunyikan */}
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={onPickAvatar}
              className="hidden"
            />

            {/* tombol custom pilih file */}
            <label
              htmlFor="avatar-input"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-xl
                         bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30
                         border border-emerald-400/20 cursor-pointer"
            >
              {avatarFile ? "Ganti Foto" : "Pilih Foto"}
            </label>

            {avatarFile && (
              <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                {avatarFile.name}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tulis bio kamu..."
            className="w-full p-3 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-emerald-400/40"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 font-semibold disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}
