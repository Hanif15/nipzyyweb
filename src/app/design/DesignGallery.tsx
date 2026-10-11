"use client";

import React, { useState, useMemo } from "react";
import { DesignProject } from "@/lib/types";
import {
  Palette,
  ExternalLink,
  X,
  Layers,
  Sparkles,
  CheckCircle,
  Eye,
  Maximize2,
} from "lucide-react";

interface Props {
  projects: DesignProject[];
}

export function DesignGallery({ projects }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalProject, setActiveModalProject] = useState<DesignProject | null>(null);

  const categories = [
    { id: "all", label: "Semua Karya" },
    { id: "UI/UX", label: "UI/UX Design" },
    { id: "Web Design", label: "Web Design" },
    { id: "Mobile App", label: "Mobile App" },
    { id: "Branding", label: "Branding & Visual" },
  ];

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setActiveModalProject(project)}
            className="group cursor-pointer rounded-3xl overflow-hidden border border-slate-200 dark:border-blue-950 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl flex flex-col"
          >
            {/* Image Preview */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-md px-3 py-1.5 rounded-lg">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Lihat Detail Studi Kasus</span>
                </span>
              </div>

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-md">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span>{project.year}</span>
                {project.client && <span>{project.client}</span>}
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                {project.title}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
                {project.description}
              </p>

              {/* Tools Chips */}
              <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Case Study Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-blue-900 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-10">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 inline-block">
                {activeModalProject.category} • {activeModalProject.year}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {activeModalProject.title}
              </h2>
              {activeModalProject.client && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Klien: {activeModalProject.client}
                </p>
              )}
            </div>

            {/* Modal Cover Image */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-72 sm:h-80 w-full bg-slate-100 dark:bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeModalProject.coverImage}
                alt={activeModalProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {activeModalProject.description}
            </p>

            {/* Case Study Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1.5">
                <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                  Tantangan / Problem
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activeModalProject.caseStudy.challenge}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Solusi Desain
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activeModalProject.caseStudy.solution}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Hasil &amp; Dampak
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activeModalProject.caseStudy.outcome}
                </p>
              </div>
            </div>

            {/* Tools Used */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                Tools &amp; Teknologi:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeModalProject.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
              {activeModalProject.liveUrl && (
                <a
                  href={activeModalProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Kunjungi Live Demo</span>
                </a>
              )}
              {activeModalProject.figmaUrl && (
                <a
                  href={activeModalProject.figmaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Lihat Prototipe Figma</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
