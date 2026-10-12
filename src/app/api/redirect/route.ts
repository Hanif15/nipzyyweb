import { NextRequest, NextResponse } from "next/server";
import { getLinkBySlug, incrementClicks, isSupabaseConfigured } from "@/lib/supabase";

// POST /api/redirect — catat klik dan kembalikan URL tujuan dari Supabase
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { slug } = (await req.json()) as { slug: string };
  const link = await getLinkBySlug(slug);

  if (!link) {
    return NextResponse.json({ error: "Link tidak ditemukan." }, { status: 404 });
  }

  await incrementClicks(slug);
  return NextResponse.json({ url: link.original_url || link.originalUrl });
}
