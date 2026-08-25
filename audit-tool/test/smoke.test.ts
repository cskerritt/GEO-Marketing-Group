import assert from 'node:assert/strict';
import test from 'node:test';
import { assertOpenAiKeyConfigured, isUsableOpenAiKey } from '../src/config.js';
import { extractPage } from '../src/extract.js';
import { renderHtml } from '../src/report/template.js';
import { assembleScores, buildRoadmap } from '../src/score.js';
import type { AuditInput, AuditResult, PageAudit, SiteSignals, VisibilityResult } from '../src/types.js';
import { generateQueries } from '../src/visibility.js';

test('OpenAI key validation stays keyless for dry runs and rejects placeholders', () => {
  assert.doesNotThrow(() => assertOpenAiKeyConfigured(true, ''));

  for (const value of ['', 'sk-...', 'sk-your-key-here', 'your_openai_api_key', '<key>']) {
    assert.equal(isUsableOpenAiKey(value), false);
    assert.throws(
      () => assertOpenAiKeyConfigured(false, value),
      /missing or still a placeholder/
    );
  }

  assert.doesNotThrow(() =>
    assertOpenAiKeyConfigured(false, 'sk-proj-example-value-not-used-by-this-test')
  );
});

test('core extraction, scoring, query, and HTML-report pipeline is deterministic', () => {
  const page = extractPage(
    'https://example.test/services/advisory',
    `<!doctype html><html><head>
      <title>Advisory Services</title>
      <meta name="description" content="Clear advisory service description">
      <script type="application/ld+json">{"@type":"FAQPage"}</script>
    </head><body><main>
      <h1>Advisory Services</h1>
      <h2>What does the advisory service include?</h2>
      <p>Our advisory service gives professional firms a direct, detailed answer and a practical plan they can apply immediately.</p>
    </main></body></html>`
  );

  assert.equal(page.title, 'Advisory Services');
  assert.equal(page.signals.hasFaqSchema, true);
  assert.equal(page.signals.questionHeadings, 1);
  assert.equal(page.signals.hasMetaDescription, true);
  assert.equal(page.signals.answerFirst, true);

  const input: AuditInput = {
    website: 'https://example.test',
    firm: 'Example Advisory',
    location: 'Providence, RI',
    practiceAreas: ['advisory'],
    maxPages: 1,
  };
  assert.deepEqual(generateQueries(input), [
    'Who are the best advisory firms in Providence, RI?',
    'Recommend a top advisory firm in Providence, RI.',
  ]);

  const pageAudit: PageAudit = {
    url: page.url,
    title: page.title,
    signals: page.signals,
    mainTextPreview: page.mainText.slice(0, 300),
    scores: { structure: 80, schema: 80, clarity: 80, overall: 80 },
    topFixes: ['Keep the answer-first introduction current.'],
  };
  const site: SiteSignals = {
    origin: 'https://example.test',
    https: true,
    hasLlmsTxt: true,
    aiBotsAllowed: true,
    sitemapFound: true,
  };
  const visibility: VisibilityResult[] = [
    {
      query: 'Who are the best advisory firms in Providence, RI?',
      firmMentioned: true,
      firmCited: true,
      citations: ['https://example.test/services/advisory'],
      competitorsMentioned: [],
      answerExcerpt: 'Example Advisory is cited.',
    },
  ];
  const pages = [pageAudit];
  const scores = assembleScores(pages, site, visibility);
  assert.deepEqual(scores, { citability: 80, technical: 100, visibility: 100, overall: 91 });

  const result: AuditResult = {
    input,
    generatedAt: '2026-08-25T12:00:00.000Z',
    site,
    pages,
    visibility,
    scores,
    roadmap: buildRoadmap(pages, site, visibility),
  };
  const html = renderHtml(result);
  assert.match(html, /Example Advisory/);
  assert.match(html, /Advisory Services/);
  assert.match(html, /91<span>\/100<\/span>/);
});
