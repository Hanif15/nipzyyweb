"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  ExternalLink,
} from "lucide-react";

export function QrGenerator() {
  const [text, setText] = useState<string>("https://nipzyy.my.id");
  const [size, setSize] = useState<number>(280);
  const [fgColor, setFgColor] = useState<string>("#1e40af"); // Deep Blue
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code
  useEffect(() => {
    if (!text.trim()) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
      });
  }, [text, size, fgColor, bgColor, errorLevel]);

  const handleDownload = (format: "png" | "svg") => {
    if (!text.trim()) return;

    if (format === "png") {
      const link = document.createElement("a");
      link.download = `qrcode-nipzyy-${Date.now()}.png`;
      link.href = qrDataUrl;
      link.click();
    } else {
      QRCode.toString(text, {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      }).then((svgString) => {
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `qrcode-nipzyy-${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorPresets = [
    { name: "Royal Blue", fg: "#1d4ed8", bg: "#ffffff" },
    { name: "Navy Dark", fg: "#0f172a", bg: "#ffffff" },
    { name: "Electric Sky", fg: "#0284c7", bg: "#f0f9ff" },
    { name: "Emerald Tech", fg: "#047857", bg: "#ffffff" },
    { name: "Deep Indigo", fg: "#4338ca", bg: "#ffffff" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls & Inputs */}
      <div className="lg:col-span-7 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>Teks atau URL:</span>
            <span className="text-xs text-slate-500 font-normal">
              {text.length} karakter
            </span>
          </label>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ketik teks, link web, pesan WhatsApp, atau kontak..."
              rows={4}
              className="w-full p-3.5 text-sm rounded-2xl border border-slate-200 dark:border-blue-900/60 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* Preset Palettes */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Palet Warna Populer:
          </label>
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setFgColor(preset.fg);
                  setBgColor(preset.bg);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                  fgColor === preset.fg
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: preset.fg }}
                />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Options */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Warna QR (Foreground):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 bg-transparent"
                />
                <span className="font-mono text-slate-600 dark:text-slate-400">
                  {fgColor}
                </span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Warna Background:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 bg-transparent"
                />
                <span className="font-mono text-slate-600 dark:text-slate-400">
                  {bgColor}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Ukuran Render: {size}px
              </label>
              <input
                type="range"
                min="180"
                max="450"
                step="10"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Koreksi Error (ECC):
              </label>
              <select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as any)}
                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="L">Level L (7% recovery)</option>
                <option value="M">Level M (15% recovery)</option>
                <option value="Q">Level Q (25% recovery)</option>
                <option value="H">Level H (30% recovery - Rekomendasi)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full max-w-sm p-6 rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900/80 shadow-xl flex flex-col items-center space-y-5">
          <div className="flex items-center justify-between w-full text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <QrCode className="w-4 h-4" />
              <span>Live QR Preview</span>
            </span>
            <span className="font-mono">{size}x{size}</span>
          </div>

          {/* QR Display */}
          <div className="p-4 rounded-2xl bg-white shadow-inner border border-slate-200/80 flex items-center justify-center min-h-[260px] min-w-[260px]">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="rounded-lg object-contain"
                style={{ width: `${Math.min(size, 240)}px`, height: `${Math.min(size, 240)}px` }}
              />
            ) : (
              <div className="text-center text-slate-400 text-xs py-10">
                Masukkan teks untuk membuat QR code
              </div>
            )}
          </div>

          {/* Download & Copy Buttons */}
          <div className="w-full space-y-2.5 pt-2">
            <button
              onClick={() => handleDownload("png")}
              disabled={!qrDataUrl}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handleCopyLink}
              disabled={!text}
              className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Teks Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks Sumber</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
