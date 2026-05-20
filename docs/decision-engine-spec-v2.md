# QuoteYeti Intelligent Decision Engine
## Revised Technical Specification v2.0 — Stack-Aligned

**Prepared for:** Felix Lucero, VP of Technology
**Revised by:** Editorial / Engineering, QuoteYeti
**Date:** May 20, 2026
**Supersedes:** Decision Engine Spec v1.0 (May 19, 2026)
**Scope:** All 8 verticals (auto, home, life, business, health, renters, pet, travel)

---

## 0. Why This Revision Exists

Spec v1.0 was written against an assumed stack (Astro 4 + Svelte 5 + Tailwind + a fresh data layer). The QuoteYeti v2 codebase that actually exists diverges from that assumption in ways that materially change the build. This revision aligns the engine to the real codebase so that no work is wasted building against a stack we don't run, and so that the engine reuses the substantial infrastructure already in place.

**The three corrections that drove this revision:**

1. **Stack reality.** We run **Astro 5**, not 4. We have **Tailwind 4 installed** (via `@tailwindcss/vite`) but our components are built primarily with **scoped `.astro` `<style>` blocks driven by a mature design-token system** (`src/styles/tokens.css`). We do **not** run Svelte. Adding Svelte 5 as v1.0 specified would introduce a second component runtime and styling paradigm for no benefit — every "Svelte island" in v1.0 maps cleanly onto an **Astro island with a small vanilla-JS controller**, which is how the rest of the site already handles interactivity. This revision drops Svelte entirely.

2. **We already have a lead-flow system.** v1.0 specified building `DecisionTool.svelte`, `QuoteForm.svelte`, and a quote-submission pipeline from scratch. In reality, the repo already contains a complete, working, multi-step lead-flow architecture: `src/components/lead-flow/` (LeadFlow, FieldRender, PartnerOffers, PrimaryLeadSlot) driven by `FlowConfig` objects in `src/lib/lead-flow/vertical-flows.ts`, already wired into `/<vertical>/quotes/` funnels for multiple verticals using `FunnelLayout`. The decision engine must **extend and feed into this system**, not duplicate it. The engine produces a *ranked recommendation*; the existing lead-flow handles *quote submission*. They connect; they do not overlap.

3. **The data honesty constraint is non-negotiable for this project specifically.** The decision engine's output is the single highest-risk surface on the entire site, because it emits **specific dollar figures attached to named carriers in named ZIP codes**. The whole site is built on an "earned truth, no invented claims" editorial standard (codified in `soul.md`, the About page, every methodology page). A fabricated editorial *score* is a defensible judgment; a fabricated *rate* ("USAA: $87/mo in 77002, 18% below average") is a false factual claim — and insurance rate advertising is regulated by state Departments of Insurance. Therefore:

   > **The engine is built to ingest real territory rate data. It ships with a clearly-labeled SYNTHETIC sample dataset for development and demo. Every synthetic rate is flagged as illustrative in the data itself AND visibly marked in the UI. The synthetic→real swap is a first-class, single-layer data operation — not a rewrite.**

   This is the only version of a rate-bearing decision engine consistent with the rest of the product. It loses nothing in demo value and protects the credibility that is the actual business asset.

---

## 1. Stack Mapping: v1.0 → v2.0

| Concern | v1.0 (spec) | v2.0 (this codebase) | Rationale |
|---|---|---|---|
| Framework | Astro 4.x | **Astro 5.x** | Already installed |
| Interactivity | Svelte 5 islands | **Astro islands + vanilla-JS controllers** | No Svelte in repo; matches existing interactivity pattern |
| Styling | Tailwind | **Design tokens (`tokens.css`) + scoped styles**; Tailwind available but not lead | Token system is mature and consistent; Tailwind 4 is present for utility cases |
| Quote flow | Build `QuoteForm.svelte` new | **Reuse existing `LeadFlow` + `FlowConfig`** | Working system already exists with TCPA-compliant copy |
| Funnel shell | New | **Existing `FunnelLayout.astro`** | Already used by `/<vertical>/quotes/` |
| Serverless | Netlify Functions | Netlify Functions (unchanged) | Correct, but untestable in dev — see §7 |
| Database | Netlify Postgres | Netlify Postgres (unchanged) | Correct — phase 2, see §7 |
| Data layer | JSON in `/src/data/` | JSON in `/src/data/decision-engine/` | Matches existing `/src/data/` convention |
| Rate data | "fabricate / scrape" | **Synthetic-labeled now; real-ingest-ready** | Editorial honesty constraint, see §0.3 and §4 |

---

## 2. Architecture Overview (v2.0)

A zip-first, territory-aware recommendation system that maps a user profile to ranked carrier matches, then hands off to the existing lead-flow for quote submission.

```
ZIP + 2-3 answers
      │
      ▼
[1] zipIndex lookup ......... state, county, territory, riskScore
      │
      ▼
[2] availability filter ..... drop carriers not writing in this zip/territory
      │
      ▼
[3] territory rate fetch .... rate per available carrier (3-level fallback)
      │
      ▼
[4] score + rank ............ 0.60·base + 0.30·rate + 0.10·qualifier
      │
      ▼
[5] ranked results .......... 3 cards: zip rate, "why it matches", caveats
      │
      ▼
[6] handoff ................. "Get quotes" → existing /<vertical>/quotes/ LeadFlow
```

Steps 1-5 are **fully static + client-side** — no server round-trip, no database, no API key. The engine is a static JSON data layer + a vanilla-JS scoring controller running in an Astro island. Only step 6 (actual lead submission) touches the server, and that path already exists.

**This is the key architectural simplification over v1.0:** the recommendation engine needs zero backend. It's pure data + math in the browser. The backend (Postgres, Functions, Identity, Resend) is only for the *conversion and persistence* features (saved profiles, share links, rate alerts), which are genuinely phase 2 and genuinely untestable until deployed.

---

## 3. File Structure (v2.0)

```
src/
├── data/
│   └── decision-engine/
│       ├── zip-index.json            # zip → {state, county, city, territory, riskScore}
│       ├── territory-rates.json      # territory → vertical → carrier → {rate, vsAvg, rank, _synthetic}
│       ├── carrier-availability.json # carrier → {unavailableTerritories[], unavailableZips[]}
│       ├── profiles.json             # profileKey → {whyItMatches copy, scoring hints}
│       └── question-configs/
│           ├── auto.json
│           ├── home.json
│           └── … (one per vertical)
├── lib/
│   └── decision-engine/
│       ├── types.ts                  # ZipMeta, TerritoryRate, CarrierScore, Profile, Result
│       ├── engine.ts                 # pure scoring fns (no DOM, unit-testable)
│       ├── profile-key.ts            # build/parse {state}_{record}_{priority}_{qualifiers}
│       └── synthetic-rates.ts        # generates labeled synthetic data (dev only)
├── components/
│   └── decision-engine/
│       ├── DecisionTool.astro        # island shell: ZIP + question steps
│       ├── decision-tool.client.ts   # vanilla controller for the tool
│       ├── ResultsView.astro         # island shell: ranked cards
│       ├── results-view.client.ts    # vanilla controller for results
│       ├── ScoreBar.astro            # reuse existing ScoreGauge where possible
│       └── SyntheticDataNotice.astro # the visible "illustrative rates" banner
└── pages/
    └── tool/
        ├── index.astro               # the decision tool entry (FunnelLayout or BaseLayout)
        └── results/
            └── index.astro           # results page (reads ?profile=… from URL)
```

**Reuse, don't rebuild:**
- `ScoreBar` → prefer the existing `src/components/editorial/ScoreGauge.astro` (it already has the pending/score states we built).
- Quote submission → the existing `LeadFlow` + `FlowConfig`. The results "Get quotes" button deep-links to `/<vertical>/quotes/?carriers=usaa,geico&from=tool`.
- Funnel shell → existing `FunnelLayout.astro`.

---

## 4. The Data Layer (with the honesty constraint enforced)

### 4.1 `zip-index.json`
Maps each ZIP to its geographic + risk metadata. Sample dataset covers a handful of real ZIPs across TX and CA (enough to demo territory variation within one state).

```json
{
  "77002": { "state": "TX", "county": "Harris", "city": "Houston",
             "territory": "houston-urban-core", "riskScore": 78,
             "populationDensity": "urban", "_source": "real-public-geo" },
  "77379": { "state": "TX", "county": "Harris", "city": "Spring",
             "territory": "houston-suburban", "riskScore": 52,
             "populationDensity": "suburban", "_source": "real-public-geo" }
}
```
ZIP→geography mapping is **real public data** (Census/USPS-derivable). Only the *rates* are synthetic. The `riskScore` is a derived editorial heuristic, labeled as such.

### 4.2 `territory-rates.json` — THE SYNTHETIC LAYER
Every rate entry carries an explicit `_synthetic: true` flag. The engine refuses to render a rate without checking this flag and surfacing the notice when any synthetic rate is shown.

```json
{
  "houston-urban-core": {
    "auto": {
      "_synthetic": true,
      "_disclaimer": "Illustrative rates for product demonstration. Not real quotes.",
      "territoryAverage": 142,
      "carriers": {
        "usaa":  { "rate": 104, "vsAvg": -0.27, "rank": 1, "_synthetic": true },
        "geico": { "rate": 118, "vsAvg": -0.17, "rank": 2, "_synthetic": true }
      }
    }
  }
}
```

**Synthetic generation rules** (`synthetic-rates.ts`) — plausible, not random:
- Base each carrier's synthetic rate on its *real editorial affordability sub-score* (we have these for 56 carriers). Higher affordability score → lower synthetic rate. This makes the synthetic data internally consistent with the real editorial work.
- Modulate by territory `riskScore` (higher risk → higher rates across all carriers).
- Apply carrier availability (a carrier absent from a territory has no rate).
- Round to whole dollars. Stamp every leaf with `_synthetic: true`.

The function is deterministic (seeded) so the demo is stable across rebuilds.

### 4.3 `carrier-availability.json`
Carrier → territories/zips where they don't write. Sample: model a few realistic exits (e.g., a carrier that pulled out of coastal-hurricane territories) to demo the "unavailable" UI state. Flagged `_synthetic` where the exit is illustrative.

### 4.4 The synthetic→real swap path
When real rate data arrives (NAIC/DOI filings, a licensed data partner, or carrier feeds):
1. Replace `territory-rates.json` and `carrier-availability.json` with real data, `_synthetic: false`.
2. The `SyntheticDataNotice` component auto-hides when no `_synthetic: true` leaf is present in the rendered set.
3. **Zero engine code changes.** The scoring math, the UI, the routing all stay identical.

This is the whole point of the labeled-synthetic approach: it's the same engine, and going live is a data-file swap plus a legal/compliance review of the real rates — not a rebuild.

---

## 5. The Decision Engine Logic

Pure functions in `src/lib/decision-engine/engine.ts`. No DOM, no fetch, no globals — fully unit-testable, runs identically on server (build) or client (island).

### 5.1 Profile key
Format unchanged from v1.0: `{state}_{record}_{priority}_{qualifiers}`
- `texas_clean_price_none`
- `california_major_claims_military`

`profile-key.ts` builds and parses these. Question configs map each answer to a key segment.

### 5.2 Scoring (0–5 scale)

| Factor | Weight | Source |
|---|---|---|
| Base score | 60% | **Real** carrier editorial scores (the 56 we scored: overall + sub-scores) |
| Rate score | 30% | Synthetic-now/real-later territory rate vs. territory average |
| Qualifier bonus | 10% | Military / bundle / rideshare match |

> **Note the weighting honesty:** 60% of the ranking is driven by our *real* editorial scores. Only the 30% rate component is synthetic in demo mode. So even the demo ranking is mostly grounded in real work — the synthetic layer perturbs order, it doesn't invent it.

**Rate score curve** (unchanged from v1.0 — it's sound):

| Ratio (carrier rate / territory avg) | Rate score |
|---|---|
| ≤ 0.70 | 5.0 |
| 0.71 – 0.85 | 4.5 |
| 0.86 – 1.00 | 4.0 |
| 1.01 – 1.15 | 3.0 |
| 1.16 – 1.30 | 2.0 |
| > 1.30 | 1.0 |

### 5.3 Output contract
```ts
interface Result {
  carrierSlug: string;
  carrierName: string;
  finalScore: number;          // 0–5, the ranked value
  baseScore: number;           // real editorial
  rateScore: number;           // from rate ratio
  qualifierBonus: number;
  territoryRate: number | null;
  vsAvg: number | null;        // e.g. -0.18 = 18% below territory avg
  rateIsSynthetic: boolean;    // drives the UI notice
  whyItMatches: string;        // from profiles.json, real editorial copy
  available: boolean;
  unavailableReason?: string;  // when filtered out, explain honestly
}
```

The engine returns the full ranked set; the UI shows top 3 and lists unavailable carriers separately with honest reasons ("USAA does not currently write in this territory") rather than silently hiding them.

---

## 6. The User Flow (v2.0 — connecting to existing systems)

1. User lands on a static page (homepage, ranking, review) — zero JS.
2. Clicks "Find your match" → `/tool/` (Astro shell + DecisionTool island).
3. Enters ZIP → validated against `zip-index.json` client-side (no DB call).
4. Answers 2-3 profile questions → progress in `sessionStorage` (not localStorage; see note).
5. Builds profile key → navigates to `/tool/results/?profile=texas_clean_price_none`.
6. ResultsView island loads → imports static JSON → runs `engine.ts` in-browser → renders 3 ranked cards.
7. **If any rendered rate is synthetic → `SyntheticDataNotice` banner is shown above results.** Non-negotiable.
8. User actions: read full review (→ existing `/auto/reviews/<slug>/`), compare (modal), or **Get quotes**.
9. "Get quotes" → deep-links into the **existing** `/<vertical>/quotes/?carriers=usaa,geico&from=tool` LeadFlow.
10. From here, the existing TCPA-compliant lead-flow takes over entirely. The engine's job is done.

**Storage note:** Artifacts/islands here should use `sessionStorage`, not `localStorage`, for in-progress answers — it's the right lifetime for a single decision session and avoids stale-profile bugs on return visits.

**Voice/compliance note:** The engine inherits the lead-flow's existing rules — never name a downstream partner, never imply QuoteYeti itself sells or quotes insurance, the recommendation is editorial ("our match for your profile"), and the handoff copy references "our network of licensed carriers and agents." The ranked result is a *research recommendation*, not an *offer*.

---

## 7. What's Phase 1 vs Phase 2 (the honest split)

Everything in **Phase 1** can be built, tested, and demoed entirely in the static site with no backend. Everything in **Phase 2** requires the live Netlify environment and cannot be meaningfully built or verified in dev.

### Phase 1 — The Engine (buildable now, fully demoable)
- `zip-index.json` (real geo) + synthetic `territory-rates.json` + `carrier-availability.json`
- `engine.ts`, `profile-key.ts`, `synthetic-rates.ts` (+ unit tests)
- Question configs for auto + home
- `DecisionTool` island + `ResultsView` island + `SyntheticDataNotice`
- `/tool/` and `/tool/results/` pages
- Handoff into the existing lead-flow funnel
- **Deliverable: a clickable, real, ranked decision engine for one or two verticals, built in the design, honest about synthetic rates.**

### Phase 2 — Persistence & Lifecycle (requires deployed Netlify; code now, test on deploy)
- Netlify Postgres schema (`quote_requests`, `user_profiles`, `share_links`, `rate_history`, `zip_metadata`, `carrier_zip_availability`, `territory_rates`)
- `/api/quote-request`, `/api/save-profile`, `/api/share-link`, `/api/share-data`, `/api/rate-alert`
- Netlify Identity (magic-link auth for saved profiles)
- Resend transactional email (confirmation, rate alerts)
- Scheduled function for quarterly rate-change alerts
- `/share/[token]` read-only results
- **These get written as scaffolding but are explicitly untestable until deployed with real env vars + DB.**

### Phase 3 — Real Data (the gate to going live)
- Source real territory rates (NAIC/DOI filings, licensed data partner, or carrier feeds)
- Replace synthetic JSON; flip `_synthetic` flags to false
- Legal/compliance review of rate advertising per state
- `SyntheticDataNotice` auto-hides
- **Until Phase 3 completes, the tool must not present rates as real, anywhere, to any real consumer.**

---

## 8. Implementation Timeline (revised, realistic)

| Phase | Task | Deliverable |
|---|---|---|
| 1 | Types + engine.ts + profile-key.ts + tests | Unit-tested scoring brain |
| 1 | synthetic-rates.ts seeded from real affordability scores | Internally-consistent synthetic data |
| 1 | zip-index (real TX+CA sample) + territory-rates + availability | Demo data layer, labeled synthetic |
| 1 | auto + home question configs | Two working verticals |
| 1 | DecisionTool island + controller | ZIP + question flow |
| 1 | ResultsView island + SyntheticDataNotice | Ranked cards w/ honest rate labeling |
| 1 | /tool/ + /tool/results/ pages, lead-flow handoff | End-to-end clickable engine |
| 1 | QA: build clean, 0 broken links, notice always shows on synthetic | Shippable Phase 1 |
| 2 | Postgres schema + 5 Netlify Functions (scaffold) | Deployable backend code (untested in dev) |
| 2 | Identity + Resend + scheduled alerts | Persistence/lifecycle features |
| 2 | /share/[token] page | Shareable results |
| 3 | Real rate sourcing + compliance review | Go-live gate |

---

## 9. What Engineering Needs (revised "What Felix Needs From Rai")

| Deliverable | Format | Phase | Status |
|---|---|---|---|
| Carrier scoring data (scores, sub-scores, pros/cons, bestFor) | JSON | 1 | **Already done** — 56 carriers scored |
| Question configs (auto, home first) | JSON, matching existing `FlowConfig` shape | 1 | To build |
| "Why it matches" copy templates | JSON/Markdown per profile | 1 | To build |
| ZIP→territory mapping | JSON (real public geo) | 1 | Sample built; full DB later |
| **Real territory rate data** | Filings / licensed feed | **3** | **Blocking go-live; not available now** |
| Carrier zip availability (real) | Spreadsheet → JSON | 3 | Synthetic sample now; real later |
| Email copy (confirmation, alert, quarterly) | Markdown | 2 | To build |
| Methodology explanation for the engine | Markdown | 1 | To build — must disclose synthetic-in-demo |

---

## 10. The One-Sentence Architecture (revised)

> Astro 5 static pages for SEO. Astro islands with vanilla controllers for interactivity (no Svelte). Design tokens for styling. A static JSON data layer with **labeled-synthetic rates** for personalization. The existing `LeadFlow` for quote handoff. Netlify Functions + Postgres + Identity + Resend for Phase-2 persistence. Zip-first, territory-aware, editorial-first — and honest about what's real.

**The single most important line in this document:** the engine is built so that the rate data is the *only* thing standing between demo and production — and that swap is a labeled, single-layer data operation, not a rewrite. Everything else is real on day one.
