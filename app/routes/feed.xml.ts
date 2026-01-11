import { createRoute } from "honox/factory";
import { getAllPosts } from "../lib/posts";

const SITE_URL = "https://raizawa-blog.pages.dev";
const SITE_TITLE = "R-Aizawa Blog";
const SITE_DESCRIPTION = "R-Aizawaの技術ブログ";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default createRoute((c) => {
  const posts = getAllPosts();

  const items = posts
    .slice(0, 20)
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid>${SITE_URL}/posts/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return c.body(xml, 200, {
    "Content-Type": "application/rss+xml; charset=utf-8",
  });
});
