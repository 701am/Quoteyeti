import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { VERTICAL_LIST } from "~/data/verticals";

const SITE_URL = "https://www.quoteyeti.com";

export const GET: APIRoute = async () => {
  // Gather all carrier reviews across verticals
  const reviewSections: string[] = [];
  for (const v of VERTICAL_LIST) {
    try {
      const reviews = await getCollection(
        `${v.key}-reviews` as any,
        ({ data }: any) => !data.draft,
      );
      if (reviews.length === 0) continue;
      const items = reviews
        .map((r: any) => {
          const name = r.data.company ?? r.data.title;
          return `- [${name} ${v.short} Insurance Review](${SITE_URL}${v.path}reviews/${r.id}/)`;
        })
        .join("\n");
      reviewSections.push(`### ${v.label} reviews\n\n${items}`);
    } catch {
      continue;
    }
  }

  // Vertical hub list
  const hubs = VERTICAL_LIST.map(
    (v) => `- [${v.label}](${SITE_URL}${v.path}) — ${v.tagline}`,
  ).join("\n");

  const body = `# QuoteYeti

> Independent insurance research across eight verticals: auto, home, life, business, health, renters, pet, and travel. We compare carriers, rank them by methodology you can audit, and publish carrier reviews with no paid placement.

## What QuoteYeti is

QuoteYeti is an independent insurance comparison site. We earn commission when a reader chooses a policy through one of our affiliate links, but the ranking order, scores, and recommendations are entirely editorial. Carrier partnerships never influence our research.

Editorial standards: ${SITE_URL}/editorial/
About: ${SITE_URL}/about/

## Coverage hubs

${hubs}

## Carrier reviews

${reviewSections.join("\n\n")}

## Other resources

- [Sitemap](${SITE_URL}/sitemap/)
- [The Dispatch (blog)](${SITE_URL}/blog/)
- [Sitemap XML](${SITE_URL}/sitemap-index.xml)
- [RSS feed](${SITE_URL}/feed.xml)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
