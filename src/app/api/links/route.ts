import { NextRequest, NextResponse } from "next/server";
import { getAllLinks, createLink, isRedisConfigured } from "@/lib/redis";

// GET /api/links — ambil semua link (max 10)
export async function GET() {
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: "Database belum dikonfigurasi. Tambahkan KV_REST_API_URL dan KV_REST_API_TOKEN di Vercel." },
      { status: 503 }
    );
  }
  const links = await getAllLinks();
  return NextResponse.json({ links });
}

// POST /api/links — buat link baru
export async function POST(req: NextRequest) {
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: "Database belum dikonfigurasi. Tambahkan KV_REST_API_URL dan KV_REST_API_TOKEN di Vercel." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    let { slug, originalUrl } = body as { slug?: string; originalUrl?: string };

    if (!originalUrl?.trim()) {
      return NextResponse.json({ error: "URL tujuan tidak boleh kosong." }, { status: 400 });
    }

    // Auto-prefix https://
    if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
      originalUrl = "https://" + originalUrl;
    }

    // Validate URL
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json({ error: "Format URL tidak valid." }, { status: 400 });
    }

    // Auto-generate slug if empty
    if (!slug?.trim()) {
      slug = Math.random().toString(36).substring(2, 8);
    }
    slug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");

    // Check duplicate slug
    const existing = await getAllLinks();
    if (existing.some((l) => l.slug === slug)) {
      return NextResponse.json(
        { error: `Alias "${slug}" sudah digunakan. Coba alias lain.` },
        { status: 409 }
      );
    }

    const link = await createLink(slug, originalUrl);
    return NextResponse.json({ link }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menyimpan link." }, { status: 500 });
  }
}
