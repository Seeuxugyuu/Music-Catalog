// src/services/api.js
import { supabase } from "./supabase";

/**
 * =========================================================
 * AUTH
 * =========================================================
 */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const onAuthChange = (cb) =>
  supabase.auth.onAuthStateChange((_event, session) => cb(session));

/**
 * =========================================================
 * STORAGE HELPERS
 * Buckets kamu: "covers" & "audios" (public)
 * =========================================================
 */
export const uploadCover = async (file, userId) => {
  if (!file) return null;

  const ext = file.name.split(".").pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("covers")
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("covers").getPublicUrl(fileName);
  return data.publicUrl;
};

export const uploadAudio = async (file, userId) => {
  if (!file) return null;

  const ext = file.name.split(".").pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("audios")
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("audios").getPublicUrl(fileName);
  return data.publicUrl;
};

/**
 * =========================================================
 * TRACKS
 * =========================================================
 */
export const getTracks = async () => {
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getTrack = async (id) => {
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createTrack = async (payload) => {
  // payload: { title, artist, cover_url, audio_url }
  const { data, error } = await supabase
    .from("tracks")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTrack = async (id) => {
  const { error } = await supabase.from("tracks").delete().eq("id", id);
  if (error) throw error;
};

/**
 * =========================================================
 * FAVORITES
 * =========================================================
 */
export const getFavorites = async (userId) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("track_id")
    .eq("user_id", userId);

  if (error) throw error;
  return (data || []).map((x) => x.track_id);
};

export const getFavoriteTracks = async (userId) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("tracks(*)")
    .eq("user_id", userId);

  if (error) throw error;

  return (data || []).map((row) => row.tracks).filter(Boolean);
};

export const toggleFavorite = async (userId, trackId) => {
  const { data: existing, error: e1 } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .maybeSingle();

  if (e1) throw e1;

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase.from("favorites").insert({
      user_id: userId,
      track_id: trackId,
    });
    if (error) throw error;
    return true;
  }
};

/**
 * =========================================================
 * PLAYLISTS
 * =========================================================
 */
export const getPlaylists = async (userId) => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createPlaylist = async (userId, name) => {
  const { data, error } = await supabase
    .from("playlists")
    .insert({ user_id: userId, name })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePlaylist = async (playlistId) => {
  await supabase.from("playlist_tracks").delete().eq("playlist_id", playlistId);

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId);

  if (error) throw error;
};

export const getPlaylistTracks = async (playlistId) => {
  const { data, error } = await supabase
    .from("playlist_tracks")
    .select("track_id, tracks(*)")
    .eq("playlist_id", playlistId);

  if (error) throw error;

  return (data || []).map((row) => row.tracks).filter(Boolean);
};

export const addTrackToPlaylist = async (playlistId, trackId) => {
  const { error } = await supabase.from("playlist_tracks").insert({
    playlist_id: playlistId,
    track_id: trackId,
  });
  if (error) throw error;
};

export const removeTrackFromPlaylist = async (playlistId, trackId) => {
  const { error } = await supabase
    .from("playlist_tracks")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("track_id", trackId);

  if (error) throw error;
};

/**
 * =========================================================
 * PROFILES
 * =========================================================
 */
export const ensureProfile = async (user) => {
  if (!user?.id) return null;

  const { data: existing, error: e0 } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (e0 && e0.code !== "PGRST116") throw e0;

  if (existing) return existing;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      email: user.email,
      avatar_url: null,
      bio: "",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const uploadAvatar = async (file, userId) => {
  if (!file) return null;

  const ext = file.name.split(".").pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
  return data.publicUrl;
};

export const updateProfile = async (userId, payload) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
