import { Redis } from "@upstash/redis";

// Inisialisasi Redis dari environment variables
// KV_REST_API_URL dan KV_REST_API_TOKEN diset di Vercel dashboard
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

export interface ShortLink {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

const LINKS_KEY = "nipzyy:short_links";

export async function getAllLinks(): Promise<ShortLink[]> {
  const r = getRedis();
  if (!r) return [];
  try {
    const data = await r.get<ShortLink[]>(LINKS_KEY);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function saveLinks(links: ShortLink[]): Promise<void> {
  const r = getRedis();
  if (!r) return;
  await r.set(LINKS_KEY, links);
}

export async function getLinkBySlug(slug: string): Promise<ShortLink | null> {
  const links = await getAllLinks();
  return links.find((l) => l.slug === slug) ?? null;
}

export async function createLink(slug: string, originalUrl: string): Promise<ShortLink> {
  const links = await getAllLinks();
  const newLink: ShortLink = {
    id: Date.now().toString(),
    slug,
    originalUrl,
    shortUrl: `https://nipzyy.my.id/${slug}`,
    createdAt: new Date().toISOString().split("T")[0],
    clicks: 0,
  };
  // Max 10 links — remove oldest if over limit
  const updated = [newLink, ...links].slice(0, 10);
  await saveLinks(updated);
  return newLink;
}

export async function incrementClicks(slug: string): Promise<void> {
  const links = await getAllLinks();
  const updated = links.map((l) =>
    l.slug === slug ? { ...l, clicks: l.clicks + 1 } : l
  );
  await saveLinks(updated);
}

export function isRedisConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}
