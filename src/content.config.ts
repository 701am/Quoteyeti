import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// SEO/meta fields that come off Yoast or RankMath in WP — captured uniformly here
const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonical: z.string().url().optional(),
  noindex: z.boolean().default(false),
});

// Brand pages — /brands/{slug}/
const brands = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/brands" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    brandName: z.string(),
    heroImage: z.string().optional(),
    logo: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    seo: seoSchema.default({}),
    // Replicate WP custom fields seen on brand pages
    averageRate: z.string().optional(),
    popularModels: z.array(z.string()).default([]),
    relatedReviews: z.array(z.string()).default([]),
  }),
});

// Provider reviews — /reviews/{slug}/
const reviews = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/reviews" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    providerName: z.string(),
    logo: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    seo: seoSchema.default({}),
  }),
});

// Best-of articles — /best-car-insurance/{slug}/
const bestOf = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/bestOf" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    heroImage: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    seo: seoSchema.default({}),
  }),
});

// Generic pages — /about/, /contact/, /faqs/, /glossary/, /privacy-policy/, etc.
const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    template: z.enum(["default", "faq", "glossary", "contact"]).default("default"),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    seo: seoSchema.default({}),
  }),
});

export const collections = { brands, reviews, bestOf, pages };
