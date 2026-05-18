import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

import rehypeAutolinkQuoteYeti from "./src/lib/rehype-autolink-quoteyeti.mjs";
import { buildAllLinkMaps } from "./src/lib/build-link-maps.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = resolve(__dirname, "src/content");

const linkMaps = buildAllLinkMaps(CONTENT_ROOT);

function gitLastmodForUrl(url) {
  const u = new URL(url);
  const cleanPath = u.pathname.replace(/^\/|\/$/g, "");
  const candidates = [
    `src/pages/${cleanPath}/index.astro`,
    `src/pages/${cleanPath}.astro`,
    `src/pages/${cleanPath}.mdx`,
    `src/pages/${cleanPath}.md`,
  ];
  const reviewMatch = cleanPath.match(/^([a-z-]+)\/reviews\/([^/]+)$/);
  if (reviewMatch) {
    const verticalSeg = reviewMatch[1].replace("-insurance", "");
    candidates.push(`src/content/${verticalSeg}/reviews/${reviewMatch[2]}.md`);
  }
  const blogMatch = cleanPath.match(/^blog\/([^/]+)$/);
  if (blogMatch) {
    candidates.push(`src/content/posts/${blogMatch[1]}.md`);
  }

  for (const candidate of candidates) {
    const abs = resolve(__dirname, candidate);
    try {
      const rel = relative(__dirname, abs);
      const log = execSync(`git log -1 --format="%cI" -- "${rel}"`, {
        encoding: "utf-8",
        cwd: __dirname,
        stdio: ["pipe", "pipe", "ignore"],
      }).trim();
      if (log) return new Date(log);
    } catch {
      continue;
    }
  }
  return null;
}

export default defineConfig({
  site: "https://www.quoteyeti.com",
  integrations: [
    mdx(),
    sitemap({
      entryLimit: 1000,
      changefreq: "weekly",
      priority: 0.7,
      filter: (page) => !page.includes("/404"),
      serialize(item) {
        const lastmod = gitLastmodForUrl(item.url);
        if (lastmod) item.lastmod = lastmod.toISOString();
        const pathname = new URL(item.url).pathname;
        if (pathname === "/") item.priority = 1.0;
        else if (/^\/(auto|.*-insurance)\/$/.test(pathname)) item.priority = 0.9;
        else if (pathname.includes("/reviews/")) item.priority = 0.8;
        else if (pathname.includes("/best/")) item.priority = 0.85;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: "directory",
  },
  trailingSlash: "always",
  markdown: {
    rehypePlugins: [
      [rehypeAutolinkQuoteYeti, { linkMaps, maxLinks: 6 }],
    ],
  },
});
