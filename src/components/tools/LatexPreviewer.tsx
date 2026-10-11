"use client";

import React, { useState, useMemo } from "react";
import katex from "katex";
import {
  Sigma,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  Code2,
  AlertCircle,
} from "lucide-react";

const equationSnippets = [
  {
    name: "Rumus Kuadratik",
    category: "Aljabar",
    code: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  },
  {
    name: "Distribusi Normal (Gaussian)",
    category: "Statistika",
    code: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2 \\right)",
  },
  {
    name: "Softmax Function (AI)",
    category: "Machine Learning",
    code: "\\sigma(\\mathbf{z})_i = \\frac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}} \\quad \\text{for } i = 1, \\dots, K",
  },
  {
    name: "Identitas Euler",
    category: "Analisis Kompleks",
    code: "e^{i\\pi} + 1 = 0",
  },
  {
    name: "Integral Tak Tentu Gaussian",
    category: "Kalkulus",
    code: "\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}",
  },
  {
    name: "Perkalian Matriks 2x2",
    category: "Aljabar Linier",
    code: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}",
  },
  {
    name: "Transformasi Fourier",
    category: "Sinyal",
    code: "\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x)\\, e^{-2\\pi i x \\xi} \\, dx",
  },
];

export function LatexPreviewer() {
  const [latexInput, setLatexInput] = useState<string>(
    "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2 \\right)"
  );
  const [displayMode, setDisplayMode] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  // Render each non-empty line as its own KaTeX block
  const { renderedBlocks, error } = useMemo(() => {
    if (!latexInput.trim()) {
      return { renderedBlocks: [], error: null };
    }
    const lines = latexInput.split("\n").filter((line) => line.trim() !== "");
    const blocks: string[] = [];
    let firstError: string | null = null;
    for (const line of lines) {
      try {
        blocks.push(katex.renderToString(line, { displayMode, throwOnError: true }));
      } catch (err: any) {
        // Fallback: render with error highlight
        try {
          blocks.push(katex.renderToString(line, { displayMode, throwOnError: false }));
        } catch {
          blocks.push("");
        }
        if (!firstError) firstError = err.message || "Syntax error";
      }
    }
    return { renderedBlocks: blocks, error: firstError };
  }, [latexInput, displayMode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(latexInput);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(renderedBlocks.join("\n"));
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Quick Preset Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Contoh Persamaan Matematika &amp; Sains:</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {equationSnippets.map((snippet) => (
            <button
              key={snippet.name}
              onClick={() => setLatexInput(snippet.code)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>{snippet.name}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({snippet.category})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Box */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Input Kode LaTeX:
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDisplayMode(!displayMode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  displayMode
                    ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {displayMode ? "Display Mode ($$)" : "Inline Mode ($)"}
              </button>
              <button
                onClick={() => setLatexInput("")}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Hapus"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={latexInput}
              onChange={(e) => setLatexInput(e.target.value)}
              placeholder="Tulis kode rumus LaTeX di sini, contoh: \frac{a}{b}..."
              rows={6}
              className="w-full p-4 text-sm font-mono rounded-2xl border border-slate-200 dark:border-blue-900/60 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all leading-relaxed"
            />
          </div>

          {/* Copy actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleCopyCode}
              disabled={!latexInput.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Kode Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode LaTeX</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyHtml}
              disabled={renderedBlocks.length === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedHtml ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">HTML KaTeX Disalin!</span>
                </>
              ) : (
                <>
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Salin HTML KaTeX</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview Display */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sigma className="w-4 h-4 text-blue-500" />
              <span>Live Render KaTeX:</span>
            </span>
            <span className="text-xs text-slate-400">Real-time preview</span>
          </div>

          <div className="p-8 rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900/90 shadow-xl min-h-[200px] flex items-center justify-center relative overflow-x-auto">
            {error && (
              <div className="absolute top-3 left-4 right-4 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200 dark:border-amber-900">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{error}</span>
              </div>
            )}

            {renderedBlocks.length > 0 ? (
              <div className="w-full space-y-4 py-4 select-text overflow-x-auto">
                {renderedBlocks.map((html, i) => (
                  <div
                    key={i}
                    className="text-slate-900 dark:text-white text-lg sm:text-xl md:text-2xl text-center w-full overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">
                Masukkan rumus LaTeX untuk melihat pratinjau
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-blue-700 dark:text-blue-400 block mb-1">
              💡 Panduan Singkat Sintaks:
            </strong>
            Gunakan pecahan <code>\frac&#123;a&#125;&#123;b&#125;</code>, pangkat <code>x^2</code>, akar <code>\sqrt&#123;x&#125;</code>, integral <code>\int</code>, dan simbol Yunani seperti <code>\alpha, \beta, \theta, \pi</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
