import React from "react";
import Link from "next/link";
import {
  profileData,
  mockPublications,
  mockDesignProjects,
} from "@/lib/mockData";
import { getPublishedArticles } from "@/lib/notion";
import {
  ArrowRight,
  BookOpen,
  Palette,
  FileText,
  Mail,
  ExternalLink,
  Layers,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { articles: blogPosts, isUsingMock } = await getPublishedArticles();
  const highlightedPubs = mockPublications.filter((p) => p.highlighted).slice(0, 2);
  const featuredDesigns = mockDesignProjects.filter((d) => d.featured).slice(0, 2);
  const latestArticles = blogPosts.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-8">
        <div className="flex flex-col items-start gap-6 max-w-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tersedia untuk Proyek &amp; Riset Kolaboratif</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Membangun Pengalaman Digital &amp;{" "}
            <span className="text-gradient-blue">
              Meneliti Sistem Interaktif
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Halo! Saya <span className="font-semibold text-slate-900 dark:text-white">{profileData.name}</span>, seorang {profileData.role}. Saya memadukan keindahan desain antarmuka dengan ketajaman arsitektur software dan publikasi ilmiah.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/design"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <Palette className="w-4 h-4" />
              <span>Lihat Desain</span>
            </Link>
            <Link
              href="/blog"
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 font-medium text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Baca Blog Notion</span>
            </Link>
            <Link
              href="/publications"
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 font-medium text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Publikasi</span>
            </Link>
            <Link
              href="/tools"
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 font-medium text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <Wrench className="w-4 h-4" />
              <span>Mini Tools</span>
            </Link>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 pt-2 text-slate-500 dark:text-slate-400 text-sm">
            <span>Terhubung:</span>
            <a
              href={profileData.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={profileData.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={profileData.socialLinks.email}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-200/80 dark:border-blue-950/60">
          {profileData.stats.map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-blue-900/30 flex flex-col"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Expertise */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Keahlian &amp; Teknologi</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {profileData.skills.map((skill, index) => (
            <div
              key={index}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Blog Section (Notion CMS) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-blue-950/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Blog &amp; Tulisan (Notion CMS)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Artikel Terbaru dari Notion
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            <span>Buka Semua Artikel</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isUsingMock && (
          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between gap-2">
            <span>
              ℹ️ Menampilkan mock data Notion. Sambungkan <code>NOTION_API_KEY</code> di <code>.env.local</code> untuk menyinkronkan tulisan live dari akun Notion kamu.
            </span>
            <Link href="/blog" className="underline font-semibold shrink-0">
              Detail Setup
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-blue-950 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-800 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              {article.coverImage && (
                <div className="h-44 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span>{formatDate(article.date)}</span>
                  <span>{article.readTime || "5 min read"}</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
                  {article.summary}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Baca selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Publications Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-blue-950/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Publikasi Riset &amp; Paper</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sorotan Publikasi Ilmiah
            </h2>
          </div>
          <Link
            href="/publications"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            <span>Lihat Semua Paper</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {highlightedPubs.map((pub) => (
            <div
              key={pub.id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-blue-950 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-800 transition-all space-y-3 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wider">
                  {pub.type}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {pub.year}
                </span>
                {pub.doi && (
                  <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                    DOI: {pub.doi}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Link href="/publications">{pub.title}</Link>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {pub.authors.join(", ")} • <span className="italic text-slate-700 dark:text-slate-300">{pub.venue}</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                {pub.abstract}
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-semibold">
                {pub.pdfUrl && (
                  <a
                    href={pub.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Download PDF <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {pub.codeUrl && (
                  <a
                    href={pub.codeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:underline"
                  >
                    Code Repository <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Design Projects */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-blue-950/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Palette className="w-4 h-4" />
              <span>Portofolio Desain</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Karya Desain Pilihan
            </h2>
          </div>
          <Link
            href="/design"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            <span>Buka Galeri Desain</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredDesigns.map((project) => (
            <Link
              key={project.id}
              href="/design"
              className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-blue-950 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-800 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col"
            >
              <div className="h-60 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white shadow-md">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>{project.year}</span>
                  {project.client && <span>Klien: {project.client}</span>}
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact / Collaboration Callout */}
      <section className="relative p-8 sm:p-12 rounded-3xl overflow-hidden border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-600/10 via-blue-900/5 to-slate-950/20 backdrop-blur-xl">
        <div className="max-w-2xl space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white inline-block">
            Mari Berkolaborasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Punya ide proyek, riset, atau kebutuhan desain menarik?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Saya selalu terbuka untuk berdiskusi seputar rekayasa perangkat lunak, sistem desain, kecerdasan buatan, atau peluang kolaborasi lainnya.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href={profileData.socialLinks.email}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-md shadow-blue-600/30 inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Kirim Email</span>
            </a>
            <a
              href={profileData.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm font-medium transition-all inline-flex items-center gap-2"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
