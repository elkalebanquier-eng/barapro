import { createClient } from "@supabase/supabase-js";

/** Public browser configuration only. Never place service_role or Cloudinary API secrets here. */
// These are publishable browser values, safe to expose in the frontend. Private service_role keys never belong here.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://liguztacbckbfkpxukpz.supabase.co";
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "sb_publishable__WiTUxno84SJFwxmbhM5gg_aDzsB66u";

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "",
};

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
export const isSupabaseConfigured = Boolean(supabase);
export const isCloudinaryConfigured = Object.values(cloudinaryConfig).every(Boolean);

export const integrationStatus = {
  supabase: isSupabaseConfigured ? "ready" : "not-configured",
  cloudinary: isCloudinaryConfigured ? "ready" : "not-configured",
  payments: "not-connected",
} as const;

export async function uploadImageToCloudinary(file: File, folder = "devconnect") {
  if (!isCloudinaryConfigured) throw new Error("Cloudinary n'est pas encore configuré.");
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", cloudinaryConfig.uploadPreset);
  body.append("folder", folder);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, { method: "POST", body });
  if (!response.ok) throw new Error("L'image n'a pas pu être envoyée à Cloudinary.");
  return response.json() as Promise<{ secure_url: string; public_id: string; width: number; height: number }>;
}

export async function createProfile(profile: { id: string; role: "client" | "developer"; full_name: string; username?: string; avatar_url?: string; bio?: string; country?: string; skills?: string[]; availability?: string }) {
  if (!supabase) throw new Error("Supabase n'est pas encore configuré.");
  const { data, error } = await supabase.from("profiles").upsert(profile).select("id, role, full_name, username, avatar_url").limit(1).single();
  if (error) throw error;
  return data;
}

export async function createProject(project: { client_id: string; title: string; slug: string; description: string; category: string; budget_min: number | null; budget_max: number | null; currency: string; status: string; deadline: string | null }) {
  if (!supabase) throw new Error("Supabase n\'est pas encore configuré.");
  const { data, error } = await supabase.from("projects").insert(project).select("id, title, slug, status").limit(1).single();
  if (error) throw error;
  return data;
}
export async function uploadProfilePhoto(userId: string, file: File) {
  if (!supabase) throw new Error("Supabase n'est pas encore configuré.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/avatar-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (error) throw error;
  return supabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
}
