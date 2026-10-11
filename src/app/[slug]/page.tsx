"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SlugRedirect() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;

    try {
      const saved = localStorage.getItem("nipzyy_shortened_links");
      if (saved) {
        const links: { shortCode: string; originalUrl: string; id: string; clicks: number }[] =
          JSON.parse(saved);
        const match = links.find((l) => l.shortCode === slug);
        if (match) {
          // Increment click count
          const updated = links.map((l) =>
            l.id === match.id ? { ...l, clicks: l.clicks + 1 } : l
          );
          localStorage.setItem("nipzyy_shortened_links", JSON.stringify(updated));
          window.location.href = match.originalUrl;
          return;
        }
      }
    } catch {
      // ignore
    }

    // Not found — redirect to tools page
    router.replace("/tools");
  }, [slug, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
          Mengalihkan ke tautan tujuan…
        </p>
        <p className="text-slate-400 text-xs">
          /{slug}
        </p>
      </div>
    </div>
  );
}
