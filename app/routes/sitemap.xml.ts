import { createRoute } from "honox/factory";
import { SITE_URL } from "../lib/config";
import { HTTP_OK } from "../lib/http";
import { type PostMeta, getAllPosts, getCategories, getTags, getTotalPages } from "../lib/posts";

const SECOND_PAGE = 2;

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr.replace(" ", "T"));
  const [isoDate] = date.toISOString().split("T");
  return isoDate ?? "";
};

const buildPaginationUrls = (totalPages: number): string[] =>
  Array.from(
    { length: totalPages - 1 },
    (_unused, index) => `  <url>
    <loc>${SITE_URL}/page/${index + SECOND_PAGE}</loc>
  </url>`,
  );

const buildStaticUrls = (totalPages: number): string[] => [
  `  <url>
    <loc>${SITE_URL}</loc>
  </url>`,
  ...buildPaginationUrls(totalPages),
  `  <url>
    <loc>${SITE_URL}/category</loc>
  </url>`,
  `  <url>
    <loc>${SITE_URL}/tag</loc>
  </url>`,
];

const buildPostUrls = (posts: PostMeta[]): string[] =>
  posts.map(
    (post) => `  <url>
    <loc>${SITE_URL}/posts/${post.slug}</loc>
    <lastmod>${formatDate(post.date)}</lastmod>
  </url>`,
  );

const buildCategoryUrls = (categories: string[]): string[] =>
  categories.map(
    (category) => `  <url>
    <loc>${SITE_URL}/category/${category}</loc>
  </url>`,
  );

const buildTagUrls = (tags: string[]): string[] =>
  tags.map(
    (tag) => `  <url>
    <loc>${SITE_URL}/tag/${tag}</loc>
  </url>`,
  );

export default createRoute((c) => {
  const urls = [
    ...buildStaticUrls(getTotalPages()),
    ...buildPostUrls(getAllPosts()),
    ...buildCategoryUrls(getCategories()),
    ...buildTagUrls(getTags()),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return c.body(xml, HTTP_OK, {
    "Content-Type": "application/xml; charset=utf-8",
  });
});
