---
title: "How Law Firms Get Cited by ChatGPT (Without Violating Bar Rules)"
description: "A practical, ethics-compliant playbook for getting your law firm cited and recommended by ChatGPT, Claude, Perplexity, and Google AI Overviews. Written for managing partners and law-firm marketing directors."
pubDate: 2026-04-25
author: "Chris Skerritt"
industry: "law"
tags: ["GEO", "law", "professional-services", "compliance"]
citations:
  - label: "Aggarwal et al. (2023). GEO: Generative Engine Optimization. arXiv:2311.09735"
    url: "https://arxiv.org/pdf/2311.09735"
  - label: "Discovered Labs. AI Citation Patterns: How ChatGPT, Claude, and Perplexity Choose Sources"
    url: "https://discoveredlabs.com/blog/ai-citation-patterns-how-chatgpt-claude-and-perplexity-choose-sources"
  - label: "Ramp. Top 5 Law Firms in Rhode Island"
    url: "https://ramp.com/blog/top-law-firms-rhode-island"
  - label: "Bain analysis (2025). 73% of B2B Buyers Use AI Tools"
    url: "https://finance.yahoo.com/sectors/technology/articles/73-b2b-buyers-ai-tools-231200431.html"
  - label: "ABA Model Rule 7.1 — Communications Concerning a Lawyer's Services"
    url: "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_1_communications_concerning_a_lawyer_s_services/"
---

When a prospective client asks ChatGPT *"Who's a good business litigator in Providence?"*, the firms that show up are not the ones with the most billboards. They are the ones whose published content is **structured for AI citation**: schema-marked, answer-first, dated, attributed, and corroborated across the open web.

This article walks through exactly how that works, how to do it without violating Bar advertising rules, and what to expect on a 90-day timeline.

## Why this matters for law firms specifically

Law firms have always been referral-led — and the good ones still are. But the *path* to a referral is changing. A managing partner who used to recommend a peer firm directly now sometimes says *"check ChatGPT for the right business litigator in Providence and let me know if you want me to make an intro to one of them."*

The firms that show up in that ChatGPT response will compound those referrals. The firms that don't will see their referral pipeline thin gradually, for reasons that look like *"the market is just slower"* — until they realize what's happened.

This is happening fastest in the markets where AI adoption is highest. **73% of B2B buyers** now use AI tools in research; **37% consult AI before Google.** [^1] In a state like Rhode Island — which has **3,815 licensed attorneys serving 1.1M residents** [^2] — the competitive density makes GEO an early-mover advantage that compounds.

## How AI engines pick which law firms to cite

AI engines use **Retrieval-Augmented Generation (RAG)**. When a user asks ChatGPT for legal counsel, the engine:

1. Classifies the query intent (practice area, geography, urgency)
2. Retrieves candidate documents from its knowledge base
3. Reranks them by relevance, authority, recency, and *structural quality*
4. Inserts top documents into the LLM's prompt with citation markers
5. Generates the answer constrained to the retrieved evidence

**Citation worthiness is decided at the reranker stage, before the LLM produces the answer.** [^3] The discipline of GEO is optimizing for that reranker.

For law firms, the reranker is unusually receptive to the kinds of authority signals firms already have: bar admissions, court records, published opinions, peer recognition. The constraint is not lack of substance — it's the structural format that substance is presented in.

## Seven plays for getting cited by AI

### Play 1: Practice-area-mapped citable content

Each practice area gets a dedicated page with:
- Plain-English overview
- 8–10 FAQ entries (schema-marked)
- Citable case-result snapshots (anonymized)
- A clear scope statement

AI engines cite well-structured practice-area pages disproportionately. The format matters more than the content length — answer-first, question-shaped, schema-rich.

### Play 2: LegalService and Person schema

JSON-LD markup for **LegalService** (per practice area) and **Person** (per attorney, with bar admissions, education, areas of practice, awards). This establishes the entity coherence AI engines look for. Without schema, your firm is a string of words on a page; with schema, it's a structured entity the reranker can score.

### Play 3: Bar Journal and trade-media bylines

Bylined articles in *Rhode Island Lawyers Weekly*, the *RI Bar Journal*, and the *ABA*'s practice-area sections build the authority signals AI engines triangulate against. ChatGPT in particular weights established legal media heavily — getting cited *by* legal media gets you cited *by* AI engines that trust legal media.

### Play 4: CLE talks transcribed and republished

Every Continuing Legal Education talk a partner gives is, in effect, eight citable assets: the talk itself, the transcript, an article, a podcast clip, an FAQ block, a LinkedIn post, a tweet thread, and a published bibliography of references. The work has already been done; the publication discipline turns it into citable content.

### Play 5: Reviews architecture (compliance-friendly)

Avvo, Justia, Google Business Profile, Martindale-Hubbell — kept current and consistent. AI engines triangulate across these directories to verify the entity. We do not solicit fake reviews; we ensure existing reviews are properly indexed and linked.

### Play 6: Compliance memo on Bar advertising rules

Every state's Bar advertising rules are slightly different. The ABA Model Rules [^5] forbid false or misleading communications, and most states layer additional restrictions on testimonials, performance claims, and trade names. GEO content is generally informational — it explains topics like *"how does breach-of-contract litigation work in Rhode Island"* — and is not solicitation. But the workflow needs documentation: every state's Bar can audit, and your firm needs a clean trail.

We provide a written memo addressing your state's specific rules at engagement start. We also route content through your ethics counsel if your firm has one.

### Play 7: Local entity reinforcement

Consistent firm-name and address (NAP) data across every directory, every social profile, every byline. Variant spellings of your firm's name confuse the AI engine's entity resolution and downweight you in the reranker.

## What to expect on a 90-day timeline

Honest expectations for a 12-attorney commercial law firm starting GEO from a typical baseline:

- **Days 1–14:** Audit and roadmap. Baseline AI citation reading across 5 engines. Schema and content scoring.
- **Days 15–45:** Foundation work. Schema deployment, FAQ scaffolding on all practice-area pages, llms.txt published, top-5-page rewrites for answer-first structure.
- **Days 30–60:** First citation movement on Perplexity (which weights recency aggressively). 4 articles published targeting high-intent practice-area queries.
- **Days 45–75:** Initial movement on Claude and Google AI Overviews. First bylined article in regional legal media accepted.
- **Days 60–90:** ChatGPT citation movement (it's slower; weights authority and corroboration). Competitive parity with peer firms in your priority practice area.

This is not "post on LinkedIn and hope" timing. It's structural infrastructure plus consistent publication.

## What can go wrong

Three failure modes to watch for:

**1. The firm's existing site is hostile to GEO.** Heavy JavaScript rendering, slow Core Web Vitals, poor semantic HTML. AI crawlers can fail to ingest content cleanly. In some cases the right answer is to rebuild on a static-site framework before doing GEO content work.

**2. The firm has multiple variant names across the open web.** *"Smith Jones LLP," "Smith Jones Law," "Smith, Jones & Associates"* all appearing as references confuses the reranker. Entity normalization is unsexy work but essential.

**3. The firm has unaddressed negative public information.** AI engines weight authority and corroboration; significant public negative information can suppress citation. We address this with audit findings and an overwhelming volume of positive citable content — not by trying to hide anything.

## A practical first step

If your firm has not measured its current AI visibility, that's where to start. The seven-second test: type your firm's name and a typical practice-area query into ChatGPT, Claude, and Perplexity. *"Who's a good [practice area] attorney in [your city]?"*

If you're missing — or competitors you didn't expect are showing up — the discipline you're looking at is GEO.

[^1]: Bain (2025).
[^2]: Ramp Top RI Law Firms Report.
[^3]: Discovered Labs; upGrowth.
[^5]: ABA Model Rule 7.1.
