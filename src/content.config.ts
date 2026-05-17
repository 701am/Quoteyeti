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
 * Brand pages (auto vertical) — make/model insurance rate guides.
 * Migrated from WP /brands/* to /auto/brands/*.
 */
const autoBrands = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/auto/brands" }),
  schema: baseEntry.extend({
    brand: z.string().optional(),       // "BMW", "Honda"
    model: z.string().optional(),       // "M3", "Civic"
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
 * Reviews (auto vertical) — insurance carrier reviews.
 * Migrated from WP /reviews/* to /auto/reviews/*.
 */
const autoReviews = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/auto/reviews" }),
  schema: baseEntry.extend({
    company: z.string().optional(),
    companyLogo: z.string().optional(),
    starRating: z.number().min(0).max(5).optional(),
    websiteUrl: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    officesCount: z.number().optional(),
    foundedYear: z.number().optional(),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),
    mediaAlphaResult: z.string().optional(),
  }),
});

/**
 * Locations (auto vertical) — state/city auto insurance guides.
 * Migrated from WP /locations/* to /auto/locations/*.
 */
const autoLocations = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/auto/locations" }),
  schema: baseEntry.extend({
    state: z.string().optional(),
    city: z.string().optional(),
    stateAbbr: z.string().optional(),
    averageRate: z.number().optional(),
    minLiabilityRequired: z.string().optional(),
    isCityPage: z.boolean().optional().default(false),
  }),
});

/**
 * Glossary entries (auto vertical).
 */
const autoGlossary = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/auto/glossary" }),
  schema: baseEntry.extend({
    term: z.string(),
    relatedTerms: z.array(z.string()).optional(),
  }),
});

/**
 * FAQ entries (auto vertical).
 */
const autoFaqs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/auto/faqs" }),
  schema: baseEntry.extend({
    question: z.string(),
    category: z.string().optional(),
  }),
});

/**
 * Vertical-specific content collections.
 * Each vertical gets its own folder under src/content/{vertical}/.
 * For now: just guide-style entries; expand later with reviews/locations as needed.
 */
function verticalGuides(slug: string) {
  return defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: `./src/content/${slug}` }),
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

/**
 * Cross-cutting collections.
 */
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

/**
 * Marketing-style hub content per vertical (overrides defaults in vertical landing pages).
 */
const verticals = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/verticals" }),
  schema: z.object({
    title: z.string(),
    verticalKey: z.enum(["auto", "home", "life", "business", "health", "renters", "pet", "travel"]),
    heroHeadline: z.string().optional(),
    heroLede: z.string().optional(),
  }),
});

export const collections = {
  "auto-brands": autoBrands,
  "auto-reviews": autoReviews,
  "auto-locations": autoLocations,
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
