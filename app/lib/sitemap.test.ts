import { describe, expect, it } from "vitest";
import { SITE_URL } from "./config";
import { type PostMeta, getAllPosts, getCategories, getTags, getTotalPages } from "./posts";

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

const generateSitemap = (): string => {
  const urls = [
    ...buildStaticUrls(getTotalPages()),
    ...buildPostUrls(getAllPosts()),
    ...buildCategoryUrls(getCategories()),
    ...buildTagUrls(getTags()),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
};

describe("sitemap.xml", () => {
  describe("XML structure", () => {
    it("should generate valid XML declaration", () => {
      const xml = generateSitemap();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    });

    it("should have urlset with correct namespace", () => {
      const xml = generateSitemap();
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain("</urlset>");
    });
  });

  describe("static URLs", () => {
    it("should include home page URL", () => {
      const xml = generateSitemap();
      expect(xml).toContain(`<loc>${SITE_URL}</loc>`);
    });

    it("should include category index URL", () => {
      const xml = generateSitemap();
      expect(xml).toContain(`<loc>${SITE_URL}/category</loc>`);
    });

    it("should include tag index URL", () => {
      const xml = generateSitemap();
      expect(xml).toContain(`<loc>${SITE_URL}/tag</loc>`);
    });
  });

  describe("pagination URLs", () => {
    it("should include page 2 and beyond when multiple pages exist", () => {
      const totalPages = getTotalPages();
      const xml = generateSitemap();

      if (totalPages > 1) {
        expect(xml).toContain(`<loc>${SITE_URL}/page/2</loc>`);
      }
    });

    it("should not include page 1 as separate URL", () => {
      const xml = generateSitemap();
      expect(xml).not.toContain(`<loc>${SITE_URL}/page/1</loc>`);
    });
  });

  describe("post URLs", () => {
    it("should include all post URLs", () => {
      const posts = getAllPosts();
      const xml = generateSitemap();

      for (const post of posts) {
        expect(xml).toContain(`<loc>${SITE_URL}/posts/${post.slug}</loc>`);
      }
    });

    it("should include lastmod for posts", () => {
      const posts = getAllPosts();
      const xml = generateSitemap();
      const [firstPost] = posts;

      if (firstPost !== undefined) {
        expect(xml).toContain("<lastmod>");
        expect(xml).toContain("</lastmod>");
      }
    });
  });

  describe("category URLs", () => {
    it("should include all category URLs", () => {
      const categories = getCategories();
      const xml = generateSitemap();

      for (const category of categories) {
        expect(xml).toContain(`<loc>${SITE_URL}/category/${category}</loc>`);
      }
    });
  });

  describe("tag URLs", () => {
    it("should include all tag URLs", () => {
      const tags = getTags();
      const xml = generateSitemap();

      for (const tag of tags) {
        expect(xml).toContain(`<loc>${SITE_URL}/tag/${tag}</loc>`);
      }
    });
  });

  describe("formatDate", () => {
    it("should format date without time", () => {
      expect(formatDate("2024-01-15")).toBe("2024-01-15");
    });

    it("should format date with time (space separator)", () => {
      expect(formatDate("2024-01-15 10:30")).toBe("2024-01-15");
    });

    it("should format date with time (T separator)", () => {
      expect(formatDate("2024-01-15T10:30:00")).toBe("2024-01-15");
    });
  });

  describe("buildPaginationUrls boundary (0-1-N)", () => {
    it("should return empty array when totalPages is 1", () => {
      const urls = buildPaginationUrls(1);
      expect(urls).toHaveLength(0);
    });

    it("should return single URL when totalPages is 2", () => {
      const urls = buildPaginationUrls(2);
      expect(urls).toHaveLength(1);
      expect(urls[0]).toContain("/page/2");
    });

    it("should return multiple URLs when totalPages > 2", () => {
      const urls = buildPaginationUrls(5);
      expect(urls).toHaveLength(4);
      expect(urls[0]).toContain("/page/2");
      expect(urls[3]).toContain("/page/5");
    });
  });
});
