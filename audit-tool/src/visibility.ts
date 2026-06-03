import type OpenAI from 'openai';
import { config } from './config.js';
import type { AuditInput, VisibilityResult } from './types.js';

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function generateQueries(input: AuditInput): string[] {
  const loc = input.location ? ` in ${input.location}` : '';
  const areas = input.practiceAreas?.length ? input.practiceAreas : ['services'];
  const qs: string[] = [];
  for (const a of areas.slice(0, 3)) {
    qs.push(`Who are the best ${a} firms${loc}?`);
    qs.push(`Recommend a top ${a} firm${loc}.`);
  }
  return [...new Set(qs)].slice(0, 6);
}

/** Pull url_citation annotations out of a Responses API result, defensively. */
function extractCitations(res: any): string[] {
  const urls = new Set<string>();
  const out = res?.output;
  if (Array.isArray(out)) {
    for (const item of out) {
      const content = item?.content;
      if (Array.isArray(content)) {
        for (const c of content) {
          const anns = c?.annotations;
          if (Array.isArray(anns)) {
            for (const a of anns) {
              if (a?.url) urls.add(String(a.url));
            }
          }
        }
      }
    }
  }
  return [...urls];
}

export async function checkVisibility(
  client: OpenAI,
  input: AuditInput,
  query: string
): Promise<VisibilityResult> {
  try {
    // Responses API with the hosted web_search tool.
    const res: any = await (client as any).responses.create({
      model: config.model,
      tools: [{ type: 'web_search' }],
      input: query,
    });

    const text: string = res?.output_text ?? '';
    const citations = extractCitations(res);
    const firmDomain = new URL(input.website).hostname.replace(/^www\./, '');

    const firmMentioned = new RegExp(escapeRe(input.firm), 'i').test(text);
    const firmCited =
      citations.some((c) => c.includes(firmDomain)) ||
      new RegExp(escapeRe(firmDomain), 'i').test(text);
    const competitorsMentioned = (input.competitors ?? []).filter((c) =>
      new RegExp(escapeRe(c), 'i').test(text)
    );

    return {
      query,
      firmMentioned,
      firmCited,
      citations,
      competitorsMentioned,
      answerExcerpt: text.slice(0, 400),
    };
  } catch (e) {
    return {
      query,
      firmMentioned: false,
      firmCited: false,
      citations: [],
      competitorsMentioned: [],
      answerExcerpt: '',
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
