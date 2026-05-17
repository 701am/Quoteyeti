import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return rss({
    title: "The Dispatch · QuoteYeti",
    description: "Hot takes on insurance and money from the QuoteYeti team.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate ?? new Date(),
      description: post.data.excerpt ?? post.data.description ?? "",
      link: `/blog/${post.id}/`,
      categories: post.data.tags ?? [],
    })),
    customData: `<language>en-us</language>`,
  });
}
