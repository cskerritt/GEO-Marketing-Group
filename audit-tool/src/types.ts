export interface AuditInput {
  website: string; // https://… (root used to derive sitemap)
  firm: string;
  location?: string;
  practiceAreas?: string[];
  competitors?: string[];
  maxPages: number;
}

export interface AuditFlags {
  dryRun: boolean; // crawl + extract only, no OpenAI calls
  visibility: boolean; // run web-search spot-check
  pdf: boolean; // render PDF (else HTML only)
}

export interface PageSignals {
  schemaTypes: string[];
  hasFaqSchema: boolean;
  questionHeadings: number;
  wordCount: number;
  hasMetaDescription: boolean;
  answerFirst: boolean;
}

export interface PageAudit {
  url: string;
  title?: string;
  signals: PageSignals;
  mainTextPreview: string;
  scores: { structure: number; schema: number; clarity: number; overall: number };
  topFixes: string[];
  error?: string;
}

export interface VisibilityResult {
  query: string;
  firmMentioned: boolean;
  firmCited: boolean;
  citations: string[];
  competitorsMentioned: string[];
  answerExcerpt: string;
  error?: string;
}

export interface SiteSignals {
  origin: string;
  https: boolean;
  hasLlmsTxt: boolean;
  aiBotsAllowed: boolean;
  sitemapFound: boolean;
  pageSpeed?: { performance: number; seo: number; lcp: number; cls: number };
}

export interface RoadmapPhase {
  horizon: '30' | '60' | '90';
  items: string[];
}

export interface AuditResult {
  input: AuditInput;
  generatedAt: string;
  site: SiteSignals;
  pages: PageAudit[];
  visibility: VisibilityResult[];
  scores: { citability: number; technical: number; visibility: number; overall: number };
  roadmap: RoadmapPhase[];
}
