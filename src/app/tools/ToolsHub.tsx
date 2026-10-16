"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { QrGenerator } from "@/components/tools/QrGenerator";
import { LatexPreviewer } from "@/components/tools/LatexPreviewer";
import { WordCounter } from "@/components/tools/WordCounter";
import { UrlShortener } from "@/components/tools/UrlShortener";
import {
  QrCode,
  Sigma,
  FileText,
  Link2,
  Wrench,
} from "lucide-react";

type ToolTab = "qr" | "latex" | "word-counter" | "url-shortener";

interface ToolsHubProps {
  initialTab?: string;
}

export function ToolsHub({ initialTab }: ToolsHubProps) {
  const validTabs: ToolTab[] = ["qr", "latex", "word-counter", "url-shortener"];
  const defaultTab = (initialTab && validTabs.includes(initialTab as ToolTab)) ? (initialTab as ToolTab) : null;
  const [activeTab, setActiveTab] = useState<ToolTab | null>(defaultTab);
  const searchParams = useSearchParams();

  const tabs = [
    {
      id: "qr" as ToolTab,
      label: "QR Code Generator",
      description: "Buat QR code cepat dengan warna kustom & export PNG/SVG",
      icon: QrCode,
    },
    {
      id: "latex" as ToolTab,
      label: "LaTeX Equation",
      description: "Pratinjau rumus matematika KaTeX real-time & template persamaan",
      icon: Sigma,
    },
    {
      id: "word-counter" as ToolTab,
      label: "Word Counter",
      description: "Analisis jumlah kata, karakter, waktu baca & pengubah huruf",
      icon: FileText,
    },
    {
      id: "url-shortener" as ToolTab,
      label: "URL Shortener",
      description: "Perpendek link dengan alias kustom & pelacak klik sederhana",
      icon: Link2,
    },
  ];

  // Sync tab from URL query param (?tab=...) or hash on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlTab = searchParams?.get("tab") || window.location.hash.replace("#", "");
      if (urlTab && validTabs.includes(urlTab as ToolTab)) {
        setActiveTab(urlTab as ToolTab);
      } else if (!urlTab) {
        setActiveTab(null);
      }
    }
  }, [searchParams]);

  // Update browser tab title whenever activeTab changes
  useEffect(() => {
    const currentTab = tabs.find((t) => t.id === activeTab);
    const newTitle = currentTab ? `Tools - ${currentTab.label}` : "Tools";
    document.title = newTitle;

    // Timeout safety to override framework microtask reconciliations
    const timer = setTimeout(() => {
      document.title = newTitle;
    }, 50);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const selectTab = (tabId: ToolTab) => {
    setActiveTab(tabId);
    const tabObj = tabs.find((t) => t.id === tabId);
    const newTitle = tabObj ? `Tools - ${tabObj.label}` : "Tools";
    document.title = newTitle;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `?tab=${tabId}`);
    }
  };

  const currentTab = tabs.find((t) => t.id === activeTab);
  const currentTitle = currentTab ? `Tools - ${currentTab.label}` : "Tools";

  return (
    <div className="space-y-8">
      {/* React 19 Document Metadata Hoisting */}
      <title>{currentTitle}</title>

      {/* Tab Navigation Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                isActive
                  ? "border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
                  : "border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-blue-300 dark:hover:border-blue-800"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>

              <div>
                <h3
                  className={`font-bold text-sm tracking-tight ${
                    isActive
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {tab.label}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {tab.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tool Content */}
      {!activeTab ? (
        <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shadow-sm">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Pilih Alat Bantu
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            Klik salah satu menu di atas untuk membuka QR Code Generator, LaTeX Equation, Word Counter, atau URL Shortener.
          </p>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-blue-950/70 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm">
          {activeTab === "qr" && <QrGenerator />}
          {activeTab === "latex" && <LatexPreviewer />}
          {activeTab === "word-counter" && <WordCounter />}
          {activeTab === "url-shortener" && <UrlShortener />}
        </div>
      )}
    </div>
  );
}
