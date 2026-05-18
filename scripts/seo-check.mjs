#!/usr/bin/env node
/**
 * QuoteYeti build-time SEO validator
 *
 * Per Joost's playbook: catches H1 issues, duplicate titles/descriptions,
 * and missing meta descriptions. Run after `astro build`.
 *
 * Usage:
 *   node scripts/seo-check.mjs
 *   npm run check:seo
 *
 * Exits with status 1 if any check fails; warns but does not fail
 * on duplicate titles since paginated listings legitimately share them.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const DIST_DIR = "./dist";
const TITLE_MIN = 30;
const TITLE_MAX = 70;
const DESC_MIN = 50;
const DESC_MAX = 170;

function findHtmlFiles(dir) {
  const results = [];
  function walk(d) {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (entry.endsWith(".html")) results.push(full);
    }
  }
  walk(dir);
  return results.filter((f) => {
    // Skip admin (Decap CMS, noindex) and pages explicitly marked noindex
    const rel = relative(DIST_DIR, f);
    if (rel.startsWith("admin")) return false;
    const html = readFileSync(f, "utf-8");
    if (/<meta\s+name="robots"\s+content="noindex/.test(html)) return false;
    return true;
  });
}

function extract(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}

function countMatches(html, regex) {
  return (html.match(regex) ?? []).length;
}

if (!existsSync(DIST_DIR)) {
  console.error(`✗ ${DIST_DIR} not found — run \`npm run build\` first`);
  process.exit(1);
}

const files = findHtmlFiles(DIST_DIR);
console.log(`\nScanning ${files.length} HTML files…\n`);

const titles = new Map();
const descriptions = new Map();
const issues = { error: [], warn: [] };

for (const file of files) {
  const html = readFileSync(file, "utf-8");
  const rel = relative(DIST_DIR, file);

  // Title
  const title = extract(html, /<title>([^<]+)<\/title>/);
  if (!title) {
    issues.error.push(`${rel}: missing <title>`);
  } else {
    if (title.length < TITLE_MIN) issues.warn.push(`${rel}: title too short (${title.length} chars)`);
    if (title.length > TITLE_MAX) issues.warn.push(`${rel}: title too long (${title.length} chars)`);
    const existing = titles.get(title);
    if (existing) titles.set(title, [...existing, rel]);
    else titles.set(title, [rel]);
  }

  // Description
  const desc = extract(html, /<meta\s+name="description"\s+content="([^"]+)"/);
  if (!desc) {
    issues.error.push(`${rel}: missing meta description`);
  } else {
    if (desc.length < DESC_MIN) issues.warn.push(`${rel}: description too short (${desc.length} chars)`);
    if (desc.length > DESC_MAX) issues.warn.push(`${rel}: description too long (${desc.length} chars)`);
    const existing = descriptions.get(desc);
    if (existing) descriptions.set(desc, [...existing, rel]);
    else descriptions.set(desc, [rel]);
  }

  // H1 count — exactly 1 is best practice
  const h1Count = countMatches(html, /<h1\b[^>]*>/gi);
  if (h1Count === 0) issues.error.push(`${rel}: no <h1>`);
  if (h1Count > 1) issues.error.push(`${rel}: ${h1Count} <h1> elements (should be 1)`);

  // Canonical
  const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]+)"/);
  if (!canonical) issues.warn.push(`${rel}: missing canonical link`);

  // OG image
  const ogImage = extract(html, /<meta\s+property="og:image"\s+content="([^"]+)"/);
  if (!ogImage) issues.warn.push(`${rel}: missing og:image`);

  // JSON-LD
  const hasJsonLd = /<script\s+type="application\/ld\+json"/.test(html);
  if (!hasJsonLd) issues.warn.push(`${rel}: no JSON-LD structured data`);
}

// Duplicates
for (const [title, paths] of titles.entries()) {
  if (paths.length > 1) {
    issues.warn.push(`duplicate title "${title}" on: ${paths.join(", ")}`);
  }
}
for (const [desc, paths] of descriptions.entries()) {
  if (paths.length > 1) {
    issues.warn.push(`duplicate description on: ${paths.join(", ")}`);
  }
}

// Output
if (issues.error.length > 0) {
  console.log(`✗ ${issues.error.length} ERRORS:\n`);
  for (const e of issues.error) console.log(`  ${e}`);
  console.log("");
}
if (issues.warn.length > 0) {
  console.log(`⚠ ${issues.warn.length} WARNINGS:\n`);
  for (const w of issues.warn) console.log(`  ${w}`);
  console.log("");
}
if (issues.error.length === 0 && issues.warn.length === 0) {
  console.log("✓ All SEO checks passed");
}

console.log(`\nSummary: ${files.length} pages scanned, ${issues.error.length} errors, ${issues.warn.length} warnings`);
process.exit(issues.error.length > 0 ? 1 : 0);
