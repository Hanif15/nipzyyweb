"use client";

import React, { useState, useEffect } from "react";
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  MousePointerClick,
} from "lucide-react";

interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

export function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [customAlias, setCustomAlias] = useState<string>("");
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nipzyy_shortened_links");
      if (saved) {
        setLinks(JSON.parse(saved));
      } else {
        // Initial example links
        setLinks([
          {
            id: "1",
            originalUrl: "https://notion.so/my-integrations",
            shortCode: "notion-api",
            shortUrl: "https://nipzyy.my.id/notion-api",
            createdAt: "2026-10-11",
            clicks: 14,
          },
          {
            id: "2",
            originalUrl: "https://github.com",
            shortCode: "my-github",
            shortUrl: "https://nipzyy.my.id/my-github",
            createdAt: "2026-10-11",
            clicks: 29,
          },
        ]);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  const saveLinks = (updated: ShortenedLink[]) => {
    setLinks(updated);
    try {
      localStorage.setItem("nipzyy_shortened_links", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let url = originalUrl.trim();
    if (!url) {
      setError("Silakan masukkan URL tujuan.");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      new URL(url);
    } catch {
      setError("Format URL tidak valid. Pastikan format link benar.");
      return;
    }

    // Generate code
    let code = customAlias.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (!code) {
      code = Math.random().toString(36).substring(2, 8);
    }

    // Check duplicate
    if (links.some((l) => l.shortCode === code)) {
      setError(`Alias "${code}" sudah digunakan. Coba alias lain.`);
      return;
    }

    const newLink: ShortenedLink = {
      id: Date.now().toString(),
      originalUrl: url,
      shortCode: code,
      shortUrl: `https://nipzyy.my.id/${code}`,
      createdAt: new Date().toISOString().split("T")[0],
      clicks: 0,
    };

    const updated = [newLink, ...links];
    saveLinks(updated);
    setOriginalUrl("");
    setCustomAlias("");
  };

  const handleCopy = (id: string, shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClickLink = (id: string, originalUrl: string) => {
    const updated = links.map((l) =>
      l.id === id ? { ...l, clicks: l.clicks + 1 } : l
    );
    saveLinks(updated);
    window.open(originalUrl, "_blank");
  };

  const handleDelete = (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    saveLinks(updated);
  };

  return (
    <div className="space-y-8">
      {/* Shortener Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900/90 shadow-xl space-y-5">
        <form onSubmit={handleShorten} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              URL Panjang:
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://contoh-link-panjang-dokumen-atau-riset.com/detail/123..."
                className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-8 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Kustom Alias (Opsional):</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  nipzyy.my.id/&lt;alias&gt;
                </span>
              </label>
              <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60">
                <span className="px-3 py-2 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex items-center">
                  nipzyy.my.id/
                </span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="custom-slug"
                  className="w-full px-3 py-2 text-xs font-mono bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
              >
                <span>Perpendek Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              ⚠️ {error}
            </p>
          )}
        </form>
      </div>

      {/* History Links List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Riwayat Link yang Telah Dibuat:</span>
          </span>
          <span className="text-xs text-slate-400">{links.length} link</span>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            Belum ada link yang diperpendek.
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-950/70 bg-white dark:bg-slate-900/70 hover:border-blue-400 dark:hover:border-blue-800 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-blue-600 dark:text-blue-400 font-mono">
                      {item.shortUrl}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" />
                      {item.clicks} klik
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                    Target: {item.originalUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleCopy(item.id, item.shortUrl)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleClickLink(item.id, item.originalUrl)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Buka</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
