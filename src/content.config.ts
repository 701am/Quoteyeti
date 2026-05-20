import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Shared base schema for all editorial entries.
 */
const baseEntry = z.object({
  title: z.string(),
  description: z.string().optional(),
  slug: z.string().optional(),
  draft: z.boolean().optional().default(false),
  publishDate: z.coerce.date().optional(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean().optional().default(false),
  ogImage: z.string().optional(),
});

/**
 * Rich review schema — used by all 8 verticals for carrier reviews.
 * Matches the ReviewLayout component expectations.
 */
const reviewSchema = baseEntry.extend({
  // Carrier identification
  company: z.string(),
  companyLogo: z.string().optional(),
  websiteUrl: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  foundedYear: z.number().optional(),

  // Hero / positioning
  positioning: z.string(),                  // e.g. "GEICO is the fourth-best..."
  editor: z.string().optional(),

  // Key takeaways
  takeaways: z.array(z.string()).default([]),

  // Ratings
  overallScore: z.number().min(0).max(5).optional(),
  overallRank: z.number().optional(),
  ratings: z.array(z.object({
    category: z.string(),
    score: z.number().min(0).max(5),
    rank: z.number().optional(),
  })).default([]),

  // Cost
  costSummary: z.string().optional(),
  avgMonthly: z.string().optional(),
  avgAnnual: z.string().optional(),
  differenceFromAvg: z.string().optional(),
  costByCategory: z.array(z.object({
    category: z.string(),
    minimum: z.string(),
    full: z.string(),
    rank: z.number().optional(),
  })).optional(),

  // Customer experience
  cxSummary: z.string().optional(),
  cxBuying: z.string().optional(),
  cxPolicyManagement: z.string().optional(),
  cxClaims: z.string().optional(),

  // Industry ratings
  industryRatings: z.array(z.object({
    source: z.string(),
    score: z.string(),
    overview: z.string(),
  })).optional(),

  // Discounts (auto vertical primarily)
  discounts: z.array(z.object({
    type: z.string(),
    amount: z.string(),
    eligibility: z.string(),
  })).optional(),

  // Coverage
  coverageSummary: z.string().optional(),
  coverageAddOns: z.array(z.object({
    name: z.string(),
    covers: z.string(),
    features: z.string().optional(),
  })).optional(),

  // Pros / Cons / Bottom line
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  bottomLine: z.string().optional(),

  // FAQ
  faqs: z.array(z.object({
    q: z.string(),
    a: z.string(),
  })).optional(),

  // Methodology
  methodologyIntro: z.string().optional(),
  methodologyFactors: z.array(z.object({
    label: z.string(),
    weight: z.string(),
    description: z.string(),
  })).optional(),

  // Author bio (overrides global author)
  authorBio: z.string().optional(),

  // Star rating shown on listing pages
  starRating: z.number().min(0).max(5).optional(),
});

/**
 * Brand pages (auto vertical only).
 */
const autoBrands = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/auto/brands" }),
  schema: baseEntry.extend({
    brand: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    averageRate: z.number().optional(),
    minRate: z.number().optional(),
    maxRate: z.number().optional(),
    bodyType: z.string().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

/**
 * Reviews — one collection per vertical, all using the rich review schema.
 */
function reviewCollection(verticalSlug: string) {
  return defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: `./src/content/${verticalSlug}/reviews` }),
    schema: reviewSchema,
  });
}

const autoReviews = reviewCollection("auto");
const homeReviews = reviewCollection("home");
const lifeReviews = reviewCollection("life");
const businessReviews = reviewCollection("business");
const healthReviews = reviewCollection("health");
const rentersReviews = reviewCollection("renters");
const petReviews = reviewCollection("pet");
const travelReviews = reviewCollection("travel");

/**
 * Locations — one collection per vertical. State + city pages.
 */
function locationCollection(verticalSlug: string) {
  return defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: `./src/content/${verticalSlug}/locations` }),
    schema: baseEntry.extend({
      state: z.string().optional(),
      city: z.string().optional(),
      stateAbbr: z.string().optional(),
      averageRate: z.number().optional(),
      minLiabilityRequired: z.string().optional(),
      isCityPage: z.boolean().optional().default(false),
    }),
  });
}

const autoLocations = locationCollection("auto");
const homeLocations = locationCollection("home");
const lifeLocations = locationCollection("life");
const businessLocations = locationCollection("business");

const autoGlossary = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/auto/glossary" }),
  schema: baseEntry.extend({
    term: z.string(),
    relatedTerms: z.array(z.string()).optional(),
  }),
});

const autoFaqs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/auto/faqs" }),
  schema: baseEntry.extend({
    question: z.string(),
    category: z.string().optional(),
  }),
});

/**
 * Generic vertical guides (excludes reviews — those are separate).
 */
function verticalGuides(slug: string) {
  return defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: `./src/content/${slug}/guides`,
    }),
    schema: baseEntry.extend({
      vertical: z.string().optional(),
      subcategory: z.string().optional(),
      heroImage: z.string().optional(),
    }),
  });
}

const home = verticalGuides("home");
const life = verticalGuides("life");
const business = verticalGuides("business");
const health = verticalGuides("health");
const renters = verticalGuides("renters");
const pet = verticalGuides("pet");
const travel = verticalGuides("travel");

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: baseEntry.extend({
    layout: z.enum(["default", "narrow", "wide"]).optional().default("default"),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: baseEntry.extend({
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

const verticals = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/verticals" }),
  schema: z.object({
    title: z.string(),
    verticalKey: z.enum(["auto", "home", "life", "business", "health", "renters", "pet", "travel"]),
    heroHeadline: z.string().optional(),
    heroLede: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = {
  "auto-brands": autoBrands,
  "auto-reviews": autoReviews,
  "home-reviews": homeReviews,
  "life-reviews": lifeReviews,
  "business-reviews": businessReviews,
  "health-reviews": healthReviews,
  "renters-reviews": rentersReviews,
  "pet-reviews": petReviews,
  "travel-reviews": travelReviews,
  "auto-locations": autoLocations,
  "home-locations": homeLocations,
  "life-locations": lifeLocations,
  "business-locations": businessLocations,
  "auto-glossary": autoGlossary,
  "auto-faqs": autoFaqs,
  home,
  life,
  business,
  health,
  renters,
  pet,
  travel,
  pages,
  posts,
  verticals,
};
