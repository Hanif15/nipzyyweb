export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  coverImage?: string;
  author?: string;
  readTime?: string;
  isPublished?: boolean;
}

export interface NotionBlock {
  id: string;
  type: string;
  content: any;
}

export interface Product {
  id: string;
  title: string;
  tagline: string;
  category: "Web App" | "AI & SaaS" | "Developer Tools" | "Open Source" | "Mobile";
  description: string;
  coverImage: string;
  tags: string[];
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  status: "Live" | "Beta" | "In Development";
}

// Legacy interfaces kept for backward compatibility if needed
export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: "journal" | "conference" | "preprint" | "book_chapter";
  abstract: string;
  doi?: string;
  pdfUrl?: string;
  codeUrl?: string;
  bibtex: string;
  highlighted?: boolean;
}

export interface DesignProject {
  id: string;
  title: string;
  category: "UI/UX" | "Web Design" | "Branding" | "Mobile App";
  description: string;
  coverImage: string;
  galleryImages: string[];
  tools: string[];
  year: number;
  client?: string;
  liveUrl?: string;
  figmaUrl?: string;
  caseStudy: {
    challenge: string;
    solution: string;
    outcome: string;
  };
  featured?: boolean;
}
