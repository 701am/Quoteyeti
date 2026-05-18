/**
 * Per-vertical partner offers shown on /quotes/thanks/ pages.
 *
 * These are MOCK offer cards designed to look like real MediaAlpha /
 * Money.com units. Real carrier names are used because that's what
 * publisher networks ship — but the offers themselves are placeholders
 * and route to /go/<partner-id>/ which is a controllable redirect.
 *
 * IMPORTANT — when wiring real partners:
 *   1. Each offer has a `partnerId` that matches a row in /go/[id]
 *   2. Real CPCs and ranking come from the publisher (MediaAlpha, etc.)
 *   3. Rate ranges shown here are generic and marked "Sample rates"
 *   4. FTC disclosure is rendered above all offer grids
 */

import type { VerticalKey } from "~/data/verticals";

export interface PartnerOffer {
  /** Stable ID — used in the click-out URL /go/<partnerId>/ */
  partnerId: string;
  /** Display name (real carrier name OK — this is the publisher pattern) */
  name: string;
  /** Single-line product description */
  headline: string;
  /** 2-3 short bullets that show on the card */
  bullets: string[];
  /** "Starting at" rate display — generic range, not personalized */
  ratePrefix?: string;     // e.g. "From"
  ratePrice?: string;      // e.g. "$29/mo"
  /** Badge — "Top rated", "Editor's pick", "Best for…" */
  badge?: string;
  /** Where to send users when they click. Defaults to /go/<partnerId>/. */
  clickoutPath?: string;
}

export interface VerticalOffers {
  /** Top 4 offers — shown above the fold in the primary grid */
  primary: PartnerOffer[];
  /** 3 more offers under "Also interested in" */
  secondary: PartnerOffer[];
}

// ============================================
// AUTO
// ============================================
const autoOffers: VerticalOffers = {
  primary: [
    {
      partnerId: "geico",
      name: "GEICO",
      headline: "15-minute switch · save up to $500/yr",
      bullets: [
        "Multi-policy & safe-driver discounts",
        "24/7 claims service nationwide",
        "Mobile app rated #1 for ease",
      ],
      badge: "Top rated",
      ratePrefix: "From",
      ratePrice: "$42/mo",
    },
    {
      partnerId: "progressive",
      name: "Progressive",
      headline: "Name your price · usage-based options",
      bullets: [
        "Snapshot® program for safe drivers",
        "Bundle with home for additional savings",
        "AM Best rated A+ for financial strength",
      ],
      ratePrefix: "From",
      ratePrice: "$54/mo",
    },
    {
      partnerId: "state-farm",
      name: "State Farm",
      headline: "Local agents · personalized service",
      bullets: [
        "Drive Safe & Save™ telematics program",
        "Largest agent network in the US",
        "Strong J.D. Power customer satisfaction",
      ],
      badge: "Best service",
      ratePrefix: "From",
      ratePrice: "$58/mo",
    },
    {
      partnerId: "liberty-mutual",
      name: "Liberty Mutual",
      headline: "Customize coverage to your needs",
      bullets: [
        "RightTrack® usage-based discount",
        "Accident forgiveness available",
        "Cover only what you need with a la carte options",
      ],
      ratePrefix: "From",
      ratePrice: "$61/mo",
    },
  ],
  secondary: [
    {
      partnerId: "allstate",
      name: "Allstate",
      headline: "Drivewise® · safe driving rewards",
      bullets: ["Safe driving bonus checks every 6 months", "Accident forgiveness on first claim"],
      ratePrefix: "From",
      ratePrice: "$67/mo",
    },
    {
      partnerId: "nationwide",
      name: "Nationwide",
      headline: "SmartRide® · cash back for safe driving",
      bullets: ["On Your Side® claims service", "Vanishing deductible after years of safe driving"],
      ratePrefix: "From",
      ratePrice: "$69/mo",
    },
    {
      partnerId: "farmers",
      name: "Farmers",
      headline: "Signal® app · personalized rate review",
      bullets: ["Multi-policy bundling discounts", "Smart drivers earn lower premiums"],
      ratePrefix: "From",
      ratePrice: "$72/mo",
    },
  ],
};

// ============================================
// HOME
// ============================================
const homeOffers: VerticalOffers = {
  primary: [
    {
      partnerId: "lemonade",
      name: "Lemonade",
      headline: "Instant policy · A.I.-powered claims",
      bullets: [
        "Get a quote in 90 seconds",
        "Claims paid in as little as 3 minutes",
        "Giveback program donates unused premiums",
      ],
      badge: "Editor's pick",
      ratePrefix: "From",
      ratePrice: "$25/mo",
    },
    {
      partnerId: "amica",
      name: "Amica",
      headline: "Highest customer satisfaction · dividend policies",
      bullets: [
        "Highest J.D. Power home insurance rating in 2024",
        "Dividend policies return premium based on performance",
        "Comprehensive coverage with strong customer service",
      ],
      badge: "Best service",
      ratePrefix: "From",
      ratePrice: "$87/mo",
    },
    {
      partnerId: "state-farm",
      name: "State Farm",
      headline: "Bundle home & auto · agent-supported",
      bullets: [
        "Multi-policy bundle discounts up to 17%",
        "Personal Articles Policy for high-value items",
        "Largest insurer with local-agent access",
      ],
      ratePrefix: "From",
      ratePrice: "$94/mo",
    },
    {
      partnerId: "allstate",
      name: "Allstate",
      headline: "Claim RateGuard® · rates stay steady",
      bullets: [
        "Rates won't go up after your first claim",
        "Discounts for new buyers and bundled policies",
        "HostAdvantage® for short-term rental hosts",
      ],
      ratePrefix: "From",
      ratePrice: "$102/mo",
    },
  ],
  secondary: [
    {
      partnerId: "progressive",
      name: "Progressive Home",
      headline: "Bundle with auto · multi-product savings",
      bullets: ["Underwritten by HomeWise & ASI", "HomeQuote Explorer® comparison tool"],
      ratePrefix: "From",
      ratePrice: "$96/mo",
    },
    {
      partnerId: "usaa",
      name: "USAA",
      headline: "For military families · top-tier ratings",
      bullets: ["Members only — military, veterans, and families", "Highest J.D. Power overall satisfaction"],
      ratePrefix: "From",
      ratePrice: "$78/mo",
    },
    {
      partnerId: "travelers",
      name: "Travelers",
      headline: "Multi-layered coverage · green-home credit",
      bullets: ["Eco-friendly rebuild option", "Identity fraud expense coverage"],
      ratePrefix: "From",
      ratePrice: "$98/mo",
    },
  ],
};

// ============================================
// LIFE
// ============================================
const lifeOffers: VerticalOffers = {
  primary: [
    {
      partnerId: "haven-life",
      name: "Haven Life",
      headline: "Online underwriting · backed by MassMutual",
      bullets: [
        "Apply in minutes, get a decision online",
        "Up to $3M coverage, terms 10–30 years",
        "Backed by MassMutual (A++ AM Best rated)",
      ],
      badge: "Editor's pick",
      ratePrefix: "From",
      ratePrice: "$15/mo",
    },
    {
      partnerId: "ladder",
      name: "Ladder",
      headline: "Term life that adjusts with you",
      bullets: [
        "Increase or decrease coverage anytime",
        "Up to $8M term coverage online",
        "No medical exam for many applicants",
      ],
      ratePrefix: "From",
      ratePrice: "$11/mo",
    },
    {
      partnerId: "ethos",
      name: "Ethos",
      headline: "No medical exam for most applicants",
      bullets: [
        "10–30 year term policies online",
        "Many applicants skip the medical exam",
        "Up to $1.5M coverage instantly approved",
      ],
      badge: "Fastest approval",
      ratePrefix: "From",
      ratePrice: "$13/mo",
    },
    {
      partnerId: "policygenius",
      name: "Policygenius",
      headline: "Compare quotes from 20+ top carriers",
      bullets: [
        "Independent broker — no carrier bias",
        "Licensed agents help you shop",
        "Compare term, whole, and universal life",
      ],
      ratePrefix: "From",
      ratePrice: "$10/mo",
    },
  ],
  secondary: [
    {
      partnerId: "banner-life",
      name: "Banner Life",
      headline: "Term & universal life · 30-year terms",
      bullets: ["Subsidiary of Legal & General America", "Competitive rates for healthy applicants"],
      ratePrefix: "From",
      ratePrice: "$12/mo",
    },
    {
      partnerId: "fabric",
      name: "Fabric by Gerber Life",
      headline: "Built for parents · simple online application",
      bullets: ["Free will & beneficiary tools included", "10/15/20-year term coverage"],
      ratePrefix: "From",
      ratePrice: "$14/mo",
    },
    {
      partnerId: "bestow",
      name: "Bestow",
      headline: "100% online · no medical exam",
      bullets: ["10–30 year term, $50K–$1.5M coverage", "Decision in minutes for most applicants"],
      ratePrefix: "From",
      ratePrice: "$16/mo",
    },
  ],
};

// ============================================
// BUSINESS
// ============================================
const businessOffers: VerticalOffers = {
  primary: [
    {
      partnerId: "next-insurance",
      name: "Next Insurance",
      headline: "Built for small business · instant certificate of insurance",
      bullets: [
        "Quote, buy, and get COIs in minutes",
        "General liability, professional, workers' comp",
        "Live chat with licensed agents",
      ],
      badge: "Editor's pick",
      ratePrefix: "From",
      ratePrice: "$25/mo",
    },
    {
      partnerId: "hiscox",
      name: "Hiscox",
      headline: "Professional liability for service businesses",
      bullets: [
        "Specialized in small business & professional services",
        "Instant online quote and bind",
        "A.M. Best rated A (Excellent)",
      ],
      ratePrefix: "From",
      ratePrice: "$22/mo",
    },
    {
      partnerId: "thimble",
      name: "Thimble",
      headline: "By the hour, day, or month",
      bullets: [
        "On-demand coverage for short-term needs",
        "Cancel anytime, free COIs included",
        "Perfect for contractors and event-based work",
      ],
      badge: "Most flexible",
      ratePrefix: "From",
      ratePrice: "$17/mo",
    },
    {
      partnerId: "the-hartford",
      name: "The Hartford",
      headline: "Comprehensive small business packages",
      bullets: [
        "BOP, workers' comp, commercial auto",
        "AARP-endorsed for many policy types",
        "200+ years insuring small businesses",
      ],
      ratePrefix: "From",
      ratePrice: "$54/mo",
    },
  ],
  secondary: [
    {
      partnerId: "biberk",
      name: "biBERK",
      headline: "Berkshire Hathaway · direct, no broker fees",
      bullets: ["Backed by Berkshire Hathaway", "Direct savings — no broker commissions"],
      ratePrefix: "From",
      ratePrice: "$28/mo",
    },
    {
      partnerId: "coverwallet",
      name: "CoverWallet",
      headline: "Compare multiple top carriers in one place",
      bullets: ["Aetna-owned broker platform", "All policies managed in one dashboard"],
      ratePrefix: "From",
      ratePrice: "$32/mo",
    },
    {
      partnerId: "simply-business",
      name: "Simply Business",
      headline: "Compare quotes from top US insurers",
      bullets: ["UK-founded, US-focused for SMBs", "Bilingual licensed agents available"],
      ratePrefix: "From",
      ratePrice: "$26/mo",
    },
  ],
};

// ============================================
// HEALTH
// ============================================
const healthOffers: VerticalOffers = {
  primary: [
    {
      partnerId: "ehealth",
      name: "eHealth",
      headline: "Compare ACA, Medicare, & private plans",
      bullets: [
        "Compare 13,000+ plans from 180+ insurers",
        "Licensed agents help you enroll",
        "Free quotes, no obligation",
      ],
      badge: "Most plans",
      ratePrefix: "From",
      ratePrice: "$95/mo",
    },
    {
      partnerId: "oscar",
      name: "Oscar Health",
      headline: "Tech-first health insurance · ACA marketplace",
      bullets: [
        "Concierge care team via app",
        "$0 virtual urgent care for members",
        "Available in many state marketplaces",
      ],
      badge: "Best app",
      ratePrefix: "From",
      ratePrice: "$215/mo",
    },
    {
      partnerId: "blue-cross-blue-shield",
      name: "Blue Cross Blue Shield",
      headline: "Largest provider network · nationwide",
      bullets: [
        "Largest provider network in the US",
        "BlueCard® coverage when traveling",
        "Strong J.D. Power member satisfaction",
      ],
      ratePrefix: "From",
      ratePrice: "$245/mo",
    },
    {
      partnerId: "united-healthcare",
      name: "UnitedHealthcare",
      headline: "Comprehensive plans · wellness rewards",
      bullets: [
        "$1.3T paid in claims annually",
        "Rally® wellness rewards program",
        "Major employer & marketplace plans",
      ],
      ratePrefix: "From",
      ratePrice: "$232/mo",
    },
  ],
  secondary: [
    {
      partnerId: "aetna",
      name: "Aetna",
      headline: "CVS-affiliated · MinuteClinic access",
      bullets: ["Discounts at CVS HealthHUB locations", "Strong national provider network"],
      ratePrefix: "From",
      ratePrice: "$228/mo",
    },
    {
      partnerId: "cigna",
      name: "Cigna",
      headline: "Mental health benefits · global coverage",
      bullets: ["Strong behavioral health network", "Global plans for expats and travelers"],
      ratePrefix: "From",
      ratePrice: "$219/mo",
    },
    {
      partnerId: "humana",
      name: "Humana",
      headline: "Medicare Advantage leader · senior focus",
      bullets: ["Top-rated Medicare Advantage plans", "Wellness rewards via Go365®"],
      ratePrefix: "From",
      ratePrice: "$0/mo*",
    },
  ],
};

// ============================================
// RENTERS
// ============================================
const rentersOffers: VerticalOffers = {
  primary: [
    {
      partnerId: "lemonade",
      name: "Lemonade",
      headline: "Renters insurance in 90 seconds",
      bullets: [
        "Quote and bind in under 2 minutes",
        "AI-driven claims, often paid instantly",
        "Giveback program supports community causes",
      ],
      badge: "Fastest signup",
      ratePrefix: "From",
      ratePrice: "$5/mo",
    },
    {
      partnerId: "state-farm",
      name: "State Farm",
      headline: "Bundle with auto · agent-supported",
      bullets: [
        "Up to 17% savings when bundled with auto",
        "Local agents in all 50 states",
        "Personal property replacement cost option",
      ],
      ratePrefix: "From",
      ratePrice: "$11/mo",
    },
    {
      partnerId: "geico",
      name: "GEICO",
      headline: "Cheap rates · easy mobile management",
      bullets: [
        "Among the lowest renters rates nationally",
        "Multi-policy auto+renters discount",
        "Manage everything in the GEICO mobile app",
      ],
      badge: "Lowest rates",
      ratePrefix: "From",
      ratePrice: "$8/mo",
    },
    {
      partnerId: "allstate",
      name: "Allstate",
      headline: "Standard coverage · agent network",
      bullets: [
        "Multi-policy discounts available",
        "Coverage for personal property, liability, additional living expense",
        "Strong claims handling reputation",
      ],
      ratePrefix: "From",
      ratePrice: "$13/mo",
    },
  ],
  secondary: [
    {
      partnerId: "toggle",
      name: "Toggle by Farmers",
      headline: "Pay only for what you need",
      bullets: ["Skip coverages that don't apply", "Built-in identity theft protection"],
      ratePrefix: "From",
      ratePrice: "$5/mo",
    },
    {
      partnerId: "progressive",
      name: "Progressive",
      headline: "Easy bundle with auto · simple online quote",
      bullets: ["HomeQuote Explorer® comparison tool", "Underwritten by ASI"],
      ratePrefix: "From",
      ratePrice: "$10/mo",
    },
    {
      partnerId: "assurant",
      name: "Assurant",
      headline: "Renters-only specialist · property-manager partnerships",
      bullets: ["Specializes in renters insurance", "Often integrated with apartment leases"],
      ratePrefix: "From",
      ratePrice: "$12/mo",
    },
  ],
};

// ============================================
// PET
// ============================================
const petOffers: VerticalOffers = {
  primary: [
    {
      partnerId: "lemonade",
      name: "Lemonade Pet",
      headline: "Fast claims · transparent pricing",
      bullets: [
        "Claims paid in as little as 2 seconds",
        "Customize deductibles and reimbursement levels",
        "No annual cap on most plans",
      ],
      badge: "Fastest claims",
      ratePrefix: "From",
      ratePrice: "$10/mo",
    },
    {
      partnerId: "healthy-paws",
      name: "Healthy Paws",
      headline: "No caps · unlimited annual benefits",
      bullets: [
        "No maximum payouts per incident, year, or lifetime",
        "Covers hereditary and congenital conditions",
        "Award-winning customer service",
      ],
      badge: "Best for chronic conditions",
      ratePrefix: "From",
      ratePrice: "$24/mo",
    },
    {
      partnerId: "trupanion",
      name: "Trupanion",
      headline: "Pays your vet directly · no waiting for reimbursement",
      bullets: [
        "Pays participating vets directly at checkout",
        "Covers 90% of eligible costs",
        "No per-incident or annual payout limits",
      ],
      ratePrefix: "From",
      ratePrice: "$32/mo",
    },
    {
      partnerId: "spot",
      name: "Spot Pet Insurance",
      headline: "Customizable plans · wellness add-ons",
      bullets: [
        "Endorsed by Cesar Millan",
        "Optional Wellness Rider for routine care",
        "Covers exam fees (not always standard)",
      ],
      ratePrefix: "From",
      ratePrice: "$17/mo",
    },
  ],
  secondary: [
    {
      partnerId: "embrace",
      name: "Embrace",
      headline: "Diminishing deductible · accident-only option",
      bullets: ["Deductible decreases each claim-free year", "10% multi-pet discount"],
      ratePrefix: "From",
      ratePrice: "$19/mo",
    },
    {
      partnerId: "figo",
      name: "Figo",
      headline: "Cloud-based dashboard · vet finder",
      bullets: ["Pet Cloud app for records and care", "100% reimbursement option available"],
      ratePrefix: "From",
      ratePrice: "$21/mo",
    },
    {
      partnerId: "pets-best",
      name: "Pets Best",
      headline: "Flexible plans · founded by a vet",
      bullets: ["Founded by a veterinarian in 2005", "Direct vet pay available"],
      ratePrefix: "From",
      ratePrice: "$15/mo",
    },
  ],
};

// ============================================
// TRAVEL
// ============================================
const travelOffers: VerticalOffers = {
  primary: [
    {
      partnerId: "travelex",
      name: "Travelex Insurance",
      headline: "Trip cancellation · 24/7 travel assist",
      bullets: [
        "Trip Select & Trip Basic plans",
        "Optional Cancel For Any Reason upgrade",
        "Kids included free on some plans",
      ],
      badge: "Family pick",
      ratePrefix: "From",
      ratePrice: "$32/trip",
    },
    {
      partnerId: "world-nomads",
      name: "World Nomads",
      headline: "Adventure-friendly · 200+ activities covered",
      bullets: [
        "Covers high-risk adventure activities",
        "Trusted by Lonely Planet & Rough Guides",
        "Extend coverage while abroad",
      ],
      badge: "Best for adventure",
      ratePrefix: "From",
      ratePrice: "$45/trip",
    },
    {
      partnerId: "allianz",
      name: "Allianz Travel",
      headline: "Global brand · 24/7 emergency assistance",
      bullets: [
        "One of the largest travel insurers worldwide",
        "Annual multi-trip plans available",
        "AllyzTravel® mobile app for emergencies",
      ],
      ratePrefix: "From",
      ratePrice: "$28/trip",
    },
    {
      partnerId: "imglobal",
      name: "IMG",
      headline: "Strong medical coverage · international focus",
      bullets: [
        "Specialty plans for expats, students, missionaries",
        "Generous medical evacuation coverage",
        "Multi-trip and long-stay options",
      ],
      ratePrefix: "From",
      ratePrice: "$38/trip",
    },
  ],
  secondary: [
    {
      partnerId: "seven-corners",
      name: "Seven Corners",
      headline: "Tiered plans · choose your coverage level",
      bullets: ["RoundTrip Choice for leisure travel", "Strong cruise-specific options"],
      ratePrefix: "From",
      ratePrice: "$34/trip",
    },
    {
      partnerId: "generali",
      name: "Generali Global Assistance",
      headline: "Bundled travel insurance · airline integrations",
      bullets: ["Trusted by major airlines and cruises", "Comprehensive medical benefits"],
      ratePrefix: "From",
      ratePrice: "$31/trip",
    },
    {
      partnerId: "tin-leg",
      name: "Tin Leg",
      headline: "Wide plan menu · price-comparable options",
      bullets: ["8 plan tiers for different traveler needs", "Pre-existing condition waivers available"],
      ratePrefix: "From",
      ratePrice: "$29/trip",
    },
  ],
};

// ============================================
// Public registry
// ============================================
export const OFFERS: Record<VerticalKey, VerticalOffers> = {
  auto: autoOffers,
  home: homeOffers,
  life: lifeOffers,
  business: businessOffers,
  health: healthOffers,
  renters: rentersOffers,
  pet: petOffers,
  travel: travelOffers,
};
