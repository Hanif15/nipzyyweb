import { redirect, notFound } from "next/navigation";
import { getLinkBySlug, incrementClicks, isRedisConfigured } from "@/lib/redis";

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

  // Only attempt redirect if Redis is configured
  if (isRedisConfigured()) {
    const link = await getLinkBySlug(slug);
    if (link) {
      await incrementClicks(slug);
      redirect(link.originalUrl);
    }
  }

  // Not found — show 404
  notFound();
}
