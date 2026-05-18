import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const posts = await getCollection("posts", ({ data }: any) => !data.draft);
  const sorted = posts.sort(
    (a: any, b: any) =>
      new Date(b.data.publishDate ?? 0).getTime() -
      new Date(a.data.publishDate ?? 0).getTime(),
  );

  return rss({
    title: "QuoteYeti · The Dispatch",
    description:
      "Independent insurance research and reporting from the QuoteYeti editorial team. Auto, home, life, business, health, renters, pet, and travel.",
    site: context.site,
    items: sorted.map((post: any) => ({
      title: post.data.title,
      pubDate: post.data.publishDate
        ? new Date(post.data.publishDate)
        : new Date(),
      description: post.data.description ?? post.data.excerpt ?? "",
      link: `/blog/${post.id}/`,
      author: post.data.author ?? "QuoteYeti editorial",
      categories: post.data.category ? [post.data.category] : [],
    })),
    customData: `<language>en-us</language><copyright>© ${new Date().getFullYear()} QuoteYeti</copyright>`,
  });
}
