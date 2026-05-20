/**
 * Megamenu data. Each top-level nav entry defines:
 *  - the 8 verticals (each with 3 column panels + featured rail)
 *  - 2 utility groups (Resources, Company)
 */

import type { VerticalKey } from "./verticals";

export interface MegamenuLink {
  label: string;
  href: string;
  desc?: string;       // optional short description for "featured" column
}

export interface MegamenuColumn {
  title: string;
  links: MegamenuLink[];
}

export interface MegamenuFeatured {
  eyebrow: string;
  heading: string;
  body: string;
  cta: { label: string; href: string };
  image?: string;
}

export interface MegamenuPanel {
  columns: MegamenuColumn[];        // 3 columns of links
  featured: MegamenuFeatured;       // visual rail on the right
}

export interface NavEntry {
  label: string;
  href?: string;                    // direct link (no panel)
  panel?: MegamenuPanel;            // megamenu panel
  verticalKey?: VerticalKey;        // ties the panel to a vertical (for accent color)
}

// Helper to build the 3-column panel structure consistently across verticals
function panel(
  vertical: VerticalKey,
  basePath: string,
  shortName: string,
  featured: MegamenuFeatured,
): MegamenuPanel {
  return {
    columns: [
      {
        title: "Compare",
        links: [
          { label: `Compare all ${shortName} insurance`, href: basePath },
          { label: `Cheapest ${shortName} insurance`, href: `${basePath}cheapest/` },
          { label: `Best ${shortName} insurance`, href: `${basePath}best/` },
          { label: `Carrier vs. carrier`, href: `${basePath}compare/` },
          { label: `${shortName} insurance by state`, href: `${basePath}by-state/` },
        ],
      },
      {
        title: "Plan your coverage",
        links: [
          { label: "How much do I need?", href: `${basePath}how-much-do-i-need/` },
          { label: "Types of coverage", href: `${basePath}coverage-types/` },
          { label: "Common discounts", href: `${basePath}discounts/` },
        ],
      },
      {
        title: "Get answers",
        links: [
          { label: "Carrier reviews", href: `${basePath}reviews/` },
          { label: "Guides", href: `${basePath}guides/` },
          { label: "FAQs", href: `${basePath}faqs/` },
        ],
      },
    ],
    featured,
  };
}

export const NAV: NavEntry[] = [
  {
    label: "Auto",
    verticalKey: "auto",
    panel: panel("auto", "/auto/", "Car", {
      eyebrow: "QuoteYeti Original",
      heading: "See your real rate, not a marketing average",
      body: "Drop your ZIP. We pull live rates for your area from the carriers we cover — the way QuoteYeti has always worked.",
      cta: { label: "See auto rates", href: "/auto/quotes/" },
      image: "/assets/images/bob-the-yeti-head.png",
    }),
  },
  {
    label: "Home",
    verticalKey: "home",
    panel: panel("home", "/home-insurance/", "Home", {
      eyebrow: "New",
      heading: "Protect what matters most",
      body: "Compare home insurance rates from the carriers that actually cover your area.",
      cta: { label: "See home rates", href: "/home-insurance/quotes/" },
      image: "/assets/images/bob-the-yeti-head.png",
    }),
  },
  {
    label: "Life",
    verticalKey: "life",
    panel: panel("life", "/life-insurance/", "Life", {
      eyebrow: "New",
      heading: "Coverage for the people who count on you",
      body: "Term, whole, and universal life — compare rates without the sales call.",
      cta: { label: "See life rates", href: "/life-insurance/quotes/" },
      image: "/assets/images/bob-the-yeti-head.png",
    }),
  },
  {
    label: "Business",
    verticalKey: "business",
    panel: panel("business", "/business-insurance/", "Business", {
      eyebrow: "New",
      heading: "Insurance for the work you do",
      body: "General liability, workers' comp, professional indemnity — coverage tailored to your business.",
      cta: { label: "See business rates", href: "/business-insurance/quotes/" },
      image: "/assets/images/bob-the-yeti-head.png",
    }),
  },
  {
    label: "More",
    panel: {
      columns: [
        {
          title: "Health & wellness",
          links: [
            { label: "Health Insurance", href: "/health-insurance/" },
            { label: "Health guides", href: "/health-insurance/guides/" },
            { label: "Best health insurance", href: "/health-insurance/best/" },
          ],
        },
        {
          title: "Property & possessions",
          links: [
            { label: "Renters Insurance", href: "/renters-insurance/" },
            { label: "Pet Insurance", href: "/pet-insurance/" },
            { label: "Travel Insurance", href: "/travel-insurance/" },
          ],
        },
        {
          title: "Quick reference",
          links: [
            { label: "Glossary", href: "/glossary/" },
            { label: "FAQs", href: "/faqs/" },
            { label: "The Dispatch", href: "/blog/" },
          ],
        },
      ],
      featured: {
        eyebrow: "Explore",
        heading: "Eight verticals, one Yeti",
        body: "We help you compare every kind of insurance — from your car to your cat.",
        cta: { label: "Start with auto", href: "/auto/" },
        image: "/assets/images/thumbs-up-left.svg",
      },
    },
  },
  {
    label: "Resources",
    panel: {
      columns: [
        {
          title: "Learn",
          links: [
            { label: "Glossary", href: "/glossary/" },
            { label: "FAQs", href: "/faqs/" },
            { label: "The Dispatch (blog)", href: "/blog/" },
          ],
        },
        {
          title: "How much do I need?",
          links: [
            { label: "Auto coverage sizing", href: "/auto/how-much-do-i-need/" },
            { label: "Home coverage sizing", href: "/home-insurance/how-much-do-i-need/" },
            { label: "Life coverage sizing", href: "/life-insurance/how-much-do-i-need/" },
            { label: "Business coverage sizing", href: "/business-insurance/how-much-do-i-need/" },
          ],
        },
        {
          title: "Compare",
          links: [
            { label: "Auto carrier reviews", href: "/auto/reviews/" },
            { label: "Home carrier reviews", href: "/home-insurance/reviews/" },
            { label: "Life carrier reviews", href: "/life-insurance/reviews/" },
          ],
        },
      ],
      featured: {
        eyebrow: "Reading list",
        heading: "Why we built QuoteYeti",
        body: "The category needs an independent voice. Here's our founding note — what we believe, how we make money, what we won't do.",
        cta: { label: "Read the manifesto", href: "/blog/why-we-built-quoteyeti/" },
        image: "/assets/images/check-your-rate-arrows.svg",
      },
    },
  },
  {
    label: "Company",
    panel: {
      columns: [
        {
          title: "About",
          links: [
            { label: "About QuoteYeti", href: "/about/" },
            { label: "Editorial standards", href: "/editorial/" },
            { label: "Press room", href: "/press/" },
          ],
        },
        {
          title: "Talk to us",
          links: [
            { label: "Contact", href: "/contact/" },
            { label: "Partner with us", href: "/partners/" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy policy", href: "/privacy-policy/" },
            { label: "Terms of use", href: "/terms/" },
            { label: "Accessibility", href: "/accessibility/" },
          ],
        },
      ],
      featured: {
        eyebrow: "Newsletter",
        heading: "The Dispatch",
        body: "One editorial brief every Tuesday. Rate movements, carrier news, and analysis worth your time. No paid placement.",
        cta: { label: "Subscribe", href: "/newsletter/" },
      },
    },
  },
];
