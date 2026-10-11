"use client";

import React, { useState, useMemo } from "react";
import { Publication } from "@/lib/types";
import {
  Search,
  BookOpen,
  FileText,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Code2,
} from "lucide-react";

interface Props {
  publications: Publication[];
}

export function PublicationsList({ publications }: Props) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);

  const toggleAbstract = (id: string) => {
    setExpandedAbstracts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyBibtex = (id: string, bibtex: string) => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtexId(id);
    setTimeout(() => {
      setCopiedBibtexId(null);
    }, 2000);
  };

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesType =
        selectedType === "all" ? true : pub.type === selectedType;
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        pub.title.toLowerCase().includes(query) ||
        pub.authors.some((a) => a.toLowerCase().includes(query)) ||
        pub.venue.toLowerCase().includes(query) ||
        pub.abstract.toLowerCase().includes(query);

      return matchesType && matchesQuery;
    });
  }, [publications, selectedType, searchQuery]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: publications.length,
      conference: 0,
      journal: 0,
      preprint: 0,
    };
    publications.forEach((p) => {
      if (counts[p.type] !== undefined) {
        counts[p.type]++;
      }
    });
    return counts;
  }, [publications]);

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Semua" },
            { id: "conference", label: "Conference" },
            { id: "journal", label: "Journal" },
            { id: "preprint", label: "Preprint" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedType === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-700"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  selectedType === tab.id
                    ? "bg-blue-700 text-blue-100"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {typeCounts[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari paper, penulis, topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Publications List */}
      {filteredPublications.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
            Tidak ada publikasi yang cocok dengan pencarian &quot;{searchQuery}&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredPublications.map((pub) => {
            const isAbstractOpen = expandedAbstracts[pub.id] || false;
            const isCopied = copiedBibtexId === pub.id;

            return (
              <div
                key={pub.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-blue-950 bg-white dark:bg-slate-900/70 hover:border-blue-400 dark:hover:border-blue-800 transition-all duration-200 shadow-sm"
              >
                {/* Header badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                  <span className="px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-950/90 text-blue-700 dark:text-blue-300 uppercase tracking-wider text-[11px]">
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
                  {pub.highlighted && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {pub.title}
                </h2>

                {/* Authors & Venue */}
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    {pub.authors.map((author, index) => (
                      <span key={author}>
                        {author.includes("Hanif") ? (
                          <strong className="text-blue-600 dark:text-blue-400 font-semibold underline decoration-blue-500/50">
                            {author}
                          </strong>
                        ) : (
                          author
                        )}
                        {index < pub.authors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <p className="italic text-slate-700 dark:text-slate-300 mt-0.5">
                    {pub.venue}
                  </p>
                </div>

                {/* Collapsible Abstract */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleAbstract(pub.id)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAbstractOpen ? "Sembunyikan Abstrak" : "Lihat Abstrak"}</span>
                    {isAbstractOpen ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isAbstractOpen && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in duration-200">
                      <strong className="text-slate-900 dark:text-white block mb-1">
                        Abstrak:
                      </strong>
                      {pub.abstract}
                    </div>
                  )}
                </div>

                {/* Action Buttons: BibTeX, PDF, Code */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs">
                  <button
                    onClick={() => copyBibtex(pub.id, pub.bibtex)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:border-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">BibTeX Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin BibTeX</span>
                      </>
                    )}
                  </button>

                  {pub.pdfUrl && (
                    <a
                      href={pub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  )}

                  {pub.codeUrl && (
                    <a
                      href={pub.codeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors flex items-center gap-1.5 font-medium"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Kode Sumber</span>
                    </a>
                  )}

                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 ml-auto font-medium"
                    >
                      <span>Lihat Publisher</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
