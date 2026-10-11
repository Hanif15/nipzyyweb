"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink, Info } from "lucide-react";

interface RichTextItem {
  plain_text?: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
}

interface BlockProps {
  block: any;
}

function renderRichText(richTextArray: RichTextItem[] | string | undefined) {
  if (!richTextArray) return null;
  if (typeof richTextArray === "string") return richTextArray;

  return richTextArray.map((t, idx) => {
    let content: React.ReactNode = t.plain_text;

    if (t.annotations?.bold) {
      content = <strong key={idx} className="font-semibold text-slate-900 dark:text-white">{content}</strong>;
    }
    if (t.annotations?.italic) {
      content = <em key={idx} className="italic">{content}</em>;
    }
    if (t.annotations?.underline) {
      content = <u key={idx} className="underline underline-offset-2">{content}</u>;
    }
    if (t.annotations?.strikethrough) {
      content = <s key={idx} className="line-through">{content}</s>;
    }
    if (t.annotations?.code) {
      content = (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded text-xs font-mono bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
        >
          {content}
        </code>
      );
    }
    if (t.href) {
      content = (
        <a
          key={idx}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
        >
          {content}
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
    }

    return <React.Fragment key={idx}>{content}</React.Fragment>;
  });
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
        <span className="uppercase font-semibold tracking-wider text-blue-400">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-blue-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function NotionBlockRenderer({ block }: BlockProps) {
  const { type } = block;

  // Handle mock block structure or official Notion block structure
  switch (type) {
    case "heading_1": {
      const text = block.heading_1?.rich_text || block.content?.text;
      return (
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-10 mb-4 pb-2 border-b border-blue-200 dark:border-blue-900/60">
          {renderRichText(text)}
        </h2>
      );
    }

    case "heading_2": {
      const text = block.heading_2?.rich_text || block.content?.text;
      return (
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block" />
          {renderRichText(text)}
        </h3>
      );
    }

    case "heading_3": {
      const text = block.heading_3?.rich_text || block.content?.text;
      return (
        <h4 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-2">
          {renderRichText(text)}
        </h4>
      );
    }

    case "paragraph": {
      const text = block.paragraph?.rich_text || block.content?.text;
      if (!text || (Array.isArray(text) && text.length === 0)) {
        return <div className="h-3" />;
      }
      return (
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 text-base sm:text-lg">
          {renderRichText(text)}
        </p>
      );
    }

    case "bulleted_list_item": {
      const text = block.bulleted_list_item?.rich_text || block.content?.text;
      return (
        <li className="flex items-start gap-2.5 mb-2 text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
          <span>{renderRichText(text)}</span>
        </li>
      );
    }

    case "numbered_list_item": {
      const text = block.numbered_list_item?.rich_text || block.content?.text;
      return (
        <li className="flex items-start gap-2.5 mb-2 text-slate-700 dark:text-slate-300 leading-relaxed list-decimal ml-4">
          <span>{renderRichText(text)}</span>
        </li>
      );
    }

    case "quote": {
      const text = block.quote?.rich_text || block.content?.text;
      return (
        <blockquote className="my-6 pl-4 border-l-4 border-blue-500 italic text-slate-800 dark:text-slate-200 bg-blue-50/60 dark:bg-blue-950/30 py-3 pr-4 rounded-r-lg">
          {renderRichText(text)}
        </blockquote>
      );
    }

    case "callout": {
      const text = block.callout?.rich_text || block.content?.text;
      const icon = block.callout?.icon?.emoji || block.content?.icon || "💡";
      return (
        <div className="my-6 flex items-start gap-3.5 p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/40 text-slate-800 dark:text-slate-200 shadow-sm">
          <span className="text-2xl shrink-0 select-none">{icon}</span>
          <div className="leading-relaxed flex-1 text-sm sm:text-base">
            {renderRichText(text)}
          </div>
        </div>
      );
    }

    case "code": {
      const text =
        block.code?.rich_text?.[0]?.plain_text ||
        (Array.isArray(block.code?.rich_text)
          ? block.code.rich_text.map((t: any) => t.plain_text).join("")
          : block.content?.text || "");
      const language = block.code?.language || block.content?.language || "bash";
      return <CodeBlock code={text} language={language} />;
    }

    case "image": {
      const url =
        block.image?.type === "external"
          ? block.image.external.url
          : block.image?.file?.url || block.content?.url;
      const caption =
        block.image?.caption?.[0]?.plain_text || block.content?.caption;

      if (!url) return null;
      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={caption || "Notion Image"}
              className="w-full h-auto object-cover max-h-[500px]"
              loading="lazy"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "divider": {
      return (
        <hr className="my-8 border-slate-200 dark:border-slate-800 border-dashed" />
      );
    }

    case "to_do": {
      const text = block.to_do?.rich_text || block.content?.text;
      const checked = block.to_do?.checked || false;
      return (
        <div className="flex items-center gap-2.5 my-2 text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={checked}
            readOnly
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
          />
          <span className={checked ? "line-through text-slate-400" : ""}>
            {renderRichText(text)}
          </span>
        </div>
      );
    }

    default:
      return null;
  }
}
