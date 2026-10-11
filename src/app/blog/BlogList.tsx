"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Tag,
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  articles: BlogPost[];
  isUsingMock: boolean;
}

export function BlogList({ articles, isUsingMock }: Props) {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    articles.forEach((a) => {
      a.tags.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesTag =
        selectedTag === "all" ? true : article.tags.includes(selectedTag);
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some((t) => t.toLowerCase().includes(query));

      return matchesTag && matchesQuery;
    });
  }, [articles, selectedTag, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Notion status banner */}
      <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {isUsingMock ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Mode Mock Data
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Notion Live Connected
              </span>
            )}
            <span>
              {isUsingMock
                ? "Website menampilkan artikel contoh Notion. Kamu bisa menghubungkan database Notion aslimu."
                : "Artikel disinkronkan secara langsung dari Notion Database kamu."}
            </span>
          </div>

          <button
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>{showSetupGuide ? "Tutup Panduan" : "Panduan Integrasi Notion"}</span>
            {showSetupGuide ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Collapsible Setup Guide */}
        {showSetupGuide && (
          <div className="mt-4 pt-4 border-t border-blue-200/60 dark:border-blue-900/40 text-xs sm:text-sm space-y-3 animate-in fade-in duration-200">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Cara Mengaktifkan Notion Database:
            </h4>
            <ol className="list-decimal ml-5 space-y-1.5 text-slate-600 dark:text-slate-300">
              <li>
                Buka{" "}
                <a
                  href="https://www.notion.so/my-integrations"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline font-medium"
                >
                  notion.so/my-integrations
                </a>{" "}
                lalu buat integrasi internal baru untuk mendapatkan <code>Internal Integration Secret</code>.
              </li>
              <li>
                Buat database baru di Notion kamu dengan kolom (properti):
                <ul className="list-disc ml-5 mt-1 space-y-0.5 font-mono text-xs text-blue-700 dark:text-blue-300">
                  <li><strong>Title</strong> (Title)</li>
                  <li><strong>Slug</strong> (Text)</li>
                  <li><strong>Date</strong> (Date)</li>
                  <li><strong>Tags</strong> (Multi-select)</li>
                  <li><strong>Summary</strong> (Text)</li>
                  <li><strong>Published</strong> (Checkbox)</li>
                </ul>
              </li>
              <li>
                Di halaman database Notion, klik tombol <strong>... (Options)</strong> &gt; <strong>Connect to</strong> &gt; pilih integrasi yang kamu buat.
              </li>
              <li>
                Salin token dan database ID ke file <code>.env.local</code> di project ini:
                <pre className="mt-2 p-2.5 rounded-lg bg-slate-900 text-blue-200 text-xs font-mono overflow-x-auto">
{`NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
                </pre>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Search and Tag filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedTag("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              selectedTag === "all"
                ? "bg-blue-600 text-white shadow-xs font-semibold"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400"
            }`}
          >
            Semua ({articles.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedTag === tag
                  ? "bg-blue-600 text-white shadow-xs font-semibold"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-400"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari artikel blog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Tidak ada artikel yang cocok dengan pencarian &quot;{searchQuery}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 dark:border-blue-950 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl"
            >
              {article.coverImage && (
                <div className="h-52 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-900/80 text-white backdrop-blur-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime || "5 min read"}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-3">
                  {article.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1">
                  {article.summary}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Baca artikel lengkap</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
