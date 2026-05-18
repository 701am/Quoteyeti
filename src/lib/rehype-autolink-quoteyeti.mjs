/**
 * rehype-autolink-quoteyeti
 *
 * Astro rehype plugin that injects intra-vertical autolinks into the
 * rendered HTML of Markdown content. Detects vertical from the source
 * path and applies first-mention linking via the appropriate link map.
 */

import { visit, SKIP } from "unist-util-visit";

const SKIP_TAGS = new Set(["a", "code", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "script", "style"]);

function detectVertical(filePath) {
  if (!filePath) return null;
  const m = filePath.match(/[\\/]content[\\/](auto|home|life|business|health|renters|pet|travel)[\\/]/);
  return m ? m[1] : null;
}

/**
 * Best-effort: derive the canonical URL of the current page from its source file path.
 * - /content/<vertical>/reviews/<slug>.md → /<vertical>/reviews/<slug>/
 * - /content/auto/glossary/<slug>.md     → /auto/glossary/<slug>/
 * - /content/auto/locations/<slug>.md    → /auto/locations/<slug>/
 * - /content/auto/brands/<slug>.md       → /auto/brands/<slug>/
 * Returns null if no rule matches.
 */
const VERTICAL_TO_PATH = {
  auto: "/auto/",
  home: "/home-insurance/",
  life: "/life-insurance/",
  business: "/business-insurance/",
  health: "/health-insurance/",
  renters: "/renters-insurance/",
  pet: "/pet-insurance/",
  travel: "/travel-insurance/",
};

function deriveCurrentPath(filePath) {
  if (!filePath) return null;
  const norm = filePath.replace(/\\/g, "/");
  const m = norm.match(/\/content\/(auto|home|life|business|health|renters|pet|travel)\/(reviews|glossary|locations|brands|faqs|guides)\/([^/]+?)\.(md|mdx)$/);
  if (!m) return null;
  const [, vertical, kind, slug] = m;
  const base = VERTICAL_TO_PATH[vertical];
  return `${base}${kind}/${slug}/`;
}

export default function rehypeAutolinkQuoteYeti(options) {
  const { linkMaps, maxLinks = 6 } = options ?? {};

  return (tree, file) => {
    const filePath = file?.history?.[0] ?? file?.path;
    const vertical = detectVertical(filePath);
    if (!vertical) return;

    const linkMap = linkMaps?.[vertical];
    if (!linkMap || linkMap.length === 0) return;

    const currentPath = deriveCurrentPath(filePath);

    let linksAdded = 0;
    const linkedNeedles = new Set();

    visit(tree, (node, index, parent) => {
      if (linksAdded >= maxLinks) return SKIP;
      if (!parent || index === undefined) return;

      if (node.type === "element") {
        if (SKIP_TAGS.has(node.tagName)) return SKIP;
        return;
      }

      if (node.type !== "text") return;
      let text = node.value;
      if (!text || !text.trim()) return;

      const newChildren = [];

      // Collect candidate matches: for each unlinked entry, find its first
      // position in this text node. Then sort by position (not priority)
      // so we replace left-to-right and don't skip earlier mentions.
      const candidates = [];
      for (const entry of linkMap) {
        if (linkedNeedles.has(entry.needle)) continue;
        if (currentPath && entry.url === currentPath) continue;

        const escaped = entry.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`(?<!\\w)(${escaped})(?!\\w)`, "i");
        const m = text.match(re);
        if (!m || m.index === undefined) continue;
        candidates.push({
          entry,
          index: m.index,
          length: m[1].length,
          matched: m[1],
        });
      }

      // Sort by position, then by needle length descending (longer needle
      // wins overlap ties — "best auto insurance" beats "auto" at same pos)
      candidates.sort((a, b) => {
        if (a.index !== b.index) return a.index - b.index;
        return b.length - a.length;
      });

      // Walk left-to-right, skipping overlaps, capping at maxLinks
      let cursor = 0;
      let madeChange = false;

      for (const c of candidates) {
        if (linksAdded >= maxLinks) break;
        if (c.index < cursor) continue; // overlap with previously linked span
        if (linkedNeedles.has(c.entry.needle)) continue;

        if (c.index > cursor) {
          newChildren.push({ type: "text", value: text.slice(cursor, c.index) });
        }
        newChildren.push({
          type: "element",
          tagName: "a",
          properties: {
            className: ["autolink"],
            href: c.entry.url,
          },
          children: [{ type: "text", value: c.matched }],
        });

        cursor = c.index + c.length;
        linkedNeedles.add(c.entry.needle);
        linksAdded++;
        madeChange = true;
      }

      if (madeChange) {
        if (cursor < text.length) {
          newChildren.push({ type: "text", value: text.slice(cursor) });
        }
        parent.children.splice(index, 1, ...newChildren);
        return [SKIP, index + newChildren.length];
      }
    });
  };
}
