import { NextRequest, NextResponse } from "next/server";
import {
  getAllLinks,
  createLink,
  deleteLink,
  isSupabaseConfigured,
  getLinkBySlug,
} from "@/lib/supabase";

const DELETE_PASSWORD = process.env.SHORTENER_DELETE_PASSWORD || "hapus123";

// GET /api/links — ambil maksimal 10 link terbaru dari database
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Database belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables.",
      },
      { status: 503 }
    );
  }

  const links = await getAllLinks();
  return NextResponse.json({ links });
}

// POST /api/links — buat link baru di database
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Database belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    let { slug, originalUrl } = body as { slug?: string; originalUrl?: string };

    if (!originalUrl?.trim()) {
      return NextResponse.json(
        { error: "URL tujuan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Auto-prefix https://
    if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
      originalUrl = "https://" + originalUrl;
    }

    // Validasi URL
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { error: "Format URL tidak valid." },
        { status: 400 }
      );
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
      { error: err?.message || "Gagal menyimpan link ke database." },
      { status: 500 }
    );
  }
}

// DELETE /api/links — hapus link dengan validasi password
export async function DELETE(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database belum dikonfigurasi." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { id, slug, password } = body as {
      id?: string;
      slug?: string;
      password?: string;
    };

    if (password !== DELETE_PASSWORD) {
      return NextResponse.json(
        { error: "Password salah! Tidak dapat menghapus link." },
        { status: 401 }
      );
    }

    const target = id || slug;
    if (!target) {
      return NextResponse.json(
        { error: "ID atau slug link harus disertakan." },
        { status: 400 }
      );
    }

    await deleteLink(target);
    return NextResponse.json({ success: true, message: "Link berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Gagal menghapus link dari database." },
      { status: 500 }
    );
  }
}
