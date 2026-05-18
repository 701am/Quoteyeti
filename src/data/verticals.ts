/**
 * Single source of truth for verticals, navigation, and section metadata.
 * Add a new vertical = add an entry here. Header, footer, and section
 * pages all read from this file.
 */

export type VerticalKey =
  | "auto"
  | "home"
  | "life"
  | "business"
  | "health"
  | "renters"
  | "pet"
  | "travel";

export interface Vertical {
  key: VerticalKey;
  label: string;            // "Auto Insurance"
  short: string;            // "Auto"
  slug: string;             // "auto", "home-insurance", etc.
  path: string;             // "/auto/" — actual route prefix
  accent: string;           // tertiary accent color for this section
  accentSoft: string;       // tinted background variant
  icon: string;             // /assets/images/icons/*.svg
  heroYeti: string;         // /assets/images/yetis/*.png — large featured graphic
  tagline: string;          // shown in hero + footer CTA band
  description: string;      // 1–2 sentences for explore-grid cards
}

export const VERTICALS: Record<VerticalKey, Vertical> = {
  auto: {
    key: "auto",
    label: "Auto Insurance",
    short: "Auto",
    slug: "auto",
    path: "/auto/",
    accent: "#F46036",         // QuoteYeti orange — keeps brand signature
    accentSoft: "#FCF0EF",
    icon: "/assets/images/icons/auto.svg",
    heroYeti: "/assets/images/yetis/yeti-auto.png",
    tagline: "Your coverage, simplified.",
    description: "Compare car insurance rates from top insurers and find coverage that fits your budget and driving needs.",
  },
  home: {
    key: "home",
    label: "Home Insurance",
    short: "Home",
    slug: "home-insurance",
    path: "/home-insurance/",
    accent: "#8FB339",         // sage green — warmth, hearth
    accentSoft: "#F1F6E5",
    icon: "/assets/images/icons/home.svg",
    heroYeti: "/assets/images/yetis/yeti-home.png",
    tagline: "Protect what matters most.",
    description: "Discover which insurers offer the best rates in your area and what coverage your home needs.",
  },
  life: {
    key: "life",
    label: "Life Insurance",
    short: "Life",
    slug: "life-insurance",
    path: "/life-insurance/",
    accent: "#6B5B95",         // muted plum — gravitas, restraint
    accentSoft: "#EFEDF3",
    icon: "/assets/images/icons/life.svg",
    heroYeti: "/assets/images/yetis/yeti-life.png",
    tagline: "Coverage for the people who count on you.",
    description: "Compare term and whole life policies to find affordable protection for your family's future.",
  },
  business: {
    key: "business",
    label: "Business Insurance",
    short: "Business",
    slug: "business-insurance",
    path: "/business-insurance/",
    accent: "#2E5266",         // slate blue — steady, professional
    accentSoft: "#E8EEF1",
    icon: "/assets/images/icons/business.svg",
    heroYeti: "/assets/images/yeti-hero.svg",
    tagline: "The right coverage for the work you do.",
    description: "Protect your business with the right coverage at competitive rates from trusted insurers.",
  },
  health: {
    key: "health",
    label: "Health Insurance",
    short: "Health",
    slug: "health-insurance",
    path: "/health-insurance/",
    accent: "#14A38B",         // teal — clinical but calm
    accentSoft: "#E3F4F0",
    icon: "/assets/images/icons/health.svg",
    heroYeti: "/assets/images/yetis/yeti-health.png",
    tagline: "Care that fits your life.",
    description: "Compare plans, understand your options, and find coverage that fits your healthcare needs and budget.",
  },
  renters: {
    key: "renters",
    label: "Renters Insurance",
    short: "Renters",
    slug: "renters-insurance",
    path: "/renters-insurance/",
    accent: "#E8A87C",         // peach — lightness, affordability
    accentSoft: "#FBF1E9",
    icon: "/assets/images/icons/renters.svg",
    heroYeti: "/assets/images/yeti-hero.svg",
    tagline: "Affordable protection for what you've got.",
    description: "Find budget-friendly protection for your belongings and learn which policy features matter most.",
  },
  pet: {
    key: "pet",
    label: "Pet Insurance",
    short: "Pet",
    slug: "pet-insurance",
    path: "/pet-insurance/",
    accent: "#C06C84",         // dusty rose — warmth, personality
    accentSoft: "#F5E8ED",
    icon: "/assets/images/icons/pet.svg",
    heroYeti: "/assets/images/yetis/yeti-pet.png",
    tagline: "Because they're family too.",
    description: "Learn about the best affordable plans that cover accidents, illnesses, and routine care for your pet.",
  },
  travel: {
    key: "travel",
    label: "Travel Insurance",
    short: "Travel",
    slug: "travel-insurance",
    path: "/travel-insurance/",
    accent: "#355C7D",         // horizon blue — movement, distance
    accentSoft: "#E5EBF1",
    icon: "/assets/images/icons/travel.svg",
    heroYeti: "/assets/images/yetis/yeti-travel.png",
    tagline: "Cover the unexpected, wherever you go.",
    description: "Find affordable plans that cover trip cancellations, medical costs, and travel delays.",
  },
};

export const VERTICAL_LIST: Vertical[] = Object.values(VERTICALS);

/**
 * Resolve the current vertical from a URL pathname.
 * Used by BaseLayout to set the section context for footer + hero accents.
 */
export function detectVertical(pathname: string): Vertical | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  const first = segments[0];
  return VERTICAL_LIST.find((v) => v.slug === first) ?? null;
}
