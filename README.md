# QuoteYeti Clone — Astro + Decap CMS

A static-rendered clone of quoteyeti.com built on Astro 5 + Decap CMS, deployed to Netlify.
Design tokens were extracted from the original theme's stylesheet; content is currently lorem ipsum.

## Stack

- **Astro 5** — static site generator with content collections
- **Decap CMS 3** — git-based CMS at `/admin/`
- **Netlify Identity + Git Gateway** — auth for the CMS
- **Tailwind v4** — utility layer (currently minimal; tokens live in `src/styles/tokens.css`)
- **Adobe Typekit** — Plantin, Proxima Nova, Sofia Pro (replace with your own kit before launch)

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## Project structure

```
src/
  content/
    brands/        # /brands/{slug}/ — Markdown w/ schema
    reviews/       # /reviews/{slug}/
    bestOf/        # /best-car-insurance/{slug}/
    pages/         # /{slug}/ (about, faqs, glossary, contact, privacy-policy)
  content.config.ts — Zod schemas for all collections
  pages/
    index.astro                        # /
    brands/index.astro, [slug].astro   # archive + single
    reviews/index.astro, [slug].astro
    best-car-insurance/[slug].astro
    [slug].astro                       # catch-all for /content/pages
    404.astro
  layouts/BaseLayout.astro             # html shell, header, footer, SEO meta
  components/
    Header.astro
    Footer.astro
    ZipForm.astro                      # 3 variants: header / inline / modal
  styles/tokens.css                    # design tokens from QuoteYeti source CSS
public/
  admin/
    index.html                         # Decap entrypoint
    config.yml                         # CMS collections schema
  assets/
    images/                            # SVGs, mascot, peaks, etc. from source
  _redirects                           # WP → Astro path mapping
```

## Design tokens

All colors, fonts, spacing, and breakpoints are CSS variables in `src/styles/tokens.css`.
Pulled directly from the original `theme/index.css`:

- **Primary**: `#2C4577` (resolution navy) — every heading, links
- **Accent 1**: `#64BCE1` (malibu sky-blue) — highlights, hover states, the underline effect
- **Accent 2**: `#F46036` (orange) — CTAs only
- **Background tints**: `#EFF4F8` (alice), `#F9F9F9` (snow)
- **Fonts**: Sofia Pro (display + UI), Proxima Nova (body), Plantin (serif highlights)

## CMS setup (post-deploy)

1. Push this repo to GitHub.
2. Connect to Netlify, deploy from `main`.
3. In Netlify dashboard:
   - **Identity** → enable
   - **Identity → Registration** → set to "Invite only"
   - **Identity → Services → Git Gateway** → enable
   - **Identity** → invite editors via email
4. Editors visit `/admin/` on your live site, log in via the invitation email.

The CMS is configured for **editorial workflow** — edits become draft PRs, not direct commits.

## Adobe Fonts (Typekit) — IMPORTANT

The Typekit kit (`lqp1bjs.css`) referenced in `BaseLayout.astro` is the original QuoteYeti kit.
**You must replace it with your own kit ID before production**, or the fonts may stop loading.

To use your own kit:
1. Sign up at fonts.adobe.com
2. Create a kit including Plantin, Proxima Nova, and Sofia Pro
3. Replace the `lqp1bjs.css` reference in `src/layouts/BaseLayout.astro` with your kit URL

If you don't want to license Adobe Fonts, swap to open-source alternatives in `tokens.css`:
- Sofia Pro → Source Sans 3 or Inter
- Proxima Nova → Inter or Source Sans 3
- Plantin → Source Serif 4 or Lora

## Migrating WordPress content (Path B for later)

When you're ready to bring over real content from WordPress, write a migration script that:

1. Hits `https://www.quoteyeti.com/wp-json/wp/v2/{type}?per_page=100&page={n}`
2. For each post: extracts `title`, `slug`, `content.rendered`, `date`, `modified`, and any custom fields
3. Runs `content.rendered` through Turndown to convert HTML → markdown
4. Downloads images referenced in the content to `public/uploads/`
5. Writes a `.md` file with the right frontmatter into `src/content/{collection}/`

`turndown` is already in devDependencies. A starter script would go in `scripts/migrate-wp.mjs`.

## What's still placeholder vs. real

**Real (extracted from source):**
- Color palette, typography, spacing scale, breakpoints
- All 19 SVGs (peaks, yeti mascot, footprint, hero clouds, etc.)
- Header menu structure, navigation items, link targets
- Footer brands list (44 brands), providers list (~85)
- URL/slug patterns matching the WP site

**Placeholder (you'll iterate on):**
- All body copy is lorem ipsum
- Press logos are text-only (replace with actual Fox/USA Today/etc. SVGs if you have rights)
- ZIP form posts to `/quotes/` but no backend wired up yet
- Mobile menu drawer (header has the button + state, drawer UI is TODO)
- Cookie banner, modal CTA, exit-intent — not yet implemented
- The "underline reveal" animation on h2 is static (no scroll trigger yet)
