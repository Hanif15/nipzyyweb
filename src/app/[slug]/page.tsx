import { redirect, notFound } from "next/navigation";
import { getLinkBySlug, incrementClicks, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Named routes that should NOT be treated as short links
const RESERVED_SLUGS = new Set(["blog", "design", "publications", "product", "tools", "api"]);

export default async function SlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Skip reserved routes
  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }

  // Only attempt redirect if Supabase is configured
  if (isSupabaseConfigured()) {
    const link = await getLinkBySlug(slug);
    if (link) {
      await incrementClicks(slug);
      redirect(link.original_url || link.originalUrl || "/");
    }
  }

  // Not found — show 404
  notFound();
}
