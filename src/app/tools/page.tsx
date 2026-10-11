import React from "react";
import { ToolsHub } from "./ToolsHub";
import { Wrench } from "lucide-react";

export const metadata = {
  title: "Mini Tools & Utilitas — Nipzyy",
  description:
    "Kumpulan alat bantu produktivitas: QR Code Generator, LaTeX Equation Previewer, Word Counter, dan URL Shortener sederhana.",
};

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Wrench className="w-4 h-4" />
          <span>Productivity &amp; Developer Tools</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mini Tools &amp; Utilitas
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-base sm:text-lg">
          Koleksi alat bantu praktis untuk kebutuhan harian: pembuatan QR Code, penulisan rumus LaTeX, analisis kata dokumen, dan penyingkat URL.
        </p>
      </div>

      {/* Tools Hub Component */}
      <ToolsHub />
    </div>
  );
}
