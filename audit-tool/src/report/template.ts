import { config } from '../config.js';
import type { AuditResult, PageAudit } from '../types.js';

function scoreColor(n: number): string {
  if (n >= 80) return '#16a34a';
  if (n >= 60) return '#2563EB';
  if (n >= 40) return '#d97706';
  return '#dc2626';
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
}

function gauge(label: string, n: number): string {
  return `<div class="gauge">
    <div class="gauge-num" style="color:${scoreColor(n)}">${n}<span>/100</span></div>
    <div class="gauge-label">${esc(label)}</div>
    <div class="bar"><span style="width:${n}%;background:${scoreColor(n)}"></span></div>
  </div>`;
}

function pageRow(p: PageAudit): string {
  if (p.error) {
    return `<tr><td>${esc(shortPath(p.url))}</td><td colspan="4" class="err">audit error: ${esc(p.error)}</td></tr>`;
  }
  const fixes = p.topFixes.map((f) => `<li>${esc(f)}</li>`).join('');
  return `<tr>
    <td><div class="pg-title">${esc(p.title ?? shortPath(p.url))}</div><div class="pg-url">${esc(shortPath(p.url))}</div></td>
    <td class="num" style="color:${scoreColor(p.scores.structure)}">${p.scores.structure}</td>
    <td class="num" style="color:${scoreColor(p.scores.schema)}">${p.scores.schema}</td>
    <td class="num" style="color:${scoreColor(p.scores.clarity)}">${p.scores.clarity}</td>
    <td class="num strong" style="color:${scoreColor(p.scores.overall)}">${p.scores.overall}</td>
  </tr>
  <tr class="fixes"><td colspan="5"><strong>Top fixes:</strong><ul>${fixes}</ul></td></tr>`;
}

function shortPath(url: string): string {
  try { return new URL(url).pathname || '/'; } catch { return url; }
}

export function renderHtml(r: AuditResult): string {
  const d = r.generatedAt.slice(0, 10);
  const visRan = r.visibility.some((v) => !v.error);

  const visRows = r.visibility
    .map((v) => {
      const status = v.error
        ? `<span class="tag err">error</span>`
        : v.firmCited
        ? `<span class="tag good">cited ✓</span>`
        : v.firmMentioned
        ? `<span class="tag ok">mentioned</span>`
        : `<span class="tag bad">absent</span>`;
      const comp = v.competitorsMentioned.length
        ? `<div class="comp">Competitors named: ${esc(v.competitorsMentioned.join(', '))}</div>`
        : '';
      return `<tr><td>${esc(v.query)}</td><td>${status}</td></tr>
        ${comp ? `<tr><td colspan="2" class="comp-row">${comp}</td></tr>` : ''}`;
    })
    .join('');

  const roadmap = r.roadmap
    .map(
      (ph) => `<div class="phase">
        <div class="phase-h">${ph.horizon}-day</div>
        <ul>${ph.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`
    )
    .join('');

  const w = config.weights;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
  :root{--navy:#0B132B;--deep:#050B1A;--blue:#2563EB;--violet:#7C3AED;--cyan:#22D3EE;--slate:#475569;--fog:#E5E7EB}
  *{box-sizing:border-box} body{margin:0;font-family:'Space Grotesk',system-ui,sans-serif;color:var(--navy);font-size:13px;line-height:1.5}
  .grad{background:linear-gradient(120deg,#2563EB,#7C3AED 60%,#22D3EE)}
  .gradtext{background:linear-gradient(120deg,#2563EB,#7C3AED 60%,#22D3EE);-webkit-background-clip:text;background-clip:text;color:transparent}
  .mono{font-family:'JetBrains Mono',monospace}
  .cover{background:var(--deep);color:#fff;padding:54px 48px;position:relative;overflow:hidden}
  .cover::before{content:'';position:absolute;inset:0;background:radial-gradient(at 12% 0%,rgba(37,99,235,.4),transparent 50%),radial-gradient(at 90% 20%,rgba(124,58,237,.32),transparent 45%)}
  .cover>*{position:relative}
  .eyebrow{font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.22em;font-size:10px;color:var(--cyan)}
  h1{font-size:34px;letter-spacing:-1px;margin:10px 0 4px}
  .sub{color:rgba(255,255,255,.6);font-size:14px}
  .wrap{padding:36px 48px}
  h2{font-size:20px;letter-spacing:-.5px;margin:34px 0 14px;border-top:3px solid;border-image:linear-gradient(120deg,#2563EB,#7C3AED,#22D3EE) 1;padding-top:14px}
  .gauges{display:flex;gap:28px;margin-top:26px}
  .gauge{flex:1}
  .gauge-num{font-size:40px;font-weight:700;line-height:1} .gauge-num span{font-size:14px;color:var(--slate)}
  .gauge-label{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.6);margin:6px 0}
  .bar{height:5px;background:rgba(255,255,255,.12);border-radius:99px;overflow:hidden} .bar span{display:block;height:100%}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--slate);border-bottom:1px solid var(--fog);padding:8px 6px}
  td{padding:8px 6px;border-bottom:1px solid var(--fog);vertical-align:top}
  td.num{text-align:center;font-weight:500} td.num.strong{font-weight:700}
  .pg-title{font-weight:500} .pg-url{color:var(--slate);font-family:'JetBrains Mono',monospace;font-size:10px}
  tr.fixes td{border-bottom:1px solid var(--fog);background:#F8FAFC;color:var(--slate)} tr.fixes ul{margin:4px 0 4px 16px;padding:0}
  .tag{font-family:'JetBrains Mono',monospace;font-size:10px;padding:2px 8px;border-radius:99px}
  .tag.good{background:rgba(22,163,74,.12);color:#16a34a} .tag.ok{background:rgba(37,99,235,.1);color:#2563EB}
  .tag.bad{background:rgba(220,38,38,.1);color:#dc2626} .tag.err{background:#eee;color:#888}
  .comp-row{color:var(--slate);font-size:11px;padding-top:0;border:0}
  .chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
  .chip{font-family:'JetBrains Mono',monospace;font-size:10px;padding:4px 10px;border:1px solid var(--fog);border-radius:99px;color:var(--slate)}
  .chip.on{border-color:var(--blue);color:var(--blue)} .chip.off{color:#bbb}
  .phases{display:flex;gap:16px;margin-top:8px} .phase{flex:1;border:1px solid var(--fog);border-radius:12px;padding:14px}
  .phase-h{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;color:var(--blue);text-transform:uppercase} .phase ul{margin:8px 0 0 16px;padding:0;color:var(--slate)} .phase li{margin-bottom:6px}
  .note{color:var(--slate);font-size:11px;margin-top:8px}
  .err{color:#dc2626}
  footer{padding:20px 48px;color:var(--slate);font-size:10px;font-family:'JetBrains Mono',monospace;border-top:1px solid var(--fog)}
</style></head><body>

<section class="cover">
  <div class="eyebrow">GEO Marketing Group · GEO/AEO/SEO Audit</div>
  <h1>${esc(r.input.firm)}</h1>
  <div class="sub">${esc(r.input.website)}${r.input.location ? ' · ' + esc(r.input.location) : ''} · ${d}</div>
  <div class="gauges">
    ${gauge('Overall', r.scores.overall)}
    ${gauge('Citability', r.scores.citability)}
    ${gauge('Technical', r.scores.technical)}
    ${gauge(visRan ? 'AI Visibility' : 'Visibility (n/a)', r.scores.visibility)}
  </div>
</section>

<div class="wrap">
  <h2>Site signals</h2>
  <div class="chips">
    <span class="chip ${r.site.https ? 'on' : 'off'}">HTTPS ${r.site.https ? '✓' : '✕'}</span>
    <span class="chip ${r.site.sitemapFound ? 'on' : 'off'}">Sitemap ${r.site.sitemapFound ? '✓' : '✕'}</span>
    <span class="chip ${r.site.hasLlmsTxt ? 'on' : 'off'}">llms.txt ${r.site.hasLlmsTxt ? '✓' : '✕'}</span>
    <span class="chip ${r.site.aiBotsAllowed ? 'on' : 'off'}">AI crawlers ${r.site.aiBotsAllowed ? 'allowed' : 'blocked'}</span>
    ${r.site.pageSpeed ? `<span class="chip on">Lighthouse SEO ${r.site.pageSpeed.seo}</span><span class="chip on">Performance ${r.site.pageSpeed.performance}</span><span class="chip on">LCP ${r.site.pageSpeed.lcp}s</span>` : ''}
  </div>

  <h2>Page-by-page citability (${r.pages.length} pages)</h2>
  <table>
    <thead><tr><th>Page</th><th>Structure</th><th>Schema</th><th>Clarity</th><th>Overall</th></tr></thead>
    <tbody>${r.pages.map(pageRow).join('')}</tbody>
  </table>

  <h2>AI visibility spot-check</h2>
  ${
    visRan
      ? `<table><thead><tr><th>Buyer query</th><th>Result</th></tr></thead><tbody>${visRows}</tbody></table>`
      : `<p class="note">Visibility spot-check was not run for this audit.</p>`
  }

  <h2>30 / 60 / 90-day roadmap</h2>
  <div class="phases">${roadmap}</div>

  <p class="note">Scoring blend: ${Math.round(w.citability * 100)}% citability · ${Math.round(w.technical * 100)}% technical · ${Math.round(w.visibility * 100)}% visibility. Page scores reflect AI-readiness; the visibility spot-check is a sample of live AI answers, not a guarantee.</p>
</div>

<footer>GEO Marketing Group · geomarketinggroup.org · Generated ${esc(r.generatedAt)}</footer>
</body></html>`;
}
