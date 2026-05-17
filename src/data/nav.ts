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
          { label: `${shortName} insurance by state`, href: `${basePath}by-state/` },
        ],
      },
      {
        title: "Calculators & Tools",
        links: [
          { label: `${shortName} insurance calculator`, href: `${basePath}calculator/` },
          { label: "How much do I need?", href: `${basePath}how-much-do-i-need/` },
          { label: "Coverage estimator", href: `${basePath}coverage-estimator/` },
        ],
      },
      {
        title: "Coverage 101",
        links: [
          { label: "How it works", href: `${basePath}how-it-works/` },
          { label: "Types of coverage", href: `${basePath}coverage-types/` },
          { label: "Common discounts", href: `${basePath}discounts/` },
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
      heading: "Find your rate in 60 seconds",
      body: "Drop your ZIP and we'll pull live quotes from top carriers — the way QuoteYeti has always worked.",
      cta: { label: "Get auto quotes", href: "/auto/quotes/" },
      image: "/assets/images/yeti-hero.svg",
    }),
  },
  {
    label: "Home",
    verticalKey: "home",
    panel: panel("home", "/home-insurance/", "Home", {
      eyebrow: "New",
      heading: "Protect what matters most",
      body: "Compare home insurance rates from the carriers that actually cover your area.",
      cta: { label: "Get home quotes", href: "/home-insurance/quotes/" },
      image: "/assets/images/yeti-hero.svg",
    }),
  },
  {
    label: "Life",
    verticalKey: "life",
    panel: panel("life", "/life-insurance/", "Life", {
      eyebrow: "New",
      heading: "Coverage for the people who count on you",
      body: "Term, whole, and universal life — compare rates without the sales call.",
      cta: { label: "Get life quotes", href: "/life-insurance/quotes/" },
      image: "/assets/images/yeti-hero.svg",
    }),
  },
  {
    label: "Business",
    verticalKey: "business",
    panel: panel("business", "/business-insurance/", "Business", {
      eyebrow: "New",
      heading: "Insurance for the work you do",
      body: "General liability, workers' comp, professional indemnity — coverage tailored to your business.",
      cta: { label: "Get business quotes", href: "/business-insurance/quotes/" },
      image: "/assets/images/yeti-hero.svg",
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
            { label: "Medicare plans", href: "/health-insurance/medicare/" },
            { label: "ACA marketplace", href: "/health-insurance/aca/" },
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
          title: "Tools across categories",
          links: [
            { label: "All calculators", href: "/calculators/" },
            { label: "Best by state", href: "/best-by-state/" },
            { label: "Compare any two carriers", href: "/compare/" },
          ],
        },
      ],
      featured: {
        eyebrow: "Explore",
        heading: "Eight verticals, one Yeti",
        body: "We help you compare every kind of insurance — from your car to your cat.",
        cta: { label: "See all insurance types", href: "/insurance/" },
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
            { label: "Insurance statistics", href: "/resources/statistics/" },
            { label: "The Dispatch (blog)", href: "/blog/" },
          ],
        },
        {
          title: "Calculate",
          links: [
            { label: "Auto calculator", href: "/auto/calculator/" },
            { label: "Home calculator", href: "/home-insurance/calculator/" },
            { label: "Life calculator", href: "/life-insurance/calculator/" },
            { label: "All calculators", href: "/calculators/" },
          ],
        },
        {
          title: "Compare",
          links: [
            { label: "Best by state", href: "/best-by-state/" },
            { label: "Company vs. company", href: "/compare/" },
            { label: "Reviews index", href: "/auto/reviews/" },
          ],
        },
      ],
      featured: {
        eyebrow: "Tools",
        heading: "Try the calculator that started it all",
        body: "Estimate your auto rate in under a minute, no email required.",
        cta: { label: "Open auto calculator", href: "/auto/calculator/" },
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
        heading: "The YetiLetter",
        body: "Hot takes on insurance and money, delivered weekly. No spam, just the good stuff.",
        cta: { label: "Subscribe", href: "/newsletter/" },
      },
    },
  },
];
