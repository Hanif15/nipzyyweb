"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  Clock,
  Mic,
  Hash,
} from "lucide-react";

export function WordCounter() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<boolean>(false);
  // We track plain text separately for stats only
  const [plainText, setPlainText] = useState<string>(
    "Selamat datang di Nipzyy! Alat penghitung kata ini membantu menganalisis artikel blog, esai riset ilmiah, maupun dokumen teks dengan statistik lengkap dan estimasi waktu baca secara real-time."
  );

  // Sync plainText from editable div's textContent
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setPlainText(editorRef.current.innerText);
    }
  }, []);

  // On paste: prefer HTML (rich text), fall back to plain text
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const plain = e.clipboardData.getData("text/plain");

    if (html) {
      // Sanitize: strip scripts and dangerous attrs but keep bold/italic/underline structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      // Remove scripts
      doc.querySelectorAll("script, style, meta, link").forEach((el) => el.remove());
      // Remove all attributes except a few safe ones
      const allowedAttrs = new Set(["href", "target", "rel"]);
      doc.querySelectorAll("*").forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
          if (!allowedAttrs.has(attr.name)) {
            el.removeAttribute(attr.name);
          }
        });
      });
      const cleanHtml = doc.body.innerHTML;
      document.execCommand("insertHTML", false, cleanHtml);
    } else {
      document.execCommand("insertText", false, plain);
    }
    setPlainText(editorRef.current?.innerText ?? "");
  }, []);

  // Text Analytics using plain text for counts
  const stats = useMemo(() => {
    const raw = plainText.trim();
    if (!raw) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsWithoutSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readTimeMinutes: 0,
        speakTimeMinutes: 0,
        topWords: [] as { word: string; count: number }[],
      };
    }

    const wordsArray = raw.split(/\s+/).filter(Boolean);
    const words = wordsArray.length;
    const charsWithSpaces = plainText.length;
    const charsWithoutSpaces = plainText.replace(/\s+/g, "").length;
    const sentences = (raw.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (raw.length > 0 ? 1 : 0);
    const paragraphs = plainText.split(/\n+/).map((p) => p.trim()).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
    const speakTimeMinutes = Math.max(1, Math.ceil(words / 130));

    const stopWords = new Set([
      "dan", "di", "ke", "dari", "ini", "itu", "yang", "untuk", "pada", "adalah",
      "dengan", "atau", "sebagai", "juga", "the", "a", "an", "in", "on", "at",
      "to", "for", "of", "and", "or", "is", "are", "it", "with", "as", "by",
    ]);

    const frequencyMap: Record<string, number> = {};
    wordsArray.forEach((w) => {
      const cleaned = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleaned.length > 2 && !stopWords.has(cleaned)) {
        frequencyMap[cleaned] = (frequencyMap[cleaned] || 0) + 1;
      }
    });

    const topWords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));

    return { words, charsWithSpaces, charsWithoutSpaces, sentences, paragraphs, readTimeMinutes, speakTimeMinutes, topWords };
  }, [plainText]);

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    setPlainText("");
  };

  // Copy rich HTML content (preserves formatting)
  const handleCopy = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    selection?.removeAllRanges();
    selection?.addRange(range);
    try {
      document.execCommand("copy");
    } catch {
      navigator.clipboard.writeText(plainText);
    }
    selection?.removeAllRanges();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl glass-panel border border-blue-200/80 dark:border-blue-900/40 text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 block">
            {stats.words.toLocaleString()}
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            Kata (Words)
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-200 block">
            {stats.charsWithSpaces.toLocaleString()}
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Karakter</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-200 block">
            {stats.charsWithoutSpaces.toLocaleString()}
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Tanpa Spasi</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-200 block">
            {stats.sentences}
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Kalimat</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-200 block">
            {stats.paragraphs}
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Paragraf</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            <span>~{stats.words > 0 ? stats.readTimeMinutes : 0}m</span>
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Waktu Baca</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
            <Mic className="w-4 h-4" />
            <span>~{stats.words > 0 ? stats.speakTimeMinutes : 0}m</span>
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Waktu Bicara</span>
        </div>
      </div>

      {/* Editor & Actions */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Teks Editor:
          </label>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Tip: Copy-paste teks kaya format akan dipertahankan</span>
            <button
              onClick={handleClear}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 text-slate-500 cursor-pointer"
              title="Kosongkan Teks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Contenteditable editor — preserves bold, italic, etc. */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          data-placeholder="Ketik atau tempel teks dokumen, esai, atau artikel blog kamu di sini..."
          className="word-counter-editor w-full min-h-[240px] p-4 text-sm sm:text-base rounded-3xl border border-slate-200 dark:border-blue-900/60 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all leading-relaxed shadow-sm overflow-y-auto"
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{
            __html:
              "Selamat datang di Nipzyy! Alat penghitung kata ini membantu menganalisis artikel blog, esai riset ilmiah, maupun dokumen teks dengan statistik lengkap dan estimasi waktu baca secara real-time.",
          }}
        />

        {/* Footer info & top keywords */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          {stats.topWords.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-blue-500" />
                <span>Kata Kunci Teratas:</span>
              </span>
              {stats.topWords.map(({ word, count }) => (
                <span
                  key={word}
                  className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[11px]"
                >
                  {word} ({count})
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-400">Ketik teks untuk melihat analisis kata kunci.</span>
          )}

          <button
            onClick={handleCopy}
            disabled={!plainText}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer ml-auto"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Teks Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
