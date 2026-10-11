"use client";

import React from "react";
import Link from "next/link";
import { profileData } from "@/lib/mockData";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/Icons";
import {
  Mail,
  ArrowUp,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-200/80 dark:border-blue-950/80 bg-white/50 dark:bg-[#070d18] mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Nipzyy
                <span className="text-blue-500">.</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Personal portfolio &amp; blog oleh <span className="font-semibold text-slate-900 dark:text-white">{profileData.name}</span>. {profileData.bio}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={profileData.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={profileData.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={profileData.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={profileData.socialLinks.email}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/publications"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Publications
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Blog (Notion CMS)
                </Link>
              </li>
              <li>
                <Link
                  href="/design"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Design Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Mini Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Notion & Tech Stack badge */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Integrasi Headless
            </h3>
            <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 font-medium text-blue-700 dark:text-blue-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Notion API Ready</span>
              </div>
              <p className="leading-relaxed">
                Tulisan blog disinkronisasi langsung dari database Notion. Dilengkapi fallback mock post.
              </p>
              <a
                href="https://developers.notion.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline pt-1"
              >
                Notion API Docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 {profileData.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 dark:text-slate-600">Built with Next.js, Tailwind &amp; Notion</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
