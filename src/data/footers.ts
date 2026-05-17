/**
 * Section-scoped footer config.
 * The <Footer> component reads this based on the current vertical
 * and renders: section CTA band → section link columns → universal bottom strip.
 *
 * Pattern: each footer has 3-4 link columns + a heroCTA for the colored top band.
 * The bottom strip (legal, social, address) is rendered universally by the component.
 */

import type { VerticalKey } from "./verticals";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterHeroCTA {
  eyebrow?: string;        // small label above headline
  heading: string;         // big headline in the CTA band
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  illustration?: string;   // path to SVG/img — section mascot variant
}

export interface SectionFooter {
  heroCTA: FooterHeroCTA;
  columns: FooterColumn[];
}

/** Default footer used on routes that don't match a vertical (homepage, /about/, etc.) */
export const DEFAULT_FOOTER: SectionFooter = {
  heroCTA: {
    eyebrow: "One yeti, every line of coverage",
    heading: "Ready to find your rate?",
    body: "We compare auto, home, life, business, health, renters, pet, and travel insurance — in one place.",
    ctaLabel: "Get started",
    ctaHref: "/auto/quotes/",
    illustration: "/assets/images/yeti-hero.svg",
  },
  columns: [
    {
      title: "Insurance",
      links: [
        { label: "Auto", href: "/auto/" },
        { label: "Home", href: "/home-insurance/" },
        { label: "Life", href: "/life-insurance/" },
        { label: "Business", href: "/business-insurance/" },
        { label: "Health", href: "/health-insurance/" },
        { label: "Renters", href: "/renters-insurance/" },
        { label: "Pet", href: "/pet-insurance/" },
        { label: "Travel", href: "/travel-insurance/" },
      ],
    },
    {
      title: "Tools",
      links: [
        { label: "All calculators", href: "/calculators/" },
        { label: "Best by state", href: "/best-by-state/" },
        { label: "Compare carriers", href: "/compare/" },
        { label: "Glossary", href: "/glossary/" },
        { label: "FAQs", href: "/faqs/" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about/" },
        { label: "Editorial standards", href: "/editorial/" },
        { label: "Press", href: "/press/" },
        { label: "Contact", href: "/contact/" },
        { label: "Partner with us", href: "/partners/" },
      ],
    },
  ],
};

export const SECTION_FOOTERS: Record<VerticalKey, SectionFooter> = {
  auto: {
    heroCTA: {
      eyebrow: "Still paying too much?",
      heading: "Don't leave before you see how much we can help you save.",
      ctaLabel: "Let the savings begin!",
      ctaHref: "/auto/quotes/",
      illustration: "/assets/images/thumbs-up-left-wink.svg",
    },
    columns: [
      {
        title: "By Brand",
        links: [
          { label: "Acura", href: "/auto/brands/acura/" },
          { label: "BMW", href: "/auto/brands/bmw/" },
          { label: "Chevrolet", href: "/auto/brands/chevrolet/" },
          { label: "Ford", href: "/auto/brands/ford/" },
          { label: "Honda", href: "/auto/brands/honda-insurance-rates/" },
          { label: "Subaru", href: "/auto/brands/subaru-insurance-rates/" },
          { label: "Tesla", href: "/auto/brands/tesla-insurance-rates/" },
          { label: "Toyota", href: "/auto/brands/toyota-insurance-rates/" },
          { label: "All brands →", href: "/auto/brands/" },
        ],
      },
      {
        title: "By Provider",
        links: [
          { label: "Allstate", href: "/auto/reviews/allstate-insurance/" },
          { label: "GEICO", href: "/auto/reviews/geico-insurance/" },
          { label: "Liberty Mutual", href: "/auto/reviews/liberty-mutual-insurance/" },
          { label: "Nationwide", href: "/auto/reviews/nationwide-insurance/" },
          { label: "Progressive", href: "/auto/reviews/progressive-insurance/" },
          { label: "State Farm", href: "/auto/reviews/state-farm-insurance/" },
          { label: "USAA", href: "/auto/reviews/usaa-insurance/" },
          { label: "All reviews →", href: "/auto/reviews/" },
        ],
      },
      {
        title: "Auto Tools",
        links: [
          { label: "Auto calculator", href: "/auto/calculator/" },
          { label: "How much do I need?", href: "/auto/how-much-do-i-need/" },
          { label: "Discounts guide", href: "/auto/discounts/" },
          { label: "Coverage types", href: "/auto/coverage-types/" },
          { label: "Best by state", href: "/auto/by-state/" },
        ],
      },
    ],
  },

  home: {
    heroCTA: {
      eyebrow: "Protect your biggest investment",
      heading: "See what your home really costs to insure.",
      ctaLabel: "Get home quotes",
      ctaHref: "/home-insurance/quotes/",
      illustration: "/assets/images/yeti-hero.svg",
    },
    columns: [
      {
        title: "Compare Home Insurance",
        links: [
          { label: "Best home insurance", href: "/home-insurance/best/" },
          { label: "Cheapest home insurance", href: "/home-insurance/cheapest/" },
          { label: "By state", href: "/home-insurance/by-state/" },
          { label: "Provider reviews", href: "/home-insurance/reviews/" },
        ],
      },
      {
        title: "By Property Type",
        links: [
          { label: "Single-family home", href: "/home-insurance/single-family/" },
          { label: "Condo (HO-6)", href: "/home-insurance/condo/" },
          { label: "Manufactured home", href: "/home-insurance/manufactured/" },
          { label: "Vacation home", href: "/home-insurance/vacation/" },
          { label: "Landlord policy", href: "/home-insurance/landlord/" },
        ],
      },
      {
        title: "Home Tools",
        links: [
          { label: "Home calculator", href: "/home-insurance/calculator/" },
          { label: "Coverage limits guide", href: "/home-insurance/coverage-limits/" },
          { label: "Flood vs. home insurance", href: "/home-insurance/flood/" },
          { label: "Filing a claim", href: "/home-insurance/claims/" },
        ],
      },
    ],
  },

  life: {
    heroCTA: {
      eyebrow: "For the people who count on you",
      heading: "Term, whole, or universal — find the right fit.",
      ctaLabel: "Get life quotes",
      ctaHref: "/life-insurance/quotes/",
      illustration: "/assets/images/yeti-hero.svg",
    },
    columns: [
      {
        title: "Policy Types",
        links: [
          { label: "Term life", href: "/life-insurance/term/" },
          { label: "Whole life", href: "/life-insurance/whole/" },
          { label: "Universal life", href: "/life-insurance/universal/" },
          { label: "No-medical-exam", href: "/life-insurance/no-exam/" },
          { label: "Guaranteed acceptance", href: "/life-insurance/guaranteed/" },
        ],
      },
      {
        title: "By Life Stage",
        links: [
          { label: "Young families", href: "/life-insurance/young-families/" },
          { label: "Singles", href: "/life-insurance/singles/" },
          { label: "Seniors", href: "/life-insurance/seniors/" },
          { label: "Final expense", href: "/life-insurance/final-expense/" },
        ],
      },
      {
        title: "Life Tools",
        links: [
          { label: "Life insurance calculator", href: "/life-insurance/calculator/" },
          { label: "Term vs. whole compared", href: "/life-insurance/term-vs-whole/" },
          { label: "How much do I need?", href: "/life-insurance/how-much-do-i-need/" },
          { label: "Top providers", href: "/life-insurance/best/" },
        ],
      },
    ],
  },

  business: {
    heroCTA: {
      eyebrow: "Built for the work you do",
      heading: "Get coverage that scales with your business.",
      ctaLabel: "Get business quotes",
      ctaHref: "/business-insurance/quotes/",
      illustration: "/assets/images/yeti-hero.svg",
    },
    columns: [
      {
        title: "Coverage Types",
        links: [
          { label: "General liability", href: "/business-insurance/general-liability/" },
          { label: "Workers' comp", href: "/business-insurance/workers-comp/" },
          { label: "Professional liability (E&O)", href: "/business-insurance/professional-liability/" },
          { label: "Commercial auto", href: "/business-insurance/commercial-auto/" },
          { label: "Cyber liability", href: "/business-insurance/cyber/" },
          { label: "BOP (business owner's policy)", href: "/business-insurance/bop/" },
        ],
      },
      {
        title: "By Industry",
        links: [
          { label: "Contractors", href: "/business-insurance/contractors/" },
          { label: "Restaurants", href: "/business-insurance/restaurants/" },
          { label: "Retail", href: "/business-insurance/retail/" },
          { label: "Consultants & freelancers", href: "/business-insurance/consultants/" },
          { label: "Healthcare practices", href: "/business-insurance/healthcare/" },
        ],
      },
      {
        title: "Business Tools",
        links: [
          { label: "Cost calculator", href: "/business-insurance/calculator/" },
          { label: "Cheapest small business", href: "/business-insurance/cheapest/" },
          { label: "Best for sole proprietors", href: "/business-insurance/sole-proprietors/" },
          { label: "Coverage by state", href: "/business-insurance/by-state/" },
        ],
      },
    ],
  },

  health: {
    heroCTA: {
      eyebrow: "Care that fits your life",
      heading: "Find a plan that matches your needs and budget.",
      ctaLabel: "Compare health plans",
      ctaHref: "/health-insurance/quotes/",
      illustration: "/assets/images/yeti-hero.svg",
    },
    columns: [
      {
        title: "Plan Types",
        links: [
          { label: "ACA marketplace", href: "/health-insurance/aca/" },
          { label: "Short-term plans", href: "/health-insurance/short-term/" },
          { label: "HMO vs. PPO", href: "/health-insurance/hmo-vs-ppo/" },
          { label: "High-deductible (HDHP)", href: "/health-insurance/hdhp/" },
          { label: "Catastrophic plans", href: "/health-insurance/catastrophic/" },
        ],
      },
      {
        title: "Medicare",
        links: [
          { label: "How Medicare works", href: "/health-insurance/medicare/" },
          { label: "Medicare Advantage", href: "/health-insurance/medicare-advantage/" },
          { label: "Medicare Supplement (Medigap)", href: "/health-insurance/medigap/" },
          { label: "Part D drug plans", href: "/health-insurance/part-d/" },
          { label: "Signing up", href: "/health-insurance/medicare-sign-up/" },
        ],
      },
      {
        title: "Health Tools",
        links: [
          { label: "Plan estimator", href: "/health-insurance/calculator/" },
          { label: "Subsidy calculator", href: "/health-insurance/subsidy/" },
          { label: "Dental & vision add-ons", href: "/health-insurance/dental-vision/" },
          { label: "Open enrollment 101", href: "/health-insurance/open-enrollment/" },
        ],
      },
    ],
  },

  renters: {
    heroCTA: {
      eyebrow: "$15/month coverage you'll actually appreciate",
      heading: "Cover your stuff for less than a streaming subscription.",
      ctaLabel: "Get renters quotes",
      ctaHref: "/renters-insurance/quotes/",
      illustration: "/assets/images/yeti-hero.svg",
    },
    columns: [
      {
        title: "Compare Renters",
        links: [
          { label: "Best renters insurance", href: "/renters-insurance/best/" },
          { label: "Cheapest renters insurance", href: "/renters-insurance/cheapest/" },
          { label: "Do I need it?", href: "/renters-insurance/do-i-need-it/" },
          { label: "By state", href: "/renters-insurance/by-state/" },
        ],
      },
      {
        title: "By Situation",
        links: [
          { label: "College students", href: "/renters-insurance/students/" },
          { label: "Roommates", href: "/renters-insurance/roommates/" },
          { label: "Pet owners", href: "/renters-insurance/pet-owners/" },
          { label: "Renters with a home office", href: "/renters-insurance/home-office/" },
        ],
      },
      {
        title: "Renters Tools",
        links: [
          { label: "Cost calculator", href: "/renters-insurance/calculator/" },
          { label: "Coverage limits", href: "/renters-insurance/coverage-limits/" },
          { label: "Bundling with auto", href: "/renters-insurance/bundling/" },
          { label: "Filing a claim", href: "/renters-insurance/claims/" },
        ],
      },
    ],
  },

  pet: {
    heroCTA: {
      eyebrow: "Because they're family too",
      heading: "Compare pet plans without the upsell.",
      ctaLabel: "Get pet quotes",
      ctaHref: "/pet-insurance/quotes/",
      illustration: "/assets/images/yeti-hero.svg",
    },
    columns: [
      {
        title: "By Pet",
        links: [
          { label: "Dogs", href: "/pet-insurance/dogs/" },
          { label: "Cats", href: "/pet-insurance/cats/" },
          { label: "Multi-pet households", href: "/pet-insurance/multi-pet/" },
          { label: "Senior pets", href: "/pet-insurance/senior-pets/" },
          { label: "Exotic pets", href: "/pet-insurance/exotic/" },
        ],
      },
      {
        title: "Top Providers",
        links: [
          { label: "Healthy Paws", href: "/pet-insurance/healthy-paws/" },
          { label: "Lemonade Pet", href: "/pet-insurance/lemonade/" },
          { label: "Embrace", href: "/pet-insurance/embrace/" },
          { label: "Trupanion", href: "/pet-insurance/trupanion/" },
          { label: "Spot", href: "/pet-insurance/spot/" },
          { label: "All reviews →", href: "/pet-insurance/reviews/" },
        ],
      },
      {
        title: "Pet Tools",
        links: [
          { label: "Pet insurance calculator", href: "/pet-insurance/calculator/" },
          { label: "Best breed-specific coverage", href: "/pet-insurance/breeds/" },
          { label: "Pre-existing conditions", href: "/pet-insurance/pre-existing/" },
          { label: "Wellness add-ons", href: "/pet-insurance/wellness/" },
        ],
      },
    ],
  },

  travel: {
    heroCTA: {
      eyebrow: "Cover the unexpected",
      heading: "Don't let one canceled flight wreck the trip.",
      ctaLabel: "Get travel quotes",
      ctaHref: "/travel-insurance/quotes/",
      illustration: "/assets/images/yeti-hero.svg",
    },
    columns: [
      {
        title: "Trip Types",
        links: [
          { label: "International travel", href: "/travel-insurance/international/" },
          { label: "Domestic travel", href: "/travel-insurance/domestic/" },
          { label: "Cruises", href: "/travel-insurance/cruises/" },
          { label: "Multi-trip / annual", href: "/travel-insurance/annual/" },
          { label: "Adventure & sports", href: "/travel-insurance/adventure/" },
        ],
      },
      {
        title: "Coverage Types",
        links: [
          { label: "Trip cancellation", href: "/travel-insurance/cancellation/" },
          { label: "Cancel for any reason (CFAR)", href: "/travel-insurance/cfar/" },
          { label: "Medical & evacuation", href: "/travel-insurance/medical/" },
          { label: "Baggage protection", href: "/travel-insurance/baggage/" },
          { label: "Rental car coverage", href: "/travel-insurance/rental-car/" },
        ],
      },
      {
        title: "Travel Tools",
        links: [
          { label: "Trip cost calculator", href: "/travel-insurance/calculator/" },
          { label: "Credit card vs. travel insurance", href: "/travel-insurance/credit-card/" },
          { label: "Best providers", href: "/travel-insurance/best/" },
          { label: "How claims work", href: "/travel-insurance/claims/" },
        ],
      },
    ],
  },
};
