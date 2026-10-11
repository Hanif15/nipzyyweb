import React from "react";
import { mockProducts, profileData } from "@/lib/mockData";
import { ProductGallery } from "./ProductGallery";
import { Package, Sparkles } from "lucide-react";

export const metadata = {
  title: `Produk & Showcase — ${profileData.brandName}`,
  description: "Koleksi aplikasi web, SaaS, dan developer tools karya Hanif Sabillah.",
};

export default function ProductPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold backdrop-blur-sm shadow-xs">
          <Package className="w-3.5 h-3.5 text-blue-500" />
          <span>Product Showcase</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Produk &amp; Karya Digital
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Jelajahi inovasi produk, developer micro-tools, dan arsitektur aplikasi berbasis cloud yang dibangun dengan fokus pada performa maksimal dan pengalaman pengguna yang mulus.
        </p>
      </div>

      {/* Main Gallery */}
      <ProductGallery products={mockProducts} />
    </div>
  );
}
