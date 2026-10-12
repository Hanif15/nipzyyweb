"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Clock,
  MousePointerClick,
  RefreshCw,
  AlertCircle,
  Database,
} from "lucide-react";

interface ShortLink {
  id: string;
  slug: string;
  original_url?: string;
  originalUrl?: string;
  shortUrl?: string;
  created_at?: string;
  createdAt?: string;
  clicks: number;
}

export function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [customAlias, setCustomAlias] = useState<string>("");
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string>("");

  // Fetch links from database API route
  const fetchLinks = useCallback(async () => {
    setFetchLoading(true);
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      if (!res.ok) {
        setDbError(data.error ?? "Gagal memuat data dari database.");
        setLinks([]);
      } else {
        setDbError("");
        setLinks(data.links ?? []);
      }
    } catch {
      setDbError("Tidak dapat terhubung ke server database.");
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: customAlias.trim(), originalUrl: originalUrl.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Gagal membuat link.");
      } else {
        setOriginalUrl("");
        setCustomAlias("");
        await fetchLinks(); // Refresh list
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenLink = async (link: ShortLink) => {
    const targetUrl = link.original_url || link.originalUrl || "";
    // Optimistically update click count in UI
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, clicks: l.clicks + 1 } : l))
    );
    // Record click server-side
    try {
      await fetch("/api/redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: link.slug }),
      });
    } catch {
      /* ignore */
    }
    if (targetUrl) {
      window.open(targetUrl, "_blank");
    }
  };

  return (
    <div className="space-y-8">
      {/* DB Status Banner */}
      {dbError && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Database belum terhubung</p>
            <p>{dbError}</p>
          </div>
        </div>
      )}

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
                <span className="px-3 py-2 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex items-center whitespace-nowrap">
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
                disabled={loading || !!dbError}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Perpendek Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </form>
      </div>

      {/* History Links List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Link Tersimpan di Database:</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{links.length}/10 link</span>
            <button
              onClick={fetchLinks}
              disabled={fetchLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {fetchLoading ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Memuat data dari database...</span>
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 flex flex-col items-center gap-2">
            <Database className="w-6 h-6 opacity-40" />
            <span>{dbError ? "Database tidak terhubung." : "Belum ada link yang tersimpan di database."}</span>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((item) => {
              const fullShortUrl = `https://nipzyy.my.id/${item.slug}`;
              const targetUrl = item.original_url || item.originalUrl || "";
              const dateCreated = item.createdAt || (item.created_at ? item.created_at.split("T")[0] : "");

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-950/70 bg-white dark:bg-slate-900/70 hover:border-blue-400 dark:hover:border-blue-800 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1 max-w-xl min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-blue-600 dark:text-blue-400 font-mono break-all">
                        {fullShortUrl}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium flex items-center gap-1 shrink-0">
                        <MousePointerClick className="w-3 h-3" />
                        {item.clicks} klik
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm">
                      → {targetUrl}
                    </p>
                    {dateCreated && (
                      <p className="text-[10px] text-slate-400">Dibuat: {dateCreated}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleCopy(item.id, fullShortUrl)}
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
                      onClick={() => handleOpenLink(item)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Buka</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
