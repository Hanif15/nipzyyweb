import React from "react";
import { getPublishedArticles } from "@/lib/notion";
import { BlogList } from "./BlogList";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Notes & Thoughts — Hanif Sabillah (Nipzyy)",
  description:
    "I write about things I'm learning, concepts I'm exploring, projects I'm working on, and thoughts worth putting into words.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const { articles, isUsingMock } = await getPublishedArticles();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Notes &amp; Thoughts</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Notes &amp; Thoughts
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-base sm:text-lg leading-relaxed">
          I write about things I&apos;m learning, concepts I&apos;m exploring, projects I&apos;m working on, and thoughts worth putting into words.
        </p>
      </div>

      {/* Blog List with interactive search & tag filters */}
      <BlogList articles={articles} isUsingMock={isUsingMock} />
    </div>
  );
}
