"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import {
  Package,
  Search,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

interface Props {
  products: Product[];
}

export function ProductGallery({ products }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(p.category));
    return ["all", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        selectedCategory === "all" || prod.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        prod.title.toLowerCase().includes(query) ||
        prod.description.toLowerCase().includes(query) ||
        prod.tagline.toLowerCase().includes(query) ||
        prod.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400"
              }`}
            >
              {cat === "all" ? `Semua Produk (${products.length})` : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari produk atau teknologi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
          <Package className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Tidak ada produk yang cocok dengan pencarian &quot;{searchQuery}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 dark:border-blue-950 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl"
            >
              {/* Cover Image */}
              <div className="h-56 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white shadow-md">
                    {product.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold backdrop-blur-md ${
                      product.status === "Live"
                        ? "bg-emerald-500/80 text-white"
                        : product.status === "Beta"
                        ? "bg-amber-500/80 text-white"
                        : "bg-slate-700/80 text-white"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {product.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                    {product.tagline}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                  {product.description}
                </p>

                {/* Key Features */}
                {product.features.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                      Fitur Utama:
                    </span>
                    <ul className="space-y-1">
                      {product.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[11px] font-mono font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {product.githubUrl && (
                      <a
                        href={product.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    )}
                  </div>

                  {product.liveUrl && (
                    <Link
                      href={product.liveUrl}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all hover:gap-2"
                    >
                      <span>Kunjungi Produk</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
