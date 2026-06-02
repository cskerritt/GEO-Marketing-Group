# GEO — Brand Guidelines

**Version:** 2.0
**Date:** 2026-04-27
**Supersedes:** 1.0 (the "old-world firm" direction)

---

## 1. Brand Essence

| | |
|---|---|
| **Name** | GEO |
| **Wordmark** | "GEO" set in Space Grotesk Bold, with custom G-mark (sparkle + gradient arrow) |
| **Category** | Generative Engine Optimization for professional services firms |
| **Audience** | Owners, principals, marketing directors at professional services firms |
| **Promise** | "We make your firm citable to AI." |
| **Tagline** | *"Generative Engine Optimization."* |
| **Aesthetic register** | **Clean. Modern. Technical. Trustworthy.** Looks like a serious technology firm — not a startup, not a 1925 law office. |

GEO is a technical category that sells to discerning professionals. The brand has to read as **modern enough to be credible about AI**, and **rigorous enough to be trusted with a firm's reputation**. Avoid: nostalgic serifs, ornamental flourishes, "AI brain" iconography, exclamation marks, illustrated mascots, stock-photo "diverse teams in glass offices."

---

## 2. Color Palette

### Primary

| Color | Hex | RGB | Usage |
|---|---|---|---|
| **Navy** | `#0B132B` | 11 19 43 | Primary brand color. Headlines, body text, dark sections, the wordmark. |
| **Electric Blue** | `#2563EB` | 37 99 235 | Primary accent. Links, CTAs, focus rings, the start of the gradient. |
| **Violet** | `#7C3AED` | 124 58 237 | Secondary accent. Hover states, the middle of the gradient. |
| **Cyan** | `#22D3EE` | 34 211 238 | Tertiary accent. Eyebrows on dark sections, the end of the gradient. |
| **Fog** | `#E5E7EB` | 229 231 235 | Subtle borders, dividers, dim surfaces. |

### Surfaces

| Color | Hex | Usage |
|---|---|---|
| White | `#FFFFFF` | Primary content background |
| Mist | `#F8FAFC` | Subtle alternate-section background |
| Navy Deep | `#050B1A` | Footer, deepest dark surfaces |
| Slate | `#475569` | Captions, secondary body text |

### The Brand Gradient

`linear-gradient(120deg, #2563EB 0%, #7C3AED 60%, #22D3EE 100%)`

The signature gradient is reserved for **emphasis moments**: stat numbers, the brand mark's arrow, the top rule on dark sections, primary CTA buttons. Don't blanket it across large surfaces — its power comes from restraint.

### Don't

- Don't use red except for form-validation errors
- Don't use green except for form-success confirmations
- Don't introduce additional accent colors (orange, pink, lime are off-brand)
- Don't apply the brand gradient to body text or large background fills

---

## 3. Typography

### Type family

**Space Grotesk** — variable geometric sans from Google Fonts, weights 400–700.
Used for **everything** except code: display, body, navigation, captions, the wordmark itself.
Fallback: `system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`.

**JetBrains Mono** — for code blocks, eyebrow labels, and technical signatures (URL snippets, schema fragments).
Fallback: `ui-monospace, "SF Mono", Consolas, monospace`.

Single-family discipline keeps the brand cohesive and unmistakably technical. The character of Space Grotesk does the work that a serif/sans pairing would in a more traditional brand.

### Hierarchy

| Element | Weight | Tracking | Size desktop | Size mobile |
|---|---|---|---|---|
| H1 (hero) | 700 | -0.035em | clamp(2.75rem, 7vw, 5.5rem) | ~44px |
| H2 (section) | 700 | -0.025em | clamp(2rem, 4.2vw, 3.25rem) | ~32px |
| H3 (subsection) | 600 | -0.02em | 24–32px | 22–24px |
| H4 / lead | 600 | -0.01em | 20–22px | 18–20px |
| Body | 400 | normal | 17–18px | 16px |
| Caption | 500 | normal | 14px | 13px |
| Eyebrow (mono) | 500 | 0.22em UPPERCASE | 11px | 11px |
| Mono | 400 | normal | 15px | 14px |

Tight tracking on display sizes is part of the look. Don't use loose tracking on headlines.

---

## 4. Logo / Mark

The identity has three callable variants:

| Variant | Use |
|---|---|
| **Mark** | The G-glyph alone — favicons, app icons, social avatars, single-letter affordances |
| **Wordmark** | "GEO" in Space Grotesk Bold — running header, sparse compositions |
| **Lockup** | Mark + wordmark side by side — primary use everywhere |

### The G-mark anatomy

- A **navy circular C** with a short horizontal shelf turning it into a G
- A **gradient four-point sparkle** sits inside the bowl — a nod to AI generative output
- A **gradient arrow** exits the G to the lower-right — outbound momentum, "your firm getting recommended"

The mark is built from `0B132B` strokes and the brand-gradient accents. On dark surfaces, swap the navy for white; the gradient stays the same.

### Don'ts

- Don't tilt, skew, or warp the mark
- Don't recolor the gradient (always blue → violet → cyan)
- Don't add drop shadows, outlines, or 3D effects
- Don't surround the wordmark with quotes, parentheses, or trademark symbols
- Don't use the mark and wordmark stacked vertically in the running header — only in mockups (business cards, cover slides) where the lockup needs more weight

---

## 5. Photography & Imagery

**Default position: minimize photography.** When used, prefer:

- **Abstract gradient-mesh / data-viz textures** — atmospheric, geometric, generated rather than photographed
- **Architectural lines** — clean modern buildings, wireframe perspective, high-contrast B&W
- **Document close-ups** — schema fragments, API responses, citation excerpts — the actual artifacts of our work
- **Single high-quality founder portrait** — natural light, navy or charcoal blazer, neutral background. Used everywhere.

**Avoid:**
- Stock photos of "diverse teams" in glass-walled conference rooms
- "AI brain" or "neural network" stock imagery
- Anything that looks like a Squarespace template demo
- Photos of computers with glowing blue UIs

---

## 6. Illustration & Graphic Style

When abstraction or diagram is needed:

- **Geometric primitives.** Circles, rectangles, lines, angles. No watercolor, no doodle, no hand-drawn.
- **Two strokes maximum.** Navy main stroke + one gradient accent. Never a rainbow.
- **The brand gradient as emphasis only.** A single gradient element in an otherwise navy/white composition.
- **No 3D.** No isometric. No "data flow" cartoons.
- **Subtle grid backdrops** are encouraged for technical / data sections — they reinforce the rigor.

---

## 7. Voice & Tone

### Voice attributes

1. **Confident** — we know GEO works. We have evidence. We don't hedge with "potentially" and "might."
2. **Plain-spoken** — short sentences, working-vocabulary words. No performance through jargon.
3. **Vertical-fluent** — to a CPA we say "GAAP." To a lawyer, "CLE." To an architect, "BIM." We learn each vertical's words and use them correctly.
4. **Quietly authoritative** — we cite sources. We use specific numbers. We never write "studies show" without the study.
5. **Conservative punctuation** — no exclamation marks. No emojis in copy. No "!!" or "???".

### Tone slider

- More formal: legal/financial advisor pages, executive proposals, Bar Journal bylines
- More direct: industry blog posts, founder LinkedIn posts, sales emails
- Never: cute. Never: corporate-meaningless.

### Voice rules

| Do | Don't |
|---|---|
| "AI search converts 5× better than Google" | "AI search is, like, a game changer!" |
| "73% of B2B buyers use AI tools in research" | "Tons of buyers are turning to AI now" |
| "We've seen citation rates 3× in 60 days" | "Get insane results overnight" |
| "Hire us when you're ready." | "Don't wait — book your strategy session today!!!" |
| "GEO" / "Generative Engine Optimization" | "GEO™" / "GEO®" (we don't trademark; we don't pretend to) |

### Acronym discipline

- First mention of each acronym: spell it out, then parenthesize. *"Generative Engine Optimization (GEO) is..."*
- Subsequent mentions: acronym only.
- We default to "GEO" in client copy. We use "AEO" specifically when emphasizing answer/FAQ formatting work.
- We avoid "AIO," "AISO," "LLMO" in copy except in glossaries — they fragment the brand.

---

## 8. Methodology Naming (Working)

GEO needs its own named framework — every leading agency in this space has one (CITABLE, Relevance Engineering, etc.).

**Working framework name:** *The Compass Method.*

**Why "Compass":**
- Navigation metaphor — "how firms find their way to AI citation"
- Pairs with the gradient arrow in the brand mark — outbound direction
- Easy to visualize as a brand mark
- Works in multiple metaphors (find your true north, set a course)

**The Compass Method (working — 6 stages):**

1. **C**alibrate — Audit the firm's current AI visibility across 5+ engines
2. **O**rient — Map the firm's competitive citation landscape and target queries
3. **M**ark — Establish citable content, schema, and authority infrastructure
4. **P**ublish — Ship vertical-specific articles, FAQs, and earned-media placements
5. **A**mplify — Build community / Reddit / forum presence; founder thought leadership
6. **S**teer — Monitor, measure, iterate against citation KPIs monthly

This is provisional — refine in Phase 3 as content gets written.

---

## 9. Spacing & Layout

- **Base unit:** 4px. All paddings, margins, and gaps are multiples of 4.
- **Content max width:** 72ch (≈ 720px) for prose. 1280px for full layouts.
- **Section vertical rhythm:** 96–128px between major sections on desktop, 64–80px mobile.
- **Card padding:** 32px desktop, 24px mobile.
- **Border radius:** `1rem` (16px) on cards, `9999px` (full) on buttons and pills. No rectilinear hard-edges except for the typographic mark itself.

---

## 10. Motion

- **Transitions:** 150–250ms ease-out for hovers and color/opacity changes.
- **Reveal animations:** subtle — translate-y of 4–8px, fade-in of 200ms. No bouncing, no parallax, no scroll-jacking.
- **Gradient sheen on CTAs:** the brand gradient appears as a glow on hover (not a fill on idle). Idle CTAs are solid navy or solid gradient — they don't shimmer.
- All animations respect `prefers-reduced-motion: reduce`.

---

## 11. Accessibility & Inclusion

- **Color contrast:** all text/background combinations must hit AA (4.5:1) at minimum. Navy on white = 14.6:1 ✓. Electric blue on white for body links = 4.7:1 ✓. The brand gradient is NEVER used as the primary color of body text.
- **Keyboard navigation:** every interactive element is reachable and visibly focused (electric blue 2px ring with 3px offset).
- **Alt text:** every image gets a meaningful alt; decorative images get `alt=""` explicitly.
- **Heading hierarchy:** never skip levels (H1 → H2 → H3, never H1 → H3).
- **Form labels:** every input has an associated `<label>`.
- **Reduced motion:** any animation respects `prefers-reduced-motion`.

---

## 12. Application — At a Glance

Quick visual sense-check for any future asset:

- ✅ Navy `#0B132B` is the primary color; white or `#F8FAFC` is the primary background
- ✅ The brand gradient (`#2563EB → #7C3AED → #22D3EE`) appears as accent only — stat numbers, the mark's arrow, hover glows
- ✅ Type is Space Grotesk; code/eyebrows are JetBrains Mono
- ✅ The G-mark uses the navy ring + gradient sparkle + gradient arrow
- ✅ No exclamation marks. No emojis in copy.
- ✅ Voice is direct, evidence-rich, acronym-restrained
- ✅ Looks like a 2026 technical firm — clean, modern, technical, trustworthy

If any of these are off, the asset is off-brand — fix it before shipping.
