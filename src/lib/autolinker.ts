/**
 * QuoteYeti Autolinker
 *
 * Wikipedia-style internal linking, scoped to insurance verticals.
 *
 * Builds a map of `term → URL` from content collections, then processes
 * HTML or text to auto-link first occurrences of recognized terms within
 * the same vertical. A "renters insurance" article won't link to terms
 * from "auto insurance" content — that keeps relevance high.
 *
 * Why it matters for SEO (per Joost): internal linking structure is one
 * of the strongest signals you control. Automate the discovery; be
 * intentional about the execution.
 *
 * Usage from any `.astro` template:
 *
 *   import { autolinkHtml, getLinkMap } from "~/lib/autolinker";
 *   const linkMap = await getLinkMap("auto");
 *   const linkedHtml = autolinkHtml(rawHtml, linkMap, { maxLinks: 6 });
 *
 * Or for a single field:
 *
 *   import { autolinkText } from "~/lib/autolinker";
 *   const linked = autolinkText("GEICO offers full coverage.", linkMap);
 */

import { getCollection } from "astro:content";
import type { VerticalKey } from "~/data/verticals";
import { VERTICALS } from "~/data/verticals";

export interface LinkEntry {
  term: string;
  url: string;
  /** Higher priority terms get auto-linked first. Reviews > Glossary > Best-of > Hub. */
  priority: number;
  /** Lowercased version for matching */
  needle: string;
}

/**
 * Per-vertical cache. We resolve this once per build per vertical.
 */
const linkMapCache: Partial<Record<VerticalKey, LinkEntry[]>> = {};

/**
 * Generic terms that aren't worth linking even if a page exists.
 * "Car" or "Insurance" would match every paragraph and look spammy.
 */
const STOPWORDS = new Set([
  "insurance",
  "car",
  "auto",
  "home",
  "life",
  "business",
  "health",
  "renters",
  "pet",
  "travel",
  "policy",
  "coverage",
  "claim",
  "claims",
  "rate",
  "rates",
  "company",
  "companies",
  "best",
  "cheap",
  "cheapest",
  "review",
  "reviews",
  "guide",
]);

/**
 * Build the link map for a single vertical. Pulled from content collections.
 * Cached after first call.
 */
export async function getLinkMap(vertical: VerticalKey): Promise<LinkEntry[]> {
  if (linkMapCache[vertical]) return linkMapCache[vertical]!;

  const vData = VERTICALS[vertical];
  const entries: LinkEntry[] = [];

  // 1. Carrier reviews — highest priority. Match on the carrier name.
  try {
    const reviews = await getCollection(`${vertical}-reviews` as any, ({ data }: any) => !data.draft);
    for (const r of reviews) {
      const name = (r.data.company ?? r.data.title ?? "").toString().trim();
      if (!name || STOPWORDS.has(name.toLowerCase())) continue;
      entries.push({
        term: name,
        url: `${vData.path}reviews/${r.id}/`,
        priority: 10,
        needle: name.toLowerCase(),
      });
    }
  } catch {
    // Collection may not exist for every vertical
  }

  // 2. Auto-only: glossary entries, locations, FAQs, brands
  if (vertical === "auto") {
    try {
      const glossary = await getCollection("auto-glossary" as any);
      for (const g of glossary) {
        const term = (g.data.term ?? g.data.title ?? g.id).toString().trim();
        if (!term || STOPWORDS.has(term.toLowerCase())) continue;
        entries.push({
          term,
          url: `/auto/glossary/${g.id}/`,
          priority: 8,
          needle: term.toLowerCase(),
        });
      }
    } catch {}

    try {
      const locations = await getCollection("auto-locations" as any);
      for (const l of locations) {
        const state = (l.data.state ?? l.data.title ?? l.id).toString().trim();
        if (!state) continue;
        entries.push({
          term: state,
          url: `/auto/locations/${l.id}/`,
          priority: 7,
          needle: state.toLowerCase(),
        });
        // Also link "<state> car insurance"
        entries.push({
          term: `${state} car insurance`,
          url: `/auto/locations/${l.id}/`,
          priority: 9,
          needle: `${state.toLowerCase()} car insurance`,
        });
      }
    } catch {}

    try {
      const brands = await getCollection("auto-brands" as any);
      for (const b of brands) {
        const brand = (b.data.brand ?? b.data.title ?? b.id).toString().trim();
        if (!brand || STOPWORDS.has(brand.toLowerCase())) continue;
        entries.push({
          term: brand,
          url: `/auto/brands/${b.id}/`,
          priority: 6,
          needle: brand.toLowerCase(),
        });
      }
    } catch {}
  }

  // 3. Hub-level pages: best-of, cheapest, by-state — always present per vertical
  entries.push({
    term: `best ${vData.short.toLowerCase()} insurance`,
    url: `${vData.path}best/`,
    priority: 5,
    needle: `best ${vData.short.toLowerCase()} insurance`,
  });
  entries.push({
    term: `cheapest ${vData.short.toLowerCase()} insurance`,
    url: `${vData.path}cheapest/`,
    priority: 5,
    needle: `cheapest ${vData.short.toLowerCase()} insurance`,
  });

  // Sort longest needles first so "best auto insurance" matches before "auto"
  entries.sort((a, b) => {
    if (b.needle.length !== a.needle.length) return b.needle.length - a.needle.length;
    return b.priority - a.priority;
  });

  linkMapCache[vertical] = entries;
  return entries;
}

interface AutolinkOptions {
  /** Cap auto-links per document to avoid spam. Default: 6. */
  maxLinks?: number;
  /** Skip terms whose URL matches this path (don't self-link). */
  currentPath?: string;
  /** Skip terms — additional list of lowercased terms to never link. */
  skip?: string[];
}

/**
 * Auto-link first occurrence of each term in plain text.
 * Returns an HTML string with <a> tags injected.
 *
 * Use this for short strings (FAQ answers, takeaways). For full HTML
 * documents, use autolinkHtml() instead.
 */
export function autolinkText(text: string, linkMap: LinkEntry[], opts: AutolinkOptions = {}): string {
  if (!text) return text;
  const { maxLinks = 6, currentPath, skip = [] } = opts;
  const skipSet = new Set(skip.map((s) => s.toLowerCase()));

  let result = text;
  let linksAdded = 0;
  const linkedTerms = new Set<string>();

  for (const entry of linkMap) {
    if (linksAdded >= maxLinks) break;
    if (linkedTerms.has(entry.needle)) continue;
    if (skipSet.has(entry.needle)) continue;
    if (currentPath && entry.url === currentPath) continue;

    // Match whole-word, case-insensitive, only the FIRST occurrence
    // (?<!\w) and (?!\w) are word boundaries that don't break on punctuation
    const escaped = entry.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?<!\\w)(${escaped})(?!\\w)`, "i");
    const match = result.match(re);
    if (!match) continue;

    const replacement = `<a class="autolink" href="${entry.url}">${match[1]}</a>`;
    result = result.replace(re, replacement);
    linkedTerms.add(entry.needle);
    linksAdded++;
  }

  return result;
}

/**
 * Auto-link first occurrence in an HTML string. Safer than autolinkText for
 * rendered HTML — it skips text inside <a>, <code>, <pre>, <h1>..<h6>, and
 * inside attribute values. Operates on text nodes only.
 *
 * Implementation note: we don't pull in a full HTML parser. Instead we use
 * a tokenizer regex that walks through the string a chunk at a time,
 * tracking whether we're inside a "skip" tag. Text outside any skip tag
 * is eligible for linking.
 */
export function autolinkHtml(html: string, linkMap: LinkEntry[], opts: AutolinkOptions = {}): string {
  if (!html) return html;
  const { maxLinks = 6, currentPath, skip = [] } = opts;
  const skipSet = new Set(skip.map((s) => s.toLowerCase()));

  const SKIP_TAGS = new Set(["a", "code", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "script", "style"]);

  // Tokenize: each chunk is either a tag or a text run.
  const tokens: { kind: "tag" | "text"; value: string }[] = [];
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let cursor = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(html)) !== null) {
    if (m.index > cursor) {
      tokens.push({ kind: "text", value: html.slice(cursor, m.index) });
    }
    tokens.push({ kind: "tag", value: m[0] });
    cursor = m.index + m[0].length;
  }
  if (cursor < html.length) {
    tokens.push({ kind: "text", value: html.slice(cursor) });
  }

  let linksAdded = 0;
  const linkedTerms = new Set<string>();
  const skipStack: string[] = [];

  // Build active needles list — we'll mutate this as we go
  const activeEntries = linkMap.filter((e) => {
    if (skipSet.has(e.needle)) return false;
    if (currentPath && e.url === currentPath) return false;
    return true;
  });

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.kind === "tag") {
      const tagMatch = tok.value.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/);
      if (tagMatch) {
        const tagName = tagMatch[1].toLowerCase();
        if (SKIP_TAGS.has(tagName)) {
          if (tok.value.startsWith("</")) {
            // Close tag — pop if it matches top
            if (skipStack[skipStack.length - 1] === tagName) skipStack.pop();
          } else if (!tok.value.endsWith("/>")) {
            // Open tag (not self-closing)
            skipStack.push(tagName);
          }
        }
      }
      continue;
    }
    if (skipStack.length > 0) continue; // we're inside a skip tag
    if (linksAdded >= maxLinks) break;

    let text = tok.value;
    let changed = false;

    for (const entry of activeEntries) {
      if (linksAdded >= maxLinks) break;
      if (linkedTerms.has(entry.needle)) continue;

      const escaped = entry.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(?<!\\w)(${escaped})(?!\\w)`, "i");
      const match = text.match(re);
      if (!match) continue;

      const replacement = `<a class="autolink" href="${entry.url}">${match[1]}</a>`;
      text = text.replace(re, replacement);
      linkedTerms.add(entry.needle);
      linksAdded++;
      changed = true;
    }

    if (changed) {
      tokens[i] = { kind: "text", value: text };
    }
  }

  return tokens.map((t) => t.value).join("");
}

/**
 * Convenience: auto-link several short strings together using a shared
 * link map and a shared counter so we don't repeat-link the same term across
 * a bulk operation (e.g. an array of FAQ answers).
 */
export function autolinkBatch(items: string[], linkMap: LinkEntry[], opts: AutolinkOptions = {}): string[] {
  const { maxLinks = 6 } = opts;
  const linkedTerms = new Set<string>();
  let linksAdded = 0;
  const out: string[] = [];

  for (const item of items) {
    if (linksAdded >= maxLinks) {
      out.push(item);
      continue;
    }
    const skipFromBatch = Array.from(linkedTerms);
    const linked = autolinkText(item, linkMap, {
      ...opts,
      maxLinks: maxLinks - linksAdded,
      skip: [...(opts.skip ?? []), ...skipFromBatch],
    });
    // Count <a class="autolink"> additions
    const newCount = (linked.match(/class="autolink"/g) ?? []).length;
    linksAdded += newCount;
    // Track which terms were used by re-scanning
    for (const entry of linkMap) {
      if (linked.includes(`href="${entry.url}"`)) {
        linkedTerms.add(entry.needle);
      }
    }
    out.push(linked);
  }
  return out;
}
