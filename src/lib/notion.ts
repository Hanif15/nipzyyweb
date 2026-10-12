import { Client } from "@notionhq/client";
import { BlogPost } from "./types";
import { mockBlogPosts, mockPostContentBlocks } from "./mockData";

// Safe Notion client initialization
const apiKey = process.env.NOTION_API_KEY;
// User's provided Notion Database ID: 3f65be3e5dba801c81f9c7cf4db83075
const databaseId =
  process.env.NOTION_DATABASE_ID || "3f65be3e5dba801c81f9c7cf4db83075";

const notion = apiKey
  ? new Client({
      auth: apiKey,
    })
  : null;

export const isNotionConfigured = Boolean(apiKey && databaseId);

/**
 * Helper to safely extract plain text from Notion rich text arrays
 */
function getPlainText(richTextArray: any[] | undefined): string {
  if (!richTextArray || !Array.isArray(richTextArray)) return "";
  return richTextArray.map((t) => t.plain_text || "").join("");
}

/**
 * Helper to find property regardless of casing or alternative naming
 */
function findProp(props: Record<string, any>, possibleNames: string[]): any {
  if (!props) return null;
  const keys = Object.keys(props);
  for (const name of possibleNames) {
    const key = keys.find(
      (k) => k.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (key && props[key]) {
      return props[key];
    }
  }
  return null;
}

/**
 * Parse a raw Notion page into a typed BlogPost
 */
function parseNotionPageToBlogPost(page: any): BlogPost {
  const props = page.properties || {};

  // 1. Title: supports 'title', 'Title', 'Name', 'judul'
  const titleProp = findProp(props, ["title", "name", "judul"]);
  const title =
    getPlainText(titleProp?.title) ||
    getPlainText(titleProp?.rich_text) ||
    "Untitled Post";

  // 2. Slug: supports 'slug', 'Slug'
  const slugProp = findProp(props, ["slug"]);
  let slug =
    getPlainText(slugProp?.rich_text) ||
    getPlainText(slugProp?.title) ||
    (slugProp?.formula?.string ? slugProp.formula.string : "");

  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (!slug) {
    slug = page.id;
  }

  // 3. Summary: supports 'summary', 'Summary', 'description', 'desc', 'ringkasan'
  const summaryProp = findProp(props, [
    "summary",
    "description",
    "desc",
    "ringkasan",
  ]);
  const summary =
    getPlainText(summaryProp?.rich_text) ||
    getPlainText(summaryProp?.title) ||
    "";

  // 4. Date/Data: supports 'data', 'date', 'Date', 'Data', 'tanggal', 'created'
  const dateProp = findProp(props, [
    "data",
    "date",
    "tanggal",
    "created",
    "created_date",
  ]);
  let date =
    dateProp?.date?.start ||
    dateProp?.created_time ||
    getPlainText(dateProp?.rich_text) ||
    page.created_time?.split("T")[0] ||
    new Date().toISOString().split("T")[0];

  // 5. Tags: supports 'tags', 'Tags', 'category', 'kategori'
  const tagsProp = findProp(props, ["tags", "tag", "kategori", "category"]);
  let tags: string[] = [];
  if (tagsProp?.multi_select && Array.isArray(tagsProp.multi_select)) {
    tags = tagsProp.multi_select.map((item: any) => item.name);
  } else if (tagsProp?.select?.name) {
    tags = [tagsProp.select.name];
  }

  // 6. Cover image
  let coverImage: string | undefined = undefined;
  if (page.cover) {
    coverImage =
      page.cover.type === "external"
        ? page.cover.external.url
        : page.cover.file?.url;
  }

  // Fallback cover gradient image if none provided in Notion
  if (!coverImage) {
    coverImage =
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80";
  }

  // 7. Published: supports 'published', 'Published', 'publish', 'status'
  const publishedProp = findProp(props, [
    "published",
    "publish",
    "ispublished",
    "status",
  ]);
  let isPublished = true;
  if (publishedProp?.checkbox !== undefined) {
    isPublished = publishedProp.checkbox;
  } else if (publishedProp?.status?.name) {
    const statusName = publishedProp.status.name.toLowerCase();
    isPublished = statusName === "published" || statusName === "done";
  } else if (publishedProp?.select?.name) {
    isPublished = publishedProp.select.name.toLowerCase() === "published";
  }

  // Estimate read time: assume full article is ~12x the summary word count (typical ratio),
  // reading speed 200 wpm; clamp to 2–20 min range for realism.
  const summaryWords = summary.trim().split(/\s+/).filter(Boolean).length;
  const estimatedArticleWords = Math.max(summaryWords * 12, 300);
  const readMinutes = Math.min(20, Math.max(2, Math.round(estimatedArticleWords / 200)));
  const readTime = `${readMinutes} min read`;

  return {
    id: page.id,
    slug,
    title,
    summary,
    date,
    tags: tags.length > 0 ? tags : ["Article"],
    coverImage,
    readTime,
    author: "Hanif Sabillah",
    isPublished,
  };
}

/**
 * Universal query helper that supports Notion SDK v5 DataSources and Databases
 */
async function queryNotionDatabasePages(): Promise<any[]> {
  if (!notion || !apiKey) return [];

  // Try Notion SDK v5 dataSources query
  try {
    const db: any = await notion.databases.retrieve({
      database_id: databaseId,
    });
    if (db && db.data_sources && db.data_sources.length > 0) {
      const dataSourceId = db.data_sources[0].id;
      const res: any = await (notion as any).dataSources.query({
        data_source_id: dataSourceId,
      });
      if (res && Array.isArray(res.results)) {
        return res.results;
      }
    }
  } catch (err) {
    // If database retrieve didn't work directly, try data_source query directly with databaseId
    try {
      const res: any = await (notion as any).dataSources.query({
        data_source_id: databaseId,
      });
      if (res && Array.isArray(res.results)) {
        return res.results;
      }
    } catch {
      // ignore
    }
  }

  // Fallback to legacy databases query
  try {
    const res: any = await (notion as any).databases.query({
      database_id: databaseId,
    });
    if (res && Array.isArray(res.results)) {
      return res.results;
    }
  } catch {
    // ignore
  }

  return [];
}

/**
 * Fetch all published articles from Notion Database
 * Falls back to mock data if Notion credentials are not configured or error occurs.
 */
export async function getPublishedArticles(): Promise<{
  articles: BlogPost[];
  isUsingMock: boolean;
}> {
  if (!notion || !apiKey) {
    return {
      articles: mockBlogPosts,
      isUsingMock: true,
    };
  }

  try {
    const rawPages = await queryNotionDatabasePages();

    if (!rawPages || rawPages.length === 0) {
      return {
        articles: mockBlogPosts,
        isUsingMock: true,
      };
    }

    const articles: BlogPost[] = rawPages.map((page: any) =>
      parseNotionPageToBlogPost(page)
    );

    const publishedOnly = articles.filter((a) => a.isPublished);

    // Sort descending by date
    publishedOnly.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    if (publishedOnly.length === 0) {
      // If there are articles in Notion but none marked Published=true, return all of them or mock
      return {
        articles: articles.length > 0 ? articles : mockBlogPosts,
        isUsingMock: false,
      };
    }

    return {
      articles: publishedOnly,
      isUsingMock: false,
    };
  } catch (error) {
    console.error("Notion API query error, falling back to mock data:", error);
    return {
      articles: mockBlogPosts,
      isUsingMock: true,
    };
  }
}

/**
 * Fetch a single article by its slug
 */
export async function getArticleBySlug(slug: string): Promise<{
  article: BlogPost | null;
  blocks: any[];
  isUsingMock: boolean;
}> {
  const mockPost = mockBlogPosts.find((p) => p.slug === slug);

  if (!notion || !apiKey) {
    return {
      article: mockPost || null,
      blocks: (mockPost && mockPostContentBlocks[mockPost.slug]) || [],
      isUsingMock: true,
    };
  }

  try {
    const pages = await queryNotionDatabasePages();
    const matchedPage = pages.find((page: any) => {
      const parsed = parseNotionPageToBlogPost(page);
      return parsed.slug === slug || page.id === slug;
    });

    if (!matchedPage) {
      if (mockPost) {
        return {
          article: mockPost,
          blocks: mockPostContentBlocks[mockPost.slug] || [],
          isUsingMock: true,
        };
      }
      return { article: null, blocks: [], isUsingMock: false };
    }

    const article = parseNotionPageToBlogPost(matchedPage);

    // Fetch page blocks from Notion
    let blocks: any[] = [];
    try {
      const blocksResponse = await notion.blocks.children.list({
        block_id: matchedPage.id,
        page_size: 100,
      });
      blocks = blocksResponse.results || [];
    } catch (blockErr) {
      console.warn("Could not fetch Notion blocks:", blockErr);
    }

    // Calculate accurate read time based on the actual blocks content
    if (blocks.length > 0) {
      article.readTime = calculateReadTimeFromBlocks(blocks);
    }

    return {
      article,
      blocks,
      isUsingMock: false,
    };
  } catch (error) {
    console.error("Notion fetch single article error:", error);
    const fallbackBlocks = (mockPost && mockPostContentBlocks[mockPost.slug]) || [];
    const fallbackArticle = mockPost ? { ...mockPost } : null;
    if (fallbackArticle && fallbackBlocks.length > 0) {
      fallbackArticle.readTime = calculateReadTimeFromBlocks(fallbackBlocks);
    }
    return {
      article: fallbackArticle,
      blocks: fallbackBlocks,
      isUsingMock: true,
    };
  }
}

/**
 * Calculates accurate reading time based on total words in all blocks of a blog post
 */
export function calculateReadTimeFromBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return "1 min read";
  }

  let totalWords = 0;

  for (const block of blocks) {
    // Support Notion SDK raw blocks and mock content blocks
    const type = block.type;
    const data = block[type] || block.content || {};

    let textContent = "";
    if (Array.isArray(data.rich_text)) {
      textContent = data.rich_text.map((t: any) => t.plain_text || "").join(" ");
    } else if (typeof data.text === "string") {
      textContent = data.text;
    } else if (typeof data.rich_text === "string") {
      textContent = data.rich_text;
    }

    if (textContent) {
      const words = textContent.trim().split(/\s+/).filter(Boolean);
      totalWords += words.length;
    }
  }

  // Average reading speed: 200 words per minute
  const minutes = Math.max(1, Math.ceil(totalWords / 200));
  return `${minutes} min read`;
}

