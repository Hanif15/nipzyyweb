"use client";

import React, { useEffect, useState } from "react";
import { ListCollapse, ChevronRight, X } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Track scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setProgress(currentProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active heading using IntersectionObserver
  useEffect(() => {
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-90px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setDrawerOpen(false);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      {/* ============================================================ */}
      {/* 1. MOBILE SLIDER / DRAWER (STICKY TOGGLE ON THE LEFT SIDE)    */}
      {/* ============================================================ */}
        {/* Sticky floating pill button on the bottom left - light & dark theme adaptive, 35% opacity (65% transparent) */}
        <div className="fixed left-3 bottom-6 z-40 lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 py-2 px-3 rounded-full bg-white/40 dark:bg-slate-900/40 text-slate-800/80 dark:text-slate-200/80 border border-slate-300/40 dark:border-blue-500/25 shadow-md backdrop-blur-xs hover:bg-white/90 dark:hover:bg-slate-900/90 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/50 transition-all cursor-pointer group"
            aria-label="Buka Daftar Isi"
            title="Daftar Isi"
          >
            <ListCollapse className="w-3.5 h-3.5 text-blue-600/80 dark:text-blue-400/80 group-hover:text-blue-600 dark:group-hover:text-blue-300 shrink-0" />
            <span className="font-semibold text-[10px] text-slate-700/80 dark:text-slate-300/80 group-hover:text-slate-900 dark:group-hover:text-white">
              TOC
            </span>
            <span className="font-mono text-[9px] text-blue-600/80 dark:text-blue-400/80 group-hover:text-blue-600 dark:group-hover:text-blue-300 font-bold border-l border-slate-300/40 dark:border-slate-700/60 pl-1.5 ml-0.5">
              {Math.round(progress)}%
            </span>
          </button>
        </div>

        {/* Backdrop overlay */}
        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          />
        )}

        {/* Slide-out drawer panel from the left */}
        <div
          className={`fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <ListCollapse className="w-4 h-4 text-blue-500" />
              <span>Daftar Isi Artikel</span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Headings List */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`w-full text-left py-2.5 px-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  } ${item.level === 3 ? "pl-7 text-[11px]" : item.level === 2 ? "pl-4" : ""}`}
                >
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? "text-blue-500" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{item.text}</span>
                </button>
              );
            })}
          </nav>

          {/* Drawer Footer with Reading Progress */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Progress membaca:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

      {/* ============================================================ */}
      {/* 2. DESKTOP STICKY SIDEBAR (STICKY ON RIGHT SIDE)              */}
      {/* ============================================================ */}
      <aside className="hidden lg:block w-72 shrink-0 self-stretch">
        <div className="sticky top-28 space-y-4 p-5 rounded-3xl border border-slate-200/80 dark:border-blue-950/70 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md">
          {/* Header */}
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <ListCollapse className="w-4 h-4 text-blue-500" />
            <span>Table of Contents</span>
          </div>

          {/* Headings List */}
          <nav className="max-h-[calc(100vh-320px)] overflow-y-auto space-y-1 pr-1 text-xs">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`group w-full text-left py-2 px-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                  } ${item.level === 3 ? "ml-3 text-[11px]" : item.level === 2 ? "ml-1.5" : "font-medium"}`}
                >
                  <ChevronRight
                    className={`w-3 h-3 shrink-0 transition-transform ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 translate-x-0.5"
                        : "text-slate-400 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                  <span className="truncate">{item.text}</span>
                </button>
              );
            })}
          </nav>

          {/* Reading Progress Bar Section (At Bottom of Sticky Container) */}
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>Reading progress</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
