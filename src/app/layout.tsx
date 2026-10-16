import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nipzyy - Personal Blog",
  description:
    "Personal blog website Nipzyy by Hanif Sabillah: technical writings, thoughts, and live blog powered by Notion API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className="dark">
      <body className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-[#060b13] dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <ThemeProvider>
          <div className="relative min-h-screen flex flex-col overflow-x-clip">
            {/* Ambient blue background glows */}
            <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl -z-10 rounded-full dark:from-blue-600/20 dark:via-blue-800/10" />
            <div className="pointer-events-none fixed top-1/3 -left-48 w-96 h-96 bg-sky-500/10 blur-3xl -z-10 rounded-full dark:bg-sky-600/10" />
            <div className="pointer-events-none fixed bottom-10 -right-48 w-96 h-96 bg-blue-600/10 blur-3xl -z-10 rounded-full dark:bg-indigo-600/15" />

            <Suspense fallback={<div className="h-16" />}>
              <Navbar />
            </Suspense>

            <div className="flex-1 pt-24">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
