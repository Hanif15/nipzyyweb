import React from "react";
import { mockDesignProjects } from "@/lib/mockData";
import { DesignGallery } from "./DesignGallery";
import { Palette } from "lucide-react";

export const metadata = {
  title: "Portofolio Desain & Studi Kasus — Hanif",
  description:
    "Eksplorasi antarmuka digital, UI/UX systems, branding, dan desain aplikasi modern bernuansa biru elegan.",
};

export default function DesignPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Palette className="w-4 h-4" />
          <span>Design Showcase &amp; Case Studies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Portofolio Desain
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-base sm:text-lg">
          Koleksi proyek antarmuka pengguna (UI/UX), desain web, dan eksplorasi identitas visual yang menggabungkan estetika modern dan pengalaman pengguna yang mulus.
        </p>
      </div>

      {/* Gallery with Category Filters & Modal */}
      <DesignGallery projects={mockDesignProjects} />
    </div>
  );
}
