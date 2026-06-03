import type OpenAI from 'openai';
import { config } from './config.js';
import type { ExtractedPage } from './extract.js';
import type { PageAudit } from './types.js';

const SYSTEM = `You are a senior Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) auditor.
You grade a SINGLE web page on how citable it is by AI answer engines (ChatGPT, Perplexity, Claude, Google AI Overviews).
Score each dimension 0–100:
- structure: is the answer extractable? (clear headings, lists, tables, FAQ, an answer-first opening AI can lift verbatim)
- schema: appropriate structured data (Article/FAQPage/Service/Organization etc.) present for the page's purpose
- clarity: direct, specific, citable language — named facts, defined terms, no burying the answer
- overall: your holistic citability score for this page
Then give 1–4 concrete, page-SPECIFIC fixes (not generic advice). Use the provided signals and content. Be strict; most unoptimized pages score 40–65.`;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    structure: { type: 'integer', minimum: 0, maximum: 100 },
    schema: { type: 'integer', minimum: 0, maximum: 100 },
    clarity: { type: 'integer', minimum: 0, maximum: 100 },
    overall: { type: 'integer', minimum: 0, maximum: 100 },
    topFixes: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 4 },
  },
  required: ['structure', 'schema', 'clarity', 'overall', 'topFixes'],
} as const;

export async function auditPage(client: OpenAI, page: ExtractedPage): Promise<PageAudit> {
  const base: PageAudit = {
    url: page.url,
    title: page.title,
    signals: page.signals,
    mainTextPreview: page.mainText.slice(0, 300),
    scores: { structure: 0, schema: 0, clarity: 0, overall: 0 },
    topFixes: [],
  };

  try {
    const res = await client.chat.completions.create({
      model: config.model,
      temperature: 0.2,
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'page_audit', strict: true, schema: SCHEMA },
      },
      messages: [
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content: JSON.stringify({
            url: page.url,
            title: page.title,
            signals: page.signals,
            content: page.mainText,
          }),
        },
      ],
    });
    const parsed = JSON.parse(res.choices[0]?.message?.content ?? '{}');
    return {
      ...base,
      scores: {
        structure: parsed.structure ?? 0,
        schema: parsed.schema ?? 0,
        clarity: parsed.clarity ?? 0,
        overall: parsed.overall ?? 0,
      },
      topFixes: Array.isArray(parsed.topFixes) ? parsed.topFixes : [],
    };
  } catch (e) {
    return { ...base, error: e instanceof Error ? e.message : String(e) };
  }
}
