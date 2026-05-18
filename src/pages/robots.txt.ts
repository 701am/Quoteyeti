import type { APIRoute } from "astro";

const SITE_URL = "https://www.quoteyeti.com";

export const GET: APIRoute = () => {
  const body = `# QuoteYeti — robots.txt
# Generated at build time. Update via src/pages/robots.txt.ts

User-agent: *
Allow: /

# Block aggregator/affiliate landing pages that might be created later
Disallow: /quotes/
Disallow: /go/

Sitemap: ${SITE_URL}/sitemap-index.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
