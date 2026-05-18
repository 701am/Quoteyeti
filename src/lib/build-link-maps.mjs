/**
 * Build link maps from the content directory at config-load time.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const VERTICALS = ["auto", "home", "life", "business", "health", "renters", "pet", "travel"];

const VERTICAL_PATHS = {
  auto: "/auto/",
  home: "/home-insurance/",
  life: "/life-insurance/",
  business: "/business-insurance/",
  health: "/health-insurance/",
  renters: "/renters-insurance/",
  pet: "/pet-insurance/",
  travel: "/travel-insurance/",
};

const VERTICAL_SHORT = {
  auto: "Auto",
  home: "Home",
  life: "Life",
  business: "Business",
  health: "Health",
  renters: "Renters",
  pet: "Pet",
  travel: "Travel",
};

const STOPWORDS = new Set([
  "insurance", "car", "auto", "home", "life", "business", "health",
  "renters", "pet", "travel", "policy", "coverage", "claim", "claims",
  "rate", "rates", "company", "companies", "best", "cheap", "cheapest",
  "review", "reviews", "guide",
]);

function readFrontmatterField(content, field) {
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return null;
  const lines = fm[1].split("\n");
  for (const line of lines) {
    const m = line.match(new RegExp(`^${field}:\\s*"?([^"\\n]+?)"?\\s*$`));
    if (m) return m[1].trim();
  }
  return null;
}

function listMdFiles(dir) {
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
      .map((f) => join(dir, f))
      .filter((p) => statSync(p).isFile());
  } catch {
    return [];
  }
}

function fileSlug(filePath) {
  return basename(filePath).replace(/\.(md|mdx)$/, "");
}

function buildVerticalMap(contentRoot, vertical) {
  const entries = [];
  const vPath = VERTICAL_PATHS[vertical];
  const vShort = VERTICAL_SHORT[vertical];

  const reviewsDir = join(contentRoot, vertical, "reviews");
  for (const filePath of listMdFiles(reviewsDir)) {
    const content = readFileSync(filePath, "utf-8");
    if (/^draft:\s*true/m.test(content)) continue;
    const name = readFrontmatterField(content, "company") ?? readFrontmatterField(content, "title");
    if (!name || STOPWORDS.has(name.toLowerCase())) continue;
    entries.push({
      term: name,
      url: `${vPath}reviews/${fileSlug(filePath)}/`,
      priority: 10,
      needle: name.toLowerCase(),
    });
  }

  if (vertical === "auto") {
    const glossaryDir = join(contentRoot, "auto", "glossary");
    for (const filePath of listMdFiles(glossaryDir)) {
      const content = readFileSync(filePath, "utf-8");
      if (/^draft:\s*true/m.test(content)) continue;
      const term =
        readFrontmatterField(content, "term") ??
        readFrontmatterField(content, "title") ??
        fileSlug(filePath);
      if (!term || STOPWORDS.has(term.toLowerCase())) continue;
      entries.push({
        term,
        url: `/auto/glossary/${fileSlug(filePath)}/`,
        priority: 8,
        needle: term.toLowerCase(),
      });
    }

    const locationsDir = join(contentRoot, "auto", "locations");
    for (const filePath of listMdFiles(locationsDir)) {
      const content = readFileSync(filePath, "utf-8");
      if (/^draft:\s*true/m.test(content)) continue;
      const state = readFrontmatterField(content, "state") ?? readFrontmatterField(content, "title");
      if (!state) continue;
      const slug = fileSlug(filePath);
      // Live route is /auto/by-state/, not /auto/locations/
      entries.push({
        term: state,
        url: `/auto/by-state/${slug}/`,
        priority: 7,
        needle: state.toLowerCase(),
      });
      entries.push({
        term: `${state} car insurance`,
        url: `/auto/by-state/${slug}/`,
        priority: 9,
        needle: `${state.toLowerCase()} car insurance`,
      });
    }

    const brandsDir = join(contentRoot, "auto", "brands");
    for (const filePath of listMdFiles(brandsDir)) {
      const content = readFileSync(filePath, "utf-8");
      // Skip drafts — those don't render as live pages
      if (/^draft:\s*true/m.test(content)) continue;
      const brand =
        readFrontmatterField(content, "brand") ?? readFrontmatterField(content, "title");
      if (!brand || STOPWORDS.has(brand.toLowerCase())) continue;
      entries.push({
        term: brand,
        url: `/auto/brands/${fileSlug(filePath)}/`,
        priority: 6,
        needle: brand.toLowerCase(),
      });
    }
  }

  const shortLc = vShort.toLowerCase();
  entries.push({
    term: `best ${shortLc} insurance`,
    url: `${vPath}best/`,
    priority: 5,
    needle: `best ${shortLc} insurance`,
  });
  // Only the four core verticals have a /cheapest/ page
  if (["auto", "home", "life", "business"].includes(vertical)) {
    entries.push({
      term: `cheapest ${shortLc} insurance`,
      url: `${vPath}cheapest/`,
      priority: 5,
      needle: `cheapest ${shortLc} insurance`,
    });
  }

  entries.sort((a, b) => {
    if (b.needle.length !== a.needle.length) return b.needle.length - a.needle.length;
    return b.priority - a.priority;
  });

  return entries;
}

export function buildAllLinkMaps(contentRoot) {
  const maps = {};
  for (const v of VERTICALS) {
    maps[v] = buildVerticalMap(contentRoot, v);
  }
  return maps;
}
