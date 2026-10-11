import { NextRequest, NextResponse } from "next/server";
import { getLinkBySlug, incrementClicks, isRedisConfigured } from "@/lib/redis";

// POST /api/redirect — catat klik dan kembalikan URL tujuan
export async function POST(req: NextRequest) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  }
  const { slug } = await req.json() as { slug: string };
  const link = await getLinkBySlug(slug);
  if (!link) {
    return NextResponse.json({ error: "Link tidak ditemukan." }, { status: 404 });
  }
  await incrementClicks(slug);
  return NextResponse.json({ url: link.originalUrl });
}
