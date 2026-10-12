import { NextRequest, NextResponse } from "next/server";
import { getAllLinks, createLink, isSupabaseConfigured, getLinkBySlug } from "@/lib/supabase";

// GET /api/links — ambil maksimal 10 link terbaru dari Supabase
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables." },
      { status: 503 }
    );
  }

  const links = await getAllLinks();
  return NextResponse.json({ links });
}

// POST /api/links — buat link baru di Supabase
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables." },
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

    // Validasi URL
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json({ error: "Format URL tidak valid." }, { status: 400 });
    }

    // Auto-generate slug jika kosong
    if (!slug?.trim()) {
      slug = Math.random().toString(36).substring(2, 8);
    }
    slug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");

    // Cek apakah slug sudah ada
    const existing = await getLinkBySlug(slug);
    if (existing) {
      return NextResponse.json(
        { error: `Alias "${slug}" sudah digunakan. Coba alias lain.` },
        { status: 409 }
      );
    }

    const link = await createLink(slug, originalUrl);
    return NextResponse.json({ link }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Gagal menyimpan link ke Supabase." },
      { status: 500 }
    );
  }
}
