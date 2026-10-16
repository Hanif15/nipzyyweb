import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  supabase = createClient(url, key, {
    auth: { persistSession: false },
  });
  return supabase;
}

export interface ShortLink {
  id: string;
  slug: string;
  original_url: string;
  originalUrl?: string; // alias helper for frontend compatibility
  created_at: string;
  createdAt?: string;   // alias helper for frontend compatibility
  clicks: number;
}

export function isSupabaseConfigured(): boolean {
  return !!(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY)
  );
}

/**
 * Get up to 10 latest short links sorted by creation date descending
 */
export async function getAllLinks(): Promise<ShortLink[]> {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("short_links")
      .select("id, slug, original_url, clicks, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !data) {
      console.error("Supabase getAllLinks error:", error?.message);
      return [];
    }

    return data.map((item) => ({
      id: String(item.id),
      slug: item.slug,
      original_url: item.original_url,
      originalUrl: item.original_url,
      createdAt: item.created_at ? item.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      created_at: item.created_at,
      clicks: item.clicks || 0,
    }));
  } catch (err) {
    console.error("getAllLinks error:", err);
    return [];
  }
}

/**
 * Find short link by custom slug
 */
export async function getLinkBySlug(slug: string): Promise<ShortLink | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("short_links")
      .select("id, slug, original_url, clicks, created_at")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: String(data.id),
      slug: data.slug,
      original_url: data.original_url,
      originalUrl: data.original_url,
      created_at: data.created_at,
      createdAt: data.created_at ? data.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      clicks: data.clicks || 0,
    };
  } catch {
    return null;
  }
}

/**
 * Create a new short link in Supabase
 */
export async function createLink(slug: string, originalUrl: string): Promise<ShortLink> {
  const client = getSupabase();
  if (!client) throw new Error("Supabase is not configured");

  const { data, error } = await client
    .from("short_links")
    .insert([
      {
        slug,
        original_url: originalUrl,
        clicks: 0,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create short link in Supabase");
  }

  return {
    id: String(data.id),
    slug: data.slug,
    original_url: data.original_url,
    originalUrl: data.original_url,
    created_at: data.created_at,
    createdAt: data.created_at ? data.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
    clicks: data.clicks || 0,
  };
}

/**
 * Increment click counter for a slug
 */
export async function incrementClicks(slug: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  try {
    const existing = await getLinkBySlug(slug);
    if (!existing) return;

    await client
      .from("short_links")
      .update({ clicks: (existing.clicks || 0) + 1 })
      .eq("slug", slug);
  } catch (err) {
    console.error("incrementClicks error:", err);
  }
}

/**
 * Delete a short link by id or slug
 */
export async function deleteLink(idOrSlug: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) throw new Error("Supabase is not configured");

  // Determine if id is numeric id or slug
  const isNumeric = /^\d+$/.test(idOrSlug);
  let query = client.from("short_links").delete();

  if (isNumeric) {
    query = query.eq("id", Number(idOrSlug));
  } else {
    query = query.eq("slug", idOrSlug);
  }

  const { data, error } = await query.select();
  if (error) {
    console.error("deleteLink error:", error);
    throw new Error(error.message || "Gagal menghapus link dari database.");
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Gagal menghapus link. Kebijakan RLS (Row Level Security) 'delete' belum diaktifkan di Supabase SQL Editor."
    );
  }

  return true;
}
