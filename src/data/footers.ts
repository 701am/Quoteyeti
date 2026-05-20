/**
 * Section-scoped footer config.
 * The <Footer> component reads this based on the current vertical
 * and renders: section CTA band → section link columns → universal bottom strip.
 *
 * Every URL referenced here MUST resolve to a live page in the build.
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
  eyebrow?: string;
  heading: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  illustration?: string;
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
    illustration: "/assets/images/bob-the-yeti-head.png",
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
      title: "Resources",
      links: [
        { label: "Glossary", href: "/glossary/" },
        { label: "FAQs", href: "/faqs/" },
        { label: "The Dispatch (blog)", href: "/blog/" },
        { label: "Methodology", href: "/methodology/" },
        { label: "Editorial standards", href: "/editorial/" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about/" },
        { label: "Editorial team", href: "/about/team/" },
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
      eyebrow: "See your real rate",
      heading: "Compare your auto rate against the carriers we cover.",
      ctaLabel: "See auto rates",
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
          { label: "Honda", href: "/auto/brands/honda/" },
          { label: "Subaru", href: "/auto/brands/subaru/" },
          { label: "Tesla", href: "/auto/brands/tesla/" },
          { label: "Toyota", href: "/auto/brands/toyota/" },
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
        title: "Auto Resources",
        links: [
          { label: "Cheapest auto", href: "/auto/cheapest/" },
          { label: "Best auto", href: "/auto/best/" },
          { label: "How much do I need?", href: "/auto/how-much-do-i-need/" },
          { label: "Coverage types", href: "/auto/coverage-types/" },
          { label: "Common discounts", href: "/auto/discounts/" },
          { label: "By state", href: "/auto/by-state/" },
          { label: "Glossary", href: "/auto/glossary/" },
          { label: "FAQs", href: "/auto/faqs/" },
        ],
      },
    ],
  },

  home: {
    heroCTA: {
      eyebrow: "Protect your biggest investment",
      heading: "See what your home really costs to insure.",
      ctaLabel: "See home rates",
      ctaHref: "/home-insurance/quotes/",
      illustration: "/assets/images/bob-the-yeti-head.png",
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
        title: "Plan your coverage",
        links: [
          { label: "How much do I need?", href: "/home-insurance/how-much-do-i-need/" },
          { label: "Types of coverage", href: "/home-insurance/coverage-types/" },
          { label: "Common discounts", href: "/home-insurance/discounts/" },
          { label: "Home FAQs", href: "/home-insurance/faqs/" },
        ],
      },
      {
        title: "Learn more",
        links: [
          { label: "Home insurance guides", href: "/home-insurance/guides/" },
          { label: "The Dispatch (blog)", href: "/blog/" },
          { label: "Glossary", href: "/glossary/" },
        ],
      },
    ],
  },

  life: {
    heroCTA: {
      eyebrow: "For the people who count on you",
      heading: "Term, whole, or universal — find the right fit.",
      ctaLabel: "See life rates",
      ctaHref: "/life-insurance/quotes/",
      illustration: "/assets/images/bob-the-yeti-head.png",
    },
    columns: [
      {
        title: "Compare Life Insurance",
        links: [
          { label: "Best life insurance", href: "/life-insurance/best/" },
          { label: "Cheapest life insurance", href: "/life-insurance/cheapest/" },
          { label: "By state", href: "/life-insurance/by-state/" },
          { label: "Provider reviews", href: "/life-insurance/reviews/" },
        ],
      },
      {
        title: "Plan your coverage",
        links: [
          { label: "How much do I need?", href: "/life-insurance/how-much-do-i-need/" },
          { label: "Types of coverage", href: "/life-insurance/coverage-types/" },
          { label: "Common discounts", href: "/life-insurance/discounts/" },
          { label: "Life FAQs", href: "/life-insurance/faqs/" },
        ],
      },
      {
        title: "Learn more",
        links: [
          { label: "Life insurance guides", href: "/life-insurance/guides/" },
          { label: "The Dispatch (blog)", href: "/blog/" },
          { label: "Glossary", href: "/glossary/" },
        ],
      },
    ],
  },

  business: {
    heroCTA: {
      eyebrow: "Built for the work you do",
      heading: "Get coverage that scales with your business.",
      ctaLabel: "See business rates",
      ctaHref: "/business-insurance/quotes/",
      illustration: "/assets/images/bob-the-yeti-head.png",
    },
    columns: [
      {
        title: "Compare Business Insurance",
        links: [
          { label: "Best business insurance", href: "/business-insurance/best/" },
          { label: "Cheapest business insurance", href: "/business-insurance/cheapest/" },
          { label: "Provider reviews", href: "/business-insurance/reviews/" },
        ],
      },
      {
        title: "Plan your coverage",
        links: [
          { label: "How much do I need?", href: "/business-insurance/how-much-do-i-need/" },
          { label: "Types of coverage", href: "/business-insurance/coverage-types/" },
          { label: "Common discounts", href: "/business-insurance/discounts/" },
          { label: "Business FAQs", href: "/business-insurance/faqs/" },
        ],
      },
      {
        title: "Learn more",
        links: [
          { label: "Business insurance guides", href: "/business-insurance/guides/" },
          { label: "The Dispatch (blog)", href: "/blog/" },
          { label: "Glossary", href: "/glossary/" },
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
      illustration: "/assets/images/bob-the-yeti-head.png",
    },
    columns: [
      {
        title: "Compare Health Insurance",
        links: [
          { label: "Best health insurance", href: "/health-insurance/best/" },
          { label: "Provider reviews", href: "/health-insurance/reviews/" },
          { label: "Medicare", href: "/health-insurance/medicare/" },
        ],
      },
      {
        title: "Plan your coverage",
        links: [
          { label: "Health insurance guides", href: "/health-insurance/guides/" },
          { label: "The Dispatch (blog)", href: "/blog/" },
        ],
      },
      {
        title: "Learn more",
        links: [
          { label: "FAQs", href: "/faqs/" },
          { label: "Glossary", href: "/glossary/" },
          { label: "Methodology", href: "/methodology/" },
        ],
      },
    ],
  },

  renters: {
    heroCTA: {
      eyebrow: "$15/month coverage you'll actually appreciate",
      heading: "Cover your stuff for less than a streaming subscription.",
      ctaLabel: "See renters rates",
      ctaHref: "/renters-insurance/quotes/",
      illustration: "/assets/images/bob-the-yeti-head.png",
    },
    columns: [
      {
        title: "Compare Renters",
        links: [
          { label: "Best renters insurance", href: "/renters-insurance/best/" },
          { label: "Provider reviews", href: "/renters-insurance/reviews/" },
        ],
      },
      {
        title: "Plan your coverage",
        links: [
          { label: "Renters insurance guides", href: "/renters-insurance/guides/" },
          { label: "The Dispatch (blog)", href: "/blog/" },
        ],
      },
      {
        title: "Learn more",
        links: [
          { label: "FAQs", href: "/faqs/" },
          { label: "Glossary", href: "/glossary/" },
          { label: "Methodology", href: "/methodology/" },
        ],
      },
    ],
  },

  pet: {
    heroCTA: {
      eyebrow: "Because they're family too",
      heading: "Compare pet plans without the upsell.",
      ctaLabel: "See pet rates",
      ctaHref: "/pet-insurance/quotes/",
      illustration: "/assets/images/bob-the-yeti-head.png",
    },
    columns: [
      {
        title: "Compare Pet Insurance",
        links: [
          { label: "Best pet insurance", href: "/pet-insurance/best/" },
          { label: "Provider reviews", href: "/pet-insurance/reviews/" },
        ],
      },
      {
        title: "Plan your coverage",
        links: [
          { label: "Pet insurance guides", href: "/pet-insurance/guides/" },
          { label: "The Dispatch (blog)", href: "/blog/" },
        ],
      },
      {
        title: "Learn more",
        links: [
          { label: "FAQs", href: "/faqs/" },
          { label: "Glossary", href: "/glossary/" },
          { label: "Methodology", href: "/methodology/" },
        ],
      },
    ],
  },

  travel: {
    heroCTA: {
      eyebrow: "Cover the unexpected",
      heading: "Don't let one canceled flight wreck the trip.",
      ctaLabel: "See travel rates",
      ctaHref: "/travel-insurance/quotes/",
      illustration: "/assets/images/bob-the-yeti-head.png",
    },
    columns: [
      {
        title: "Compare Travel Insurance",
        links: [
          { label: "Best travel insurance", href: "/travel-insurance/best/" },
          { label: "Provider reviews", href: "/travel-insurance/reviews/" },
        ],
      },
      {
        title: "Plan your coverage",
        links: [
          { label: "Travel insurance guides", href: "/travel-insurance/guides/" },
          { label: "The Dispatch (blog)", href: "/blog/" },
        ],
      },
      {
        title: "Learn more",
        links: [
          { label: "FAQs", href: "/faqs/" },
          { label: "Glossary", href: "/glossary/" },
          { label: "Methodology", href: "/methodology/" },
        ],
      },
    ],
  },
};
