import React, { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getPublishedArticles } from "@/lib/notion";
import { NotionBlockRenderer } from "@/components/NotionBlockRenderer";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { profileData } from "@/lib/mockData";

export async function generateStaticParams() {
  const { articles } = await getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { article } = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  return {
    title: `${article.title} — Hanif's Blog`,
    description: article.summary,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { article, blocks, isUsingMock } = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Navigation Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Blog</span>
        </Link>

        {isUsingMock && (
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
            Pratinjau Mock Notion
          </span>
        )}
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <User className="w-4 h-4 text-blue-500" />
            <span>{article.author || profileData.name}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(article.date)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{article.readTime || "5 min read"}</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg max-h-[440px] w-full bg-slate-100 dark:bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content / Notion Blocks */}
      <div className="pt-4">
        {blocks.length === 0 ? (
          <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center space-y-2">
            <p className="text-slate-600 dark:text-slate-400">
              Belum ada blok konten di halaman Notion ini.
            </p>
            <p className="text-xs text-slate-500">
              Tulis konten kamu di Notion untuk menampilkannya di sini secara otomatis.
            </p>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            {blocks.map((block: any, index: number) => (
              <NotionBlockRenderer key={block.id || index} block={block} />
            ))}
          </div>
        )}
      </div>

      {/* Author Info Card */}
      <div className="mt-16 p-6 rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 dark:from-blue-950/40 dark:to-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 text-xl font-bold shadow-md shadow-blue-600/30">
          H
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Ditulis oleh {profileData.name}
            </h4>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
              Author
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {profileData.bio}
          </p>
        </div>
      </div>
    </article>
  );
}
