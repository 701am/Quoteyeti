# QuoteYeti v2

8-vertical insurance comparison site. Astro 5 + Decap CMS + Netlify Identity, deployed to Netlify.

This is a MoneyGeek-style rebuild of QuoteYeti expanded from auto-only to eight verticals: auto, home, life, business, health, renters, pet, travel.

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
```

## Architecture

### Data layer (`src/data/`)

- **`verticals.ts`** — Single source of truth for all 8 verticals. Each has a slug, path, accent color, icon, tagline, and description. To add a vertical, add an entry here.
- **`nav.ts`** — Megamenu structure. 7 top-level entries (Auto, Home, Life, Business, More, Resources, Company), each with 3 columns + a featured rail.
- **`footers.ts`** — Section-scoped footer config. `DEFAULT_FOOTER` for the homepage and utility pages, plus a `SECTION_FOOTERS[verticalKey]` entry for every vertical. Each footer is 3 layers: hero CTA band, link columns, universal bottom strip.

### Components (`src/components/`)

- **`Header.astro`** — Full megamenu. Hover and keyboard accessible. Mobile drawer fallback with accordion. The accent color of each panel comes from the per-vertical `accent` value, applied via inline CSS custom properties.
- **`Footer.astro`** — Reads section context from a `section` prop. Renders the matching `SECTION_FOOTERS` entry, or `DEFAULT_FOOTER` if no section is passed.

### Layouts (`src/layouts/`)

- **`BaseLayout.astro`** — Detects the current vertical from the URL path (`detectVertical()` in `verticals.ts`) and applies `data-section="<slug>"` to `<body>`. That attribute drives all section-scoped styling via `[data-section="..."]` selectors in `tokens.css`.
- **`VerticalHub.astro`** — Reusable hub template for the 8 vertical landing pages. Hero + 3 pillars + subtopics grid + calculators + FAQ. Parameterized by `vertical`, `hero`, `pillars`, `calculators`, `subtopics`, `faqs`.

### Styles (`src/styles/`)

- **`tokens.css`** — Master color palette extracted from the original QuoteYeti stylesheet. Adds 8 vertical accent colors via `[data-section="..."]` CSS custom property overrides. Each vertical sets `--section-accent`, `--section-accent-soft`, and (where needed for contrast) `--section-text-on-accent`.

### Routes

```
src/pages/
├── index.astro                          → / (MoneyGeek-style homepage)
├── [slug].astro                         → /<page-slug>/ (static pages)
├── 404.astro                            → /404
├── rss.xml.js                           → /rss.xml (blog feed)
│
├── auto/
│   ├── index.astro                      → /auto/ (auto vertical hub)
│   ├── brands/index.astro              → /auto/brands/
│   ├── brands/[slug].astro             → /auto/brands/<slug>/
│   ├── reviews/index.astro             → /auto/reviews/
│   ├── reviews/[slug].astro            → /auto/reviews/<slug>/
│   ├── locations/index.astro           → /auto/locations/
│   ├── locations/[slug].astro          → /auto/locations/<slug>/
│   ├── glossary/index.astro            → /auto/glossary/
│   ├── glossary/[slug].astro           → /auto/glossary/<slug>/
│   ├── faqs/index.astro                → /auto/faqs/
│   └── faqs/[slug].astro               → /auto/faqs/<slug>/
│
├── home-insurance/index.astro          → /home-insurance/
├── life-insurance/index.astro          → /life-insurance/
├── business-insurance/index.astro      → /business-insurance/
├── health-insurance/index.astro        → /health-insurance/
├── renters-insurance/index.astro       → /renters-insurance/
├── pet-insurance/index.astro           → /pet-insurance/
├── travel-insurance/index.astro        → /travel-insurance/
│
├── blog/index.astro                    → /blog/
└── blog/[slug].astro                   → /blog/<slug>/
```

### Content collections (`src/content/`)

```
src/content/
├── auto/                               (existing QuoteYeti content)
│   ├── brands/                         (431 brand pages, 1 seed included)
│   ├── reviews/                        (99 carrier reviews, 1 seed)
│   ├── locations/                      (66 state/city pages, 1 seed)
│   ├── glossary/                       (102 terms, 1 seed)
│   └── faqs/                           (96 FAQs, 1 seed)
├── home/                               (new — empty)
├── life/                               (new — empty)
├── business/                           (new — empty)
├── health/                             (new — empty)
├── renters/                            (new — empty)
├── pet/                                (new — empty)
├── travel/                             (new — empty)
├── posts/                              (blog posts, 1 seed)
├── pages/                              (static pages, 1 seed = about.md)
└── verticals/                          (optional vertical-level marketing overrides)
```

The Zod schema in `src/content.config.ts` defines the front-matter for each collection. Matches what Decap CMS produces.

### Redirects (`public/_redirects`)

Single regex rule per collection moves existing URLs under `/auto/*`:

```
/brands/*    /auto/brands/:splat    301
/reviews/*   /auto/reviews/:splat   301
/locations/* /auto/locations/:splat 301
/glossary/*  /auto/glossary/:splat  301
/faqs/*      /auto/faqs/:splat      301
```

WordPress legacy paths (`/wp-admin/*`, `/feed`, `/xmlrpc.php`) are also handled.

### CMS (`public/admin/`)

- **`config.yml`** — Decap CMS schema. One collection per content folder. Matches the Zod schemas exactly.
- **`index.html`** — The `/admin/` route. Loads Decap from CDN, authenticates via Netlify Identity + Git Gateway.

Before launch:
1. Edit `public/admin/config.yml` and confirm `backend.repo` is set to your GitHub repo.
2. In the Netlify dashboard: enable Identity, enable Git Gateway, set registration to "Invite only" (recommended).

## Design system

### Colors

**Master palette** (always active):
- Resolution Navy `#2C4577` — primary, all headings, all nav
- Malibu Sky `#64BCE1` — accents, hover states
- Alice Pale `#EFF4F8` — section backgrounds
- Charcoal `#212529` — text
- Orange CTA `#F46036` — primary CTAs everywhere

**Vertical accents** (applied per section via `[data-section]`):
| Vertical | Accent    | Hex     |
|----------|-----------|---------|
| Auto     | Orange    | #F46036 |
| Home     | Sage      | #8FB339 |
| Life     | Plum      | #6B5B95 |
| Business | Slate     | #2E5266 |
| Health   | Teal      | #14A38B |
| Renters  | Peach     | #E8A87C |
| Pet      | Rose      | #C06C84 |
| Travel   | Horizon   | #355C7D |

### Typography

Three Adobe Typekit fonts (kit ID `lqp1bjs` — replace with your own kit before launch):
- **Plantin** (serif) — display headlines, `.highlight` class, magazine-style emphasis
- **Sofia Pro** (UI) — all headings (h1-h6), nav, buttons, labels
- **Proxima Nova** (body) — body paragraphs, descriptions, captions

## Adding content

### Via Decap CMS

Visit `/admin/` on your deployed site. Sign in via Netlify Identity. The CMS shows all 14 collections matching the folder structure. Editorial workflow is enabled — drafts become pull requests.

### Manually

Drop a markdown file into the right folder under `src/content/<collection>/<slug>.md`. Front-matter must match the Zod schema (see `src/content.config.ts`). The 7 seed files (one per major collection) are good examples.

### Adding a new vertical

1. Add an entry to `VERTICALS` in `src/data/verticals.ts`.
2. Add a megamenu entry in `src/data/nav.ts`.
3. Add a `SECTION_FOOTERS` entry in `src/data/footers.ts`.
4. Add a vertical accent block in `src/styles/tokens.css`.
5. Create `src/pages/<vertical-slug>/index.astro` (copy any existing vertical landing page as a template).
6. Add `src/content/<vertical-slug>/` folder, plus collection definition in `src/content.config.ts`.
7. Add corresponding Decap config in `public/admin/config.yml`.
8. Drop a vertical icon at `public/assets/images/icons/<vertical-slug>.svg`.

## Pre-launch checklist

- [ ] Replace Adobe Typekit kit ID (`lqp1bjs`) in `src/layouts/BaseLayout.astro` with your own.
- [ ] Edit `backend.repo` in `public/admin/config.yml` to point at your GitHub repo.
- [ ] Enable Netlify Identity and Git Gateway in Netlify dashboard.
- [ ] Audit `public/_redirects` against any additional WP URL patterns not yet captured.
- [ ] Run `npm run build` once and verify all routes generate.
- [ ] Populate at least the 8 vertical hubs and the `/about/` page with real copy.
- [ ] Replace the lorem-ipsum FAQ answers in each vertical hub.
- [ ] Verify all carrier names in the homepage `carriers` array reflect real partnerships.

## Notes on the build

- Builds cleanly with Astro 5 (`npm run build` → 23 routes, ~4s).
- All 7 newer vertical content directories are currently empty — Astro will warn but build succeeds.
- One seed content file exists for each major collection so you can see the template structure.
- The migration script (Phase 2 from earlier conversations) was deliberately not included — content is being rebuilt manually.

## File counts

- 9 routes for auto sub-collections + 1 for the auto hub = 10
- 7 new vertical landing pages
- 1 homepage
- 1 blog index + 1 blog detail = 2
- 1 generic page handler ([slug].astro)
- 1 RSS feed
- 1 404

Total: 23 routes, 92 source files.
