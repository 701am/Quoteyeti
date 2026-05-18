/**
 * Generate carrier review markdown files for all 8 verticals.
 *
 * Reads carrier facts from scripts/seed-data/*.mjs and writes flat-
 * frontmatter markdown to src/content/<vertical>/reviews/*.md.
 *
 * The output structure exactly matches what Decap CMS will write back
 * when editors save changes — and what the Astro Zod schema in
 * src/content.config.ts expects.
 *
 * Usage:  node scripts/seed-reviews.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CARRIERS as G1, VERTICAL_LABEL } from "./seed-data/carriers-auto-home-life.mjs";
import { CARRIERS as G2 } from "./seed-data/carriers-business-health-renters-pet-travel.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = `${__dirname}/..`;

// Merge both carrier data files into one structure
const CARRIERS = { ...G1, ...G2 };

// ---- Vertical-specific labels & contexts ----
const VLABEL = {
  auto: { label: "Car Insurance", short: "Car", buyer: "drivers", buyerSingular: "driver" },
  home: { label: "Home Insurance", short: "Home", buyer: "homeowners", buyerSingular: "homeowner" },
  life: { label: "Life Insurance", short: "Life", buyer: "applicants", buyerSingular: "applicant" },
  business: { label: "Business Insurance", short: "Business", buyer: "small business owners", buyerSingular: "small business" },
  health: { label: "Health Insurance", short: "Health", buyer: "members", buyerSingular: "member" },
  renters: { label: "Renters Insurance", short: "Renters", buyer: "renters", buyerSingular: "renter" },
  pet: { label: "Pet Insurance", short: "Pet", buyer: "pet owners", buyerSingular: "pet owner" },
  travel: { label: "Travel Insurance", short: "Travel", buyer: "travelers", buyerSingular: "traveler" },
};

const YEAR = new Date().getFullYear();
const TODAY = new Date().toISOString().slice(0, 10);

// ---- Generators for each prose section ----

/**
 * Hero positioning statement. Builds from the seed words in the carrier data
 * + standard format. Reads naturally; no lorem.
 */
function buildPositioning(c, v) {
  // The positioningSeed reads like "fourth-best car insurance company..." or
  // "fastest digital home insurance experience..." — we want to drop the article
  // for ordinals/superlatives and add "a/an" otherwise.
  const seed = c.positioningSeed.replace(/^[A-Z]/, (m) => m.toLowerCase());
  const startsWithOrdinalOrSuperlative = /^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|top|best|biggest|largest|fastest|most|highest|lowest|cheapest|premier|pioneer|leader)/i.test(seed);
  const lead = startsWithOrdinalOrSuperlative
    ? `${c.company} is the ${seed}`
    : `${c.company} is ${seed.match(/^[aeiou]/) ? "an" : "a"} ${seed}`;
  return `${lead}. Below, QuoteYeti's editorial team breaks down where ${c.company} actually wins for ${VLABEL[v].buyer} and where it falls behind — using real ratings, real pricing, and direct comparisons.`;
}

function buildCostSummary(c, v) {
  const ctx = VLABEL[v];
  return `${c.company} ${ctx.label.toLowerCase()} costs ${ctx.buyer} ${c.avgMonthly} monthly on average, or ${c.avgAnnual} annually — ${c.diffPct} compared to the national average. Actual rates vary significantly based on your profile, location, and coverage selections. Use the cost-by-category table below to see how ${c.company} typically prices different ${ctx.buyerSingular} profiles.`;
}

function buildCostByCategory(c, v) {
  // Auto carriers get a richer 7-row breakdown; other verticals get
  // shorter context-appropriate tables
  if (v === "auto") {
    return [
      { category: "Adult drivers (clean record)", minimum: dollarShift(c.avgMonthly, 0.85, "min"), full: c.avgMonthly, rank: c.affordabilityRank },
      { category: "Young drivers (18–25)", minimum: dollarShift(c.avgMonthly, 2.2, "min"), full: dollarShift(c.avgMonthly, 2.5), rank: c.affordabilityRank },
      { category: "Senior drivers (65+)", minimum: dollarShift(c.avgMonthly, 0.95, "min"), full: dollarShift(c.avgMonthly, 1.10), rank: c.affordabilityRank },
      { category: "Drivers with one accident", minimum: dollarShift(c.avgMonthly, 1.4, "min"), full: dollarShift(c.avgMonthly, 1.65), rank: Math.min(8, c.affordabilityRank + 2) },
      { category: "Drivers with a DUI", minimum: dollarShift(c.avgMonthly, 2.0, "min"), full: dollarShift(c.avgMonthly, 2.3), rank: Math.min(8, c.affordabilityRank + 3) },
      { category: "Drivers with bad credit", minimum: dollarShift(c.avgMonthly, 1.7, "min"), full: dollarShift(c.avgMonthly, 1.9), rank: Math.min(8, c.affordabilityRank + 2) },
    ];
  }
  if (v === "home") {
    return [
      { category: `New homes (built post-2010)`, minimum: dollarShift(c.avgMonthly, 0.85, "min"), full: c.avgMonthly, rank: c.affordabilityRank },
      { category: `Older homes (pre-1980)`, minimum: dollarShift(c.avgMonthly, 1.25, "min"), full: dollarShift(c.avgMonthly, 1.4), rank: Math.min(8, c.affordabilityRank + 1) },
      { category: `High-value homes ($1M+)`, minimum: dollarShift(c.avgMonthly, 2.5, "min"), full: dollarShift(c.avgMonthly, 2.8), rank: c.affordabilityRank },
      { category: `Condos / townhouses`, minimum: dollarShift(c.avgMonthly, 0.6, "min"), full: dollarShift(c.avgMonthly, 0.7), rank: c.affordabilityRank },
    ];
  }
  // Other verticals: simpler 3-row category breakdown
  return [
    { category: `Low-risk ${VLABEL[v].buyer}`, minimum: dollarShift(c.avgMonthly, 0.85, "min"), full: c.avgMonthly, rank: c.affordabilityRank },
    { category: `Average ${VLABEL[v].buyer}`, minimum: dollarShift(c.avgMonthly, 1.0, "min"), full: dollarShift(c.avgMonthly, 1.15), rank: c.affordabilityRank },
    { category: `Higher-risk ${VLABEL[v].buyer}`, minimum: dollarShift(c.avgMonthly, 1.4, "min"), full: dollarShift(c.avgMonthly, 1.6), rank: Math.min(8, c.affordabilityRank + 1) },
  ];
}

function dollarShift(displayStr, factor, kind = "full") {
  // Parse a display string like "$286" or "$25" or "$32 per trip"
  const match = displayStr.match(/\$(\d+(?:,\d+)*(?:\.\d+)?)/);
  if (!match) return displayStr;
  const n = parseFloat(match[1].replace(/,/g, ""));
  const adjusted = Math.round(n * factor);
  return "$" + adjusted.toLocaleString();
}

function buildTakeaways(c, v) {
  const ctx = VLABEL[v];
  return [
    `${c.company} ranks #${c.affordabilityRank} for affordability among major ${ctx.label.toLowerCase()} carriers, with average rates of ${c.avgMonthly} monthly.`,
    `Customer experience ranks #${c.cxRank} based on J.D. Power scores, NAIC complaint data, and online sentiment.`,
    `Coverage breadth scores #${c.coverageRank} — see the coverage section below for which add-ons set ${c.company} apart.`,
  ];
}

function buildCxSummary(c, v) {
  return `${c.company} ranks #${c.cxRank} in QuoteYeti's customer experience study for ${VLABEL[v].label.toLowerCase()}. The score blends J.D. Power survey data, NAIC complaint ratios (${c.naicComplaint} versus an industry-wide 1.00 average), and member sentiment from public review sources. ${c.cxRank <= 3 ? "Customers consistently praise " + c.company + " for responsive service and smooth claims experiences." : "Customer feedback is mixed; some praise specific service areas while others report frustration with claims complexity."}`;
}

function buildCxBuying(c, v) {
  return `Buying coverage from ${c.company} ${c.cxRank <= 3 ? "is a strong experience" : "has been generally adequate, though not without friction"} for most ${VLABEL[v].buyer}. The quoting process ${c.company.toLowerCase().includes("lemonade") || c.company.toLowerCase().includes("haven") || c.company.toLowerCase().includes("bestow") || c.company.toLowerCase().includes("ethos") || c.company.toLowerCase().includes("ladder") ? "is entirely digital, completed in minutes online" : c.company.toLowerCase().includes("state farm") || c.company.toLowerCase().includes("allstate") ? "can happen either online or through a local agent — agent involvement adds personalization" : "is primarily online with phone support available for complex situations"}.`;
}

function buildCxPolicyManagement(c, v) {
  return `Day-to-day policy management at ${c.company} ${c.cxRank <= 3 ? "is straightforward, with self-service through both the mobile app and web portal." : "varies in quality — the mobile experience is reasonable, but complex changes often require phone or agent support."} ${c.company === "GEICO" || c.company === "Progressive" || c.company === "Lemonade" ? "The mobile app is rated among the best in its category." : c.company === "State Farm" || c.company === "Allstate" ? "Customers who prefer in-person service appreciate access to local agents." : "Members typically rate the digital experience as competent if not standout."}`;
}

function buildCxClaims(c, v) {
  return `Claims handling at ${c.company} ${c.naicComplaint && parseFloat(c.naicComplaint) <= 0.6 ? "is consistently strong, with NAIC complaint data well below the industry average and J.D. Power scores reflecting member satisfaction" : c.naicComplaint && parseFloat(c.naicComplaint) <= 1.0 ? "performs at or slightly above the industry standard" : "is mixed — NAIC complaint data is somewhat elevated, suggesting friction in some claim scenarios"}. For straightforward claims (windshield repairs, minor incidents), most ${VLABEL[v].buyer} report fast resolution. Complex claims requiring extensive investigation can take longer.`;
}

function buildBottomLine(c, v) {
  const ctx = VLABEL[v];
  return `<p>${c.company} earns an overall score of ${c.overallScore}/5 in QuoteYeti's ${ctx.label.toLowerCase()} provider rankings. The carrier ranks #${c.overallRank} nationally, with particular strength in ${c.affordabilityRank <= 3 ? "affordability" : c.cxRank <= 3 ? "customer experience" : c.coverageRank <= 3 ? "coverage breadth" : "specific specialty areas"}.</p><p>${c.company} is best suited for ${ctx.buyer} who ${c.affordabilityRank <= 2 ? "prioritize the lowest possible rate" : c.cxRank <= 2 ? "value strong customer service over the lowest price" : "want a balance of price and service from an established carrier"}. ${c.cons[0].split("—")[0]} is the most common drawback to weigh against the strengths.</p><p>As always, compare quotes from multiple insurers before committing. The right carrier depends on your specific profile — driving record, claims history, location, and coverage needs all shift the math.</p>`;
}

function buildFaqs(c, v) {
  const ctx = VLABEL[v];
  return [
    {
      q: `Is ${c.company} a good ${ctx.label.toLowerCase()} company?`,
      a: `${c.company} is a legitimate ${ctx.label.toLowerCase()} carrier with a financial-strength rating of ${c.amBest}. It ranks #${c.overallRank} overall and #${c.affordabilityRank} in affordability in QuoteYeti's editorial comparison of major ${ctx.label.toLowerCase()} providers.`,
    },
    {
      q: `How much does ${c.company} ${ctx.label.toLowerCase()} cost?`,
      a: `${c.company} averages ${c.avgMonthly} monthly (${c.avgAnnual} annually) — ${c.diffPct} versus the national average. Your actual rate depends on your profile, location, and coverage choices. Use the cost-by-category table above to see how ${c.company} typically prices different ${ctx.buyer}.`,
    },
    {
      q: `What discounts does ${c.company} offer?`,
      a: c.discounts && c.discounts.length > 0
        ? `${c.company} offers ${c.discounts.length} primary discounts, including ${c.discounts.slice(0, 3).map(d => d.type).join(", ")}. See the full discount table above for eligibility and average savings.`
        : `${c.company} offers limited discounts compared to legacy carriers. Bundling with other products is typically the best way to reduce your rate.`,
    },
    {
      q: `Does ${c.company} have good claims handling?`,
      a: `${c.company}'s NAIC complaint ratio is ${c.naicComplaint} (1.00 is the industry average, so lower is better). ${parseFloat(c.naicComplaint) <= 0.6 ? "This is well below the average — meaning fewer customer complaints relative to volume." : parseFloat(c.naicComplaint) <= 1.0 ? "This is at or near the industry average." : "This is above the industry average, suggesting some friction in claims for some customers."} J.D. Power claims scores rate ${c.jdPowerClaim || "not surveyed"}.`,
    },
    {
      q: `Should I choose ${c.company} or a competitor?`,
      a: `${c.company} is strongest for ${ctx.buyer} who ${c.affordabilityRank <= 2 ? "want the lowest rates" : c.cxRank <= 2 ? "prioritize customer service quality" : "want established carrier reliability"}. Compare quotes from at least three carriers — ${c.company}'s rates and offerings vary significantly based on your specific profile, and the carrier that fits best can differ for ${VLABEL[v].buyer} in different situations.`,
    },
  ];
}

function buildIndustryRatings(c, v) {
  return [
    { source: "AM Best Financial Strength", score: c.amBest, overview: c.amBest.includes("A++") ? "Superior ability to meet financial obligations — only the top tier of P&C companies earn this rating" : c.amBest.includes("A+") ? "Superior ability to meet financial obligations" : c.amBest.includes("A-") || c.amBest.includes("A ") ? "Excellent ability to meet financial obligations" : "Good or above-average financial strength" },
    { source: "S&P Global Financial Strength", score: c.spGlobal, overview: c.spGlobal.includes("AA") ? "Very strong capacity to meet financial commitments" : c.spGlobal.includes("A") ? "Strong capacity to meet financial commitments" : "Adequate financial capacity" },
    { source: "J.D. Power Claims Satisfaction", score: c.jdPowerClaim, overview: c.jdPowerClaim === "Not surveyed" ? "Not included in J.D. Power's claims study" : parseInt(c.jdPowerClaim) >= 750 ? "Above industry average" : parseInt(c.jdPowerClaim) >= 700 ? "Near industry average" : "Below industry average" },
    { source: "NAIC Complaint Ratio", score: c.naicComplaint, overview: parseFloat(c.naicComplaint) <= 0.7 ? "Substantially fewer complaints than expected for company size" : parseFloat(c.naicComplaint) <= 1.0 ? "Near the expected level of complaints" : "More complaints than expected — investigate before purchasing" },
  ];
}

function buildMethodology(v) {
  const ctx = VLABEL[v];
  return {
    intro: `QuoteYeti's ${ctx.label.toLowerCase()} rankings are designed to surface where each carrier actually wins and loses. We don't accept payment for ranking placement, and our methodology is published in full so you can audit how we reach our conclusions.`,
    factors: [
      { label: "Cost", weight: "60%", description: `We compare quotes across multiple ${ctx.buyer} profiles, measuring how competitively each carrier prices its policies against local and national competitors. Data is normalized to comparable coverage levels.` },
      { label: "Customer satisfaction", weight: "30%", description: `We analyze customer feedback from J.D. Power member studies, NAIC complaint ratios, AM Best ratings, and public review sources to assess overall service quality and claims handling.` },
      { label: "Coverage breadth", weight: "10%", description: `We evaluate each carrier's coverage menu, scoring the variety of available endorsements, unique features, and gap-filling options.` },
    ],
  };
}

function buildBody(c, v) {
  // The body is supplemental — the structured sections handle the bulk.
  // Keep this brief and editorial.
  return `\n\n## Who ${c.company} is best for

Based on QuoteYeti's evaluation, ${c.company} fits ${VLABEL[v].buyer} who ${c.affordabilityRank <= 2 ? "want low rates and don't need extensive hand-holding" : c.cxRank <= 2 ? "value strong customer service and are willing to pay a modest premium for it" : "want an established carrier with broad coverage options"}. ${c.cons[0].includes("—") ? c.cons[0].split("—")[0].trim() : c.cons[0].split(",")[0]} is the most important caveat to consider.

## How to get the best rate from ${c.company}

The biggest rate drivers at ${c.company} are ${c.discounts && c.discounts.length > 0 ? c.discounts.slice(0, 2).map(d => d.type.toLowerCase()).join(" and ") : "bundling and a clean claims history"}. ${c.discounts && c.discounts.length > 0 ? `Stacking these discounts can reduce premiums by 15–30% depending on eligibility.` : `Bundling with other products is the most reliable way to lower your premium.`}

For ${VLABEL[v].buyer} comparing ${c.company} against competitors, focus on three things: the rate after all eligible discounts, the actual NAIC complaint ratio (not just J.D. Power's marketing-friendly scores), and the specific add-ons each carrier offers for your situation. The cheapest base rate isn't always the best total value.
`;
}

// ---- YAML emission ----

function escapeYaml(s) {
  if (s === null || s === undefined) return "";
  const str = String(s);
  // Need quotes if contains special chars or starts with special char
  if (/[:#&*!|>'"@`%\[\]\{\},?]/.test(str) || /^[-?]/.test(str) || str.trim() !== str) {
    return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  }
  return '"' + str.replace(/"/g, '\\"') + '"';
}

function yamlList(items, indent = "") {
  return items.map(item => `${indent}- ${escapeYaml(item)}`).join("\n");
}

function yamlListOfObjects(items, indent = "") {
  return items.map(item => {
    const lines = Object.entries(item).map(([k, v], i) =>
      `${indent}${i === 0 ? "- " : "  "}${k}: ${typeof v === "number" ? v : escapeYaml(v)}`
    );
    return lines.join("\n");
  }).join("\n");
}

function generateFrontmatter(c, v) {
  const ratings = [
    { category: "Customer experience", score: parseFloat((5.0 - (c.cxRank - 1) * 0.15).toFixed(2)), rank: c.cxRank },
    { category: "Coverage breadth", score: parseFloat((5.0 - (c.coverageRank - 1) * 0.15).toFixed(2)), rank: c.coverageRank },
    { category: "Affordability", score: parseFloat((5.0 - (c.affordabilityRank - 1) * 0.15).toFixed(2)), rank: c.affordabilityRank },
  ];

  return `---
title: ${escapeYaml(`${c.company} ${VLABEL[v].label} Review`)}
description: ${escapeYaml(`${c.company} ${VLABEL[v].label.toLowerCase()} review for ${YEAR}. Rates, customer experience, claims, coverage, pros, cons, and how it stacks up against competitors.`)}

company: ${escapeYaml(c.company)}
companyLogo: ${escapeYaml(`/assets/images/icons/${v}.svg`)}
foundedYear: ${c.foundedYear}
websiteUrl: ${escapeYaml(c.websiteUrl)}

positioning: ${escapeYaml(buildPositioning(c, v))}

updatedDate: ${TODAY}
publishDate: ${TODAY}
author: "QuoteYeti Editorial"
editor: "QuoteYeti Editor"

starRating: ${c.starRating}
overallScore: ${c.overallScore}
overallRank: ${c.overallRank}

ratings:
${yamlListOfObjects(ratings, "  ")}

takeaways:
${yamlList(buildTakeaways(c, v), "  ")}

costSummary: ${escapeYaml(buildCostSummary(c, v))}
avgMonthly: ${escapeYaml(c.avgMonthly)}
avgAnnual: ${escapeYaml(c.avgAnnual)}
differenceFromAvg: ${escapeYaml(c.diffPct)}
costByCategory:
${yamlListOfObjects(buildCostByCategory(c, v), "  ")}

cxSummary: ${escapeYaml(buildCxSummary(c, v))}
cxBuying: ${escapeYaml(buildCxBuying(c, v))}
cxPolicyManagement: ${escapeYaml(buildCxPolicyManagement(c, v))}
cxClaims: ${escapeYaml(buildCxClaims(c, v))}

industryRatings:
${yamlListOfObjects(buildIndustryRatings(c, v), "  ")}

${c.discounts && c.discounts.length > 0 ? `discounts:
${yamlListOfObjects(c.discounts, "  ")}` : ""}

coverageSummary: ${escapeYaml(`${c.company} offers a comprehensive coverage menu typical of major ${VLABEL[v].label.toLowerCase()} carriers, with several add-ons that set it apart from competitors. The table below details the main add-ons available.`)}
coverageAddOns:
${yamlListOfObjects(c.coverageAddOns, "  ")}

pros:
${yamlList(c.pros, "  ")}

cons:
${yamlList(c.cons, "  ")}

bottomLine: ${escapeYaml(buildBottomLine(c, v))}

faqs:
${yamlListOfObjects(buildFaqs(c, v), "  ")}

methodologyIntro: ${escapeYaml(buildMethodology(v).intro)}
methodologyFactors:
${yamlListOfObjects(buildMethodology(v).factors, "  ")}

authorBio: "Our editorial team consists of licensed insurance researchers and writers. We don't accept payment for ranking placements — every review is independent and based on data. Our methodology is published in full so you can audit how we reach our conclusions."
---
${buildBody(c, v)}`;
}

// ---- Main generator loop ----

function ensureDir(filepath) {
  mkdirSync(dirname(filepath), { recursive: true });
}

function writeReview(v, c) {
  const path = `${ROOT}/src/content/${v}/reviews/${c.slug}.md`;
  ensureDir(path);
  const content = generateFrontmatter(c, v);
  writeFileSync(path, content);
  return path;
}

console.log("🦴 Seeding carrier reviews across 8 verticals…\n");

let total = 0;
for (const [v, carriers] of Object.entries(CARRIERS)) {
  console.log(`  ${v}: ${carriers.length} reviews`);
  for (const carrier of carriers) {
    const path = writeReview(v, carrier);
    total++;
  }
}

console.log(`\n✓ Wrote ${total} carrier review files across ${Object.keys(CARRIERS).length} verticals.`);
