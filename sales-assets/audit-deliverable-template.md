# GEO Audit — Deliverable Template

This is the template GEO uses for every productized GEO Audit. Copy this file, rename it to `audits/[date]-[firm-slug]-audit.md`, fill in the bracketed sections, deliver as a polished PDF.

**Standard delivery:** 5 business days from kickoff call. Each audit is ~12–16 pages when polished.

---

# GEO Audit — [Firm Name]

**Prepared for:** [Decision-maker name, role]
**Firm:** [Firm Name]
**Industry:** [Law / CPA / Consulting / Financial Advisors / A&E]
**Audit date:** [YYYY-MM-DD]
**Prepared by:** Chris Skerritt, GEO
**Audit ID:** [4-digit sequential]

---

## 1. Executive Summary

**Current AI visibility:** [Strong / Moderate / Weak / Invisible]

**Top 3 findings:**

1. **[Finding 1]** — [1 sentence describing the finding and its implication]
2. **[Finding 2]** — [1 sentence]
3. **[Finding 3]** — [1 sentence]

**Top 3 opportunities (ranked by impact / effort):**

1. **[Opportunity 1]** — [Estimated 30-day citation lift: X%; effort: low/med/high]
2. **[Opportunity 2]** — [Estimated lift; effort]
3. **[Opportunity 3]** — [Estimated lift; effort]

**Recommended next step:** [GEO Foundation / GEO Build / Specific custom recommendation]

---

## 2. Citation Baseline (5 AI Engines)

For each priority query (defined with the firm at kickoff), we record what each AI engine returns. Below is the verbatim or paraphrased answer from each engine, with an "appears" / "does not appear" verdict.

### Priority Query 1: *"[query, e.g., Who's a good business litigation attorney in Providence?]"*

| Engine | Firm appears? | Engines' top 3 firms | Notes |
|---|---|---|---|
| ChatGPT (GPT-4 model in use as of audit date) | [Yes / No] | [Firm A, Firm B, Firm C] | [Any notable framing] |
| Claude (Sonnet model) | [Yes / No] | [Firm A, Firm B, Firm C] | |
| Perplexity | [Yes / No] | [Firm A, Firm B, Firm C] | |
| Google AI Overviews | [Yes / No] | [Firm A, Firm B, Firm C] | |
| Gemini | [Yes / No] | [Firm A, Firm B, Firm C] | |

### Priority Query 2: *"[query]"*

[Same table structure]

### Priority Query 3: *"[query]"*

[Same table structure]

### [Up to 5 priority queries total]

### Summary across queries

- **Citations earned this audit:** [N out of 5 queries × 5 engines = N/25]
- **Most-citing engine:** [engine name]
- **Least-citing engine:** [engine name]
- **Most-cited competitor:** [firm name] (cited [N] times)

---

## 3. Schema & Structured Data Audit

We crawl the firm's site and report what schema is present, what's missing, and what's broken.

### Currently deployed schema

| Page | Schema types present | Validity |
|---|---|---|
| [URL 1] | [e.g., Organization, BreadcrumbList] | [Valid / Errors] |
| [URL 2] | [e.g., LegalService, FAQPage] | [Valid / Errors] |
| [...] | | |

### Missing schema (recommended additions)

| Page | Schema type recommended | Why |
|---|---|---|
| Home | Organization, LocalBusiness | Establishes the firm as a structured entity for AI engines |
| Each service / practice page | LegalService / AccountingService / FinancialService / etc. | 2–3× citation weight multiplier ([upGrowth, 2026](https://upgrowth.in/citation-algorithm-chatgpt-perplexity-gemini-ai-overviews-2026/)) |
| Each attorney/partner bio page | Person (with credentials, bar admissions, education) | E-E-A-T signal AI engines look for |
| Each FAQ-bearing page | FAQPage | Disproportionate B2B citation lift |
| Insights / blog posts | Article (with author, datePublished, dateModified) | Required for citation reranker |

### Broken or invalid schema

[List any present-but-broken schema with diagnosis]

### Validation references

- [Google Rich Results Test](https://search.google.com/test/rich-results) screenshot for each major page
- [Schema.org Validator](https://validator.schema.org/) results

---

## 4. Content Citability Scoring

Each page is scored on the Aggarwal et al. ([2023](https://arxiv.org/pdf/2311.09735)) GEO methodology: front-loaded specificity, question-shaped headers, citable statistics, structured answers.

| Page | Front-loaded answer? | Question headers? | Citable stats? | FAQ block? | Citability score (1–5) |
|---|---|---|---|---|---|
| Home | [Yes/No] | [Yes/No] | [Yes/No] | [Yes/No] | [N/5] |
| [Top 10 pages...] | | | | | |

**Average citability score:** [X.X/5.0]

**Pages most in need of restructuring:** [list top 3]

**Highest-leverage single rewrite:** [identify the page where rewriting would produce the largest citation lift]

---

## 5. Competitive Citation Map

We ran the same priority queries against 5 named peer firms (defined with the firm at kickoff) to identify which competitors are getting cited and on what topics.

| Peer firm | Citations earned (out of 25) | Most-citing engine | Notable strength |
|---|---|---|---|
| [Peer 1] | [N/25] | [engine] | [e.g., Reddit presence; bylined column in Lawyers Weekly] |
| [Peer 2] | [N/25] | [engine] | |
| [Peer 3] | [N/25] | [engine] | |
| [Peer 4] | [N/25] | [engine] | |
| [Peer 5] | [N/25] | [engine] | |

**Patterns:**

- [What the well-cited peer firms have in common]
- [What the firm being audited is missing relative to peers]
- [Whitespace where no peer is yet winning]

---

## 6. Authority Signals Inventory

### Earned media / bylines / awards

[Inventory the firm's existing earned media — Bar Journal articles, trade publications, awards, speaking. AI engines triangulate against these.]

### Founder / partner thought leadership

[Inventory the firm's published partner content, LinkedIn presence, podcast appearances, conference speaking. Identify gaps.]

### Reviews architecture (compliance-friendly)

[Inventory presence and consistency on Avvo, Justia, Google Business Profile, Martindale-Hubbell (for law) — or RISCPA, Yelp, etc. for other verticals. Flag inconsistent NAP data.]

### Internal entity coherence

[Note any variant firm-name spellings or inconsistent address data across the open web.]

---

## 7. 30 / 60 / 90 Day Roadmap

### Days 1–30 (Foundation)

- [ ] **Schema deployment** — Organization, LocalBusiness, Service-type, Person, FAQPage, BreadcrumbList. Estimated effort: [Y hours]. Expected lift: [Z]%.
- [ ] **Top 5 page rewrites for "first 200 words = answer"** — [pages listed]. Effort: [Y hours]. Expected lift: [Z]%.
- [ ] **FAQ block deployment** on top 5 pages — 8–10 entries each, schema-marked. Effort: [Y hours].
- [ ] **llms.txt** published at root. Effort: [low].
- [ ] **Baseline reading documented** — this audit is the baseline; recheck in 30 days.

### Days 31–60 (Authority + Publication)

- [ ] **First bylined article** drafted and pitched to [trade publication]. Effort: [Y hours].
- [ ] **First vertical-specific deep-dive** published on the firm's site. Effort: [Y hours].
- [ ] **Founder LinkedIn cadence** established — 2 posts/week. Effort: [low ongoing].
- [ ] **Reddit / community presence** established on [priority subreddit]. Effort: [variable].
- [ ] **30-day re-test** — same 5 priority queries, same 5 engines, compare against baseline.

### Days 61–90 (Compounding)

- [ ] **Second and third deep-dive articles** published.
- [ ] **First trade-media byline** accepted (if pitched in Days 31–60).
- [ ] **Quarterly strategy review** — reassess priority queries, peer set, opportunity ranking.
- [ ] **60-day re-test** and 90-day re-test against baseline.

---

## 8. ROI Projection

Based on industry benchmarks and the firm's current position:

| Metric | Current | 30-day expected | 90-day expected |
|---|---|---|---|
| AI citations across 5 engines (out of 25 priority queries × 5 engines) | [N] | [N+X] | [N+Y] |
| AI-referred sessions / month | [Estimated current — usually 0–10] | [50–150] | [200–500] |
| AI-attributed leads / month | [Estimated 0–1] | [2–5] | [5–10] |

**At conservative deal economics** ([Average deal size for the firm × close rate × AI-attributed leads]):

| Period | Expected AI-attributable revenue |
|---|---|
| Days 1–30 | $0 (foundation period) |
| Days 31–60 | $[X] (first AI-sourced leads landing) |
| Days 61–90 | $[X] (compounding effect begins) |

These projections assume the recommendations in §7 are executed on schedule and content publication is consistent.

---

## 9. Engagement Recommendation

Based on the audit findings, GEO recommends one of the following next steps:

**Recommended:** [GEO Foundation / GEO Build / GEO Build + Authority]

**Rationale:** [2–3 sentences specific to this firm — why this tier vs. the others, what the firm's specific situation requires]

**Pricing:**
- One-time project: [$3,500 / $7,500 / $12,500]
- Suggested retainer attachment: [GEO Monitor / Growth / Authority — $1,500 / $2,500 / $4,500/mo]
- Total Year-1 client value: [$X based on selected tiers]

**Audit credit:** The $1,500 audit fee is fully credited toward the project if the firm engages within 30 days of audit delivery.

---

## 10. Next Steps

- **60-minute walkthrough call** — [scheduling link]
- **Questions or follow-up** — chris@geostudio.io
- **If the firm chooses to engage** — proposal and engagement letter delivered within 2 business days of decision

---

## Appendix A: Methodology

The audit methodology is grounded in the academic GEO framework introduced by Aggarwal et al. (2023), the practical citation-pattern analyses published by Discovered Labs and upGrowth, and our internal patterns from prior engagements. We score citability on:

1. Schema.org coverage and validity
2. Content structure (front-loaded answers, question-shaped headers)
3. Citable specifics (numbers, dates, sources)
4. Authority signals (E-E-A-T, byline + credential markup)
5. Entity coherence across the open web

## Appendix B: Sources

[List sources cited in this audit]

## Appendix C: Compliance Notes (industry-specific)

[For Law: RI Rule 7.1 implications. For CPA: AICPA Code of Conduct. For Financial Advisors: SEC Marketing Rule 206(4)-1. For A&E: state professional licensure rules.]

---

## Internal-only notes (do not include in client deliverable)

- **Audit margin tracking:** Time spent on this audit: [X hours]. At founder's effective rate ($250/hr), cost: [$X]. Net margin: [Audit fee minus cost].
- **Pipeline notes:** Decision-maker: [name, sentiment]. Likely close: [Yes / Maybe / Unlikely / Walk away]. Expected proposal value: [$X]. Follow-up cadence: [N day check-in scheduled].
- **Lessons learned:** [Anything in this audit that should be added to the SOP or audit template for future engagements.]
