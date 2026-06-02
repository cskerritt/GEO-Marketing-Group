---
title: "AEO for Accounting Firms: Seven Plays That Actually Work"
description: "A practical Answer Engine Optimization playbook for mid-size CPA firms whose tax updates and white papers should be cited by AI but aren't. Compliance-friendly, AICPA-respectful, and built around the work CPAs already produce."
pubDate: 2026-04-25
author: "Chris Skerritt"
industry: "cpa"
tags: ["AEO", "GEO", "CPA", "accounting", "tax"]
citations:
  - label: "RI Society of CPAs (RISCPA)"
    url: "https://www.riscpa.org/"
  - label: "Aggarwal et al. (2023). GEO: Generative Engine Optimization. arXiv:2311.09735"
    url: "https://arxiv.org/pdf/2311.09735"
  - label: "Discovered Labs. AI Citation Patterns"
    url: "https://discoveredlabs.com/blog/ai-citation-patterns-how-chatgpt-claude-and-perplexity-choose-sources"
  - label: "AICPA Code of Conduct"
    url: "https://www.aicpa-cima.com/resources/article/aicpa-code-of-professional-conduct"
---

Most mid-size accounting firms publish a steady stream of high-quality content: tax-update articles, white papers, GAAP commentary, audit insights, advisory guides. Almost none of it gets cited by AI engines. Not because the content is weak — usually it's first-rate — but because it's not formatted for AI lift.

This post walks through seven specific Answer Engine Optimization (AEO) plays that turn the technical content CPA firms already produce into the kind of citable substance ChatGPT, Claude, and Perplexity actually quote.

## Why CPA firms have an asymmetric AEO opportunity

Two converging factors:

**1. CPA-firm content has unusually strong raw substance.** Tax-update commentary, GAAP analysis, regulatory interpretation — this is exactly the kind of dated, dense, technical content AI engines reward when properly structured. Most "thought leadership" in B2B is too generic to cite; CPA technical content is too specific to ignore.

**2. CPA-firm content is almost universally under-structured.** White papers are PDFs locked behind email gates (un-crawlable). Tax updates are blog posts with paragraph-style answers (not citation-optimized). Service pages list capabilities rather than answer questions. The substance is there; the structure isn't.

The gap between "we have the content" and "AI cites our content" is, for most CPA firms, ~3–6 months of structural and editorial work. Not new content — just better-formatted versions of what already exists.

## Play 1: Convert tax updates into question-shaped answers

Most tax-update articles read like internal memos: *"On April 15, 2026, the IRS issued Notice 2026-XX, modifying the treatment of..."*

Restructure as: *"How does IRS Notice 2026-XX change how partnerships handle bonus depreciation?"* — followed by a 2-sentence direct answer in the first 200 words.

Same content. Different shape. The Aggarwal et al. paper documented **20–40% relative citation lift** from "front-loaded specificity" — the discipline of completing the answer before the article elaborates. [^2]

For a CPA firm publishing 20–40 tax updates a year, restructuring the existing content for question-shaped headers and answer-first paragraphs is the single highest-leverage AEO move. The substance is unchanged; the citability multiplies.

## Play 2: Add AccountingService schema to every service page

JSON-LD `AccountingService` schema makes your firm a structured entity to AI engines instead of a string of words on a page. Sites with proper structured data **receive 2–3× higher weight in the citation reranker.** [^3]

Required fields:

```json
{
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "name": "[Firm Name] Tax Services",
  "provider": { "@type": "Organization", "name": "[Firm Name]" },
  "serviceType": "Tax preparation and advisory",
  "areaServed": [{ "@type": "AdministrativeArea", "name": "Rhode Island" }]
}
```

One per service line: tax, audit, advisory, outsourced accounting, business valuation, forensic accounting. Plus `Person` schema for each partner (with credentials, specialties, awards).

This is a half-day of work for a competent web developer. Most firms have not done it. The marginal lift per hour of effort is high.

## Play 3: Build a proper FAQ structure on every service page

FAQ schema gets disproportionate citations in B2B verticals. CPA-firm service pages should have 8–10 FAQ entries each, with `FAQPage` schema markup.

Bad: *"Our audit team has decades of experience..."*
Good FAQ entry:
> **Q: What does an audit cost for a Rhode Island business with under $5M in revenue?**
> A: Audits for RI businesses with under $5M in revenue typically run $15,000–$45,000 depending on the complexity of operations, internal controls maturity, and the timing window. The lower end of that range applies to services-business clients with clean books and a single-location operation; the higher end reflects manufacturing or multi-entity operations. Audits are scoped per engagement.

Notice: the answer leads with a specific dollar range (citable), explains the variance (educational), and ends with a structural caveat (intellectually honest). This is exactly the shape AI engines lift.

Eight to ten of these per service page, schema-marked, dated, sourced.

## Play 4: De-PDF your white papers

White papers locked in PDFs behind email-gate forms are AI-invisible. AI crawlers can't ingest them, and even when they can, the lack of HTML structure suppresses citation.

Two reasonable paths:

- **Publish HTML versions of white papers** alongside the PDFs. Same content, structured as proper webpages with H2/H3, FAQ sections, and Article schema.
- **Or write companion articles** that summarize and cite the white paper, formatted for AI lift.

Either way, the substance becomes crawlable. The lead-gen function of the email gate is unchanged.

## Play 5: Bylined columns in CPA-trade media

Get partners' names and credentials bylined in *Accounting Today*, *CPA Practice Advisor*, *Journal of Accountancy*, *CPA Today* (RISCPA's newsletter), and regional business journals. AI engines triangulate authority: getting cited by trusted CPA media gets you cited by AI engines that trust CPA media.

This is slower work — pitch cycles take 4–8 weeks — but the authority signals compound for years. One bylined column in *Accounting Today* is worth more for AEO than ten posts on the firm's own blog.

## Play 6: Industry-vertical content (you serve their vertical, you should publish for it)

If your firm serves manufacturers, write *for* manufacturers. If you serve nonprofits, write for nonprofits. Generic CPA content struggles for AI citation; vertical-specific CPA content (with appropriately-deep tax and operational knowledge) wins.

Examples of high-performing vertical pieces:

- *"How Rhode Island manufacturers should think about Section 174 R&D capitalization changes"*
- *"Nonprofit Form 990 audit triggers — what RI 501(c)(3)s should know"*
- *"Section 199A deduction planning for RI architecture practices"*

These pieces are simultaneously:
- Citable by AI engines (specific, dated, vertical-tagged)
- Useful as outreach to vertical prospects
- Repurposable as conference talks, partner trainings, and prospect content

## Play 7: Compliance-friendly review workflow

CPA firms have professional conduct standards (AICPA Code of Conduct, plus state-specific rules for state CPA boards) governing their public communications. AEO content does not violate those standards — it is informational and educational, not solicitation — but the workflow needs documentation.

Recommended workflow:

1. Content draft produced by writer (internal or agency)
2. Subject-matter review by partner with the relevant credentials
3. Disclosure language added per firm policy (CPA-firm advisory disclaimer, jurisdictional limits, etc.)
4. Version archived in firm document management
5. Published with author byline, credential markup, and dated revision history

This is a half-page checklist, not a multi-month overhaul. Document it; follow it; archive everything.

## What success looks like for a CPA firm

For a 12-partner firm starting AEO from a typical baseline, six-month outcomes:

- **20–40 existing tax updates** restructured for citability
- **All service pages** have FAQ schema, AccountingService markup, Person markup for each partner
- **8–10 new vertical-specific deep dives** published targeting top three verticals served
- **2–3 bylined columns** in trade media accepted
- **Initial citations** appearing on Perplexity (fastest), then Claude, then ChatGPT
- **GA4 reporting** AI-referred traffic (5–15% of organic by Month 6)

This is a steady, compounding asset. Unlike a paid acquisition campaign, the work doesn't need to be repeated to keep producing. Once the content is structured and cited, the citations persist.

## A pragmatic first step

If your firm hasn't measured its current AI visibility, that's where to start. Type your firm's name and three priority service queries into ChatGPT, Perplexity, and Google AI Overviews. Note who shows up. Compare to the firms you'd consider peers. The gap is your starting AEO opportunity.

A productized [GEO Audit](/audit) covers this systematically — citation gap analysis, schema audit, content scoring, competitive map. We offer it free for the first 25 RI/MA firms.

[^1]: AICPA Code of Conduct.
[^2]: Aggarwal et al. (2023).
[^3]: Discovered Labs; upGrowth.
