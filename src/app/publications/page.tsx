import React from "react";
import { mockPublications } from "@/lib/mockData";
import { PublicationsList } from "./PublicationsList";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Publikasi Ilmiah & Riset — Hanif",
  description:
    "Daftar paper ilmiah, conference proceedings, dan artikel riset tentang Edge AI, arsitektur software, dan Human-Computer Interaction.",
};

export default function PublicationsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Research &amp; Papers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Publikasi Ilmiah
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-base sm:text-lg">
          Kumpulan artikel riset, conference papers, dan preprints dalam bidang komputasi edge, desain sistem interaktif, dan optimalisasi software.
        </p>
      </div>

      {/* Publications Interactive List */}
      <PublicationsList publications={mockPublications} />
    </div>
  );
}
