/**
 * QuoteYeti editorial team — single source of truth.
 *
 * Every guide, review, and blog post pulls byline data from here.
 * Author pages live at /about/team/<slug>/ and aggregate their work.
 *
 * Role badges are styled like the Bankrate / NerdWallet author cards:
 *   - WRITER badge in vertical accent color
 *   - REVIEWED BY in resolution blue
 *   - DATA in malibu blue
 *
 * E-E-A-T schema mapping:
 *   - "author" → Person @id with sameAs links (LinkedIn, ORCID, etc.)
 *   - "reviewer" → second Person on the Article schema
 *   - Both link to the team profile page as the canonical authority anchor.
 */

export type AuthorRole = "writer" | "reviewer" | "data";

export interface Author {
  slug: string;
  name: string;
  /** Short role label shown in the byline (e.g. "Writer", "Editor"). */
  role: string;
  /** What they do — single line, shown below name on cards. */
  title: string;
  /** Long-form bio paragraph(s) for the team profile page. */
  bio: string;
  /** Years writing/reporting in this field. */
  yearsExperience?: number;
  /** Areas of focus (e.g. "auto insurance", "consumer finance"). */
  expertise: string[];
  /** Public credentials, licenses, degrees. */
  credentials?: string[];
  /** Verified social/professional profiles for sameAs JSON-LD. */
  sameAs?: { label: string; url: string }[];
  /** Email for the team page (optional). */
  email?: string;
  /** Avatar/photo URL. SVG initials avatar if no photo. */
  avatar?: string;
  /** Brand color used on author cards. Defaults to malibu. */
  accent?: string;
}

// =========================================================================
// THE TEAM
// =========================================================================

export const AUTHORS: Record<string, Author> = {
  "rai-antonio": {
    slug: "rai-antonio",
    name: "Rai Antonio",
    role: "Senior Staff Writer",
    title: "Senior Staff Writer · Insurance & Personal Finance",
    bio:
      "Rai Antonio leads editorial production at QuoteYeti, writing across all eight insurance verticals — auto, home, life, business, health, renters, pet, and travel. Her work focuses on translating complex policy structures into clear, decision-ready prose for buyers. Before QuoteYeti, Rai spent six years reporting on consumer finance, where she covered everything from credit score mechanics to the structural quirks of the U.S. health insurance marketplace. She approaches every guide the same way: figure out the decision the reader is trying to make, find what's actually material, and cut the rest.",
    yearsExperience: 6,
    expertise: [
      "Auto insurance",
      "Home insurance",
      "Life insurance",
      "Personal finance",
      "Consumer policy",
    ],
    credentials: [
      "6+ years reporting on insurance and consumer finance",
      "200+ published guides and explainers across major personal finance outlets",
    ],
    sameAs: [
      // Add real URLs when the author pages go live
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
    ],
    avatar: "/assets/images/team/rai-antonio.svg",
    accent: "#64BCE1", // malibu
  },

  "david-krug": {
    slug: "david-krug",
    name: "David Krug",
    role: "Editor-in-Chief",
    title: "Editor-in-Chief · Founder, QuoteYeti",
    bio:
      "David Krug is the founder and editor-in-chief of QuoteYeti. He reviews every piece of editorial content for accuracy, fairness, and consistency with the QuoteYeti methodology. David has spent over fifteen years at the intersection of finance and media — building independent research operations and personally vetting the data, sources, and recommendations that go out under the QuoteYeti name. He sets the editorial standard: no paid rankings, no displacive summaries, no carrier we wouldn't recommend to a family member.",
    yearsExperience: 15,
    expertise: [
      "Editorial standards",
      "Carrier methodology",
      "Insurance market structure",
      "Independent research",
    ],
    credentials: [
      "Founder and Editor-in-Chief, QuoteYeti",
      "15+ years building independent research and editorial operations",
      "Author of the QuoteYeti editorial methodology",
    ],
    sameAs: [
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
    ],
    avatar: "/assets/images/team/david-krug.svg",
    accent: "#2C4577", // resolution
  },

  "felix-lucero": {
    slug: "felix-lucero",
    name: "Felix Lucero",
    role: "Data Scientist",
    title: "Lead Data Scientist · Insurance Pricing & Quote Analytics",
    bio:
      "Felix Lucero leads quantitative work at QuoteYeti. He builds and maintains the pricing models, sample-quote analytics, and state-by-state rate datasets that anchor our editorial rankings. Felix's job is to make sure every number you read on QuoteYeti — average rates, spread between carriers, the math behind a recommendation — comes from a defensible methodology with documented sources. He holds a master's in applied statistics and has spent the last decade working with consumer-pricing datasets.",
    yearsExperience: 10,
    expertise: [
      "Insurance pricing",
      "Sample-quote analytics",
      "Statistical methodology",
      "Rate datasets",
      "Quantitative analysis",
    ],
    credentials: [
      "M.S. Applied Statistics",
      "10+ years in consumer pricing and predictive modeling",
      "Maintains the QuoteYeti rate analytics infrastructure",
    ],
    sameAs: [
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
    ],
    avatar: "/assets/images/team/felix-lucero.svg",
    accent: "#14A38B", // health green — analytical
  },
};

// =========================================================================
// DEFAULT TEAM ATTRIBUTION
//
// Used everywhere content doesn't specify its own author. We attribute:
//   - Rai writes
//   - David reviews
//   - Felix is credited for data on rate/pricing-heavy pages
// =========================================================================

export const DEFAULT_BYLINE = {
  writer: AUTHORS["rai-antonio"],
  reviewer: AUTHORS["david-krug"],
  data: AUTHORS["felix-lucero"],
} as const;

/**
 * Pages with rate/pricing tables should credit Felix.
 * Returns true when the URL pattern suggests pricing data is central.
 */
export function isDataHeavyPage(pathname: string): boolean {
  return (
    pathname.includes("/cheapest/") ||
    pathname.includes("/by-state/") ||
    pathname.includes("/reviews/") ||
    pathname.includes("/brands/") ||
    pathname.includes("/best/") ||
    pathname.includes("/how-much-do-i-need/")
  );
}

/**
 * Resolve an author by slug, name, or fall back.
 * Default fallback is the writer (Rai). Pass a different Author to override
 * (e.g. when resolving a reviewer slot, pass DEFAULT_BYLINE.reviewer).
 */
export function resolveAuthor(input?: string, fallback: Author = DEFAULT_BYLINE.writer): Author {
  if (!input) return fallback;
  const trimmed = input.trim();
  // Try slug
  if (AUTHORS[trimmed]) return AUTHORS[trimmed];
  // Try name match
  for (const a of Object.values(AUTHORS)) {
    if (a.name.toLowerCase() === trimmed.toLowerCase()) return a;
  }
  // Fall back
  return fallback;
}

export const AUTHOR_LIST = Object.values(AUTHORS);
