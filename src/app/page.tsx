import React from "react";
import Link from "next/link";
import { profileData } from "@/lib/mockData";
import { getPublishedArticles } from "@/lib/notion";
import {
  ArrowRight,
  FileText,
  Mail,
  Layers,
  CheckCircle2,
  Wrench,
  Sparkles,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { articles: blogPosts } = await getPublishedArticles();
  const latestArticles = blogPosts.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-14 pb-8">
        <div className="flex flex-col items-start gap-6 max-w-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium backdrop-blur-sm shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>An archive of things worth learning</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Hello, I&apos;m <span className="text-gradient-blue">{profileData.name}</span>
          </h1>

          {/* Subtitle / Intro */}
          <div className="space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            <p>
              I&apos;m interested in statistics, data modeling, programming, and the art of turning complex information into something meaningful.
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              This is where I document what I learn, share what I create, and explore ideas worth pursuing.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/blog"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4" />
              <span>Read Notes &amp; Thoughts</span>
            </Link>
            <Link
              href="/tools"
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 font-medium text-sm transition-all flex items-center gap-2 shadow-xs"
            >
              <Wrench className="w-4 h-4" />
              <span>Mini Tools</span>
            </Link>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 pt-2 text-slate-500 dark:text-slate-400 text-sm">
            <span>Connect:</span>
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
      </section>

      {/* Skills & Focus Area */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Skills &amp; Toolkit</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {profileData.skills.map((skill, index) => (
            <div
              key={index}
              className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border border-blue-200/80 dark:border-blue-900/50 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-blue-950/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Latest Writing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recent Notes &amp; Articles
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            <span>All Notes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 dark:border-blue-950 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-800 transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-md"
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
                  <span>Read note</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact / Connect Callout */}
      <section className="relative p-8 sm:p-10 rounded-3xl overflow-hidden border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-600/10 via-blue-900/5 to-slate-950/20 backdrop-blur-xl">
        <div className="max-w-2xl space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white inline-block">
            Get in Touch
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Have an interesting question, project, or idea?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            I&apos;m always glad to talk about statistics, data systems, programming, or collaborative projects.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href={profileData.socialLinks.email}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-md shadow-blue-600/30 inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
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
