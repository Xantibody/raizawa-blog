import { describe, expect, it } from "vitest";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "./config";

// Robots.txt generation logic
const generateRobotsTxt = (): string => `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml`;

// WebSite JSON-LD generation logic
const createWebSiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  description: SITE_DESCRIPTION,
  name: SITE_TITLE,
  url: SITE_URL,
});

// BlogPosting JSON-LD generation logic
interface BlogPostingParams {
  date: string;
  slug: string;
  title: string;
}

const createBlogPostingJsonLd = ({ date, slug, title }: BlogPostingParams) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  author: { "@type": "Person", name: "r-aizawa" },
  datePublished: date,
  headline: title,
  url: `${SITE_URL}/posts/${slug}`,
});

describe("robots.txt", () => {
  describe("content structure", () => {
    it("should include User-agent directive", () => {
      const txt = generateRobotsTxt();
      expect(txt).toContain("User-agent: *");
    });

    it("should include Allow directive", () => {
      const txt = generateRobotsTxt();
      expect(txt).toContain("Allow: /");
    });

    it("should include Sitemap reference", () => {
      const txt = generateRobotsTxt();
      expect(txt).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    });
  });

  describe("format", () => {
    it("should have correct line breaks", () => {
      const txt = generateRobotsTxt();
      const lines = txt.split("\n");
      expect(lines).toHaveLength(3);
    });

    it("should not have trailing whitespace", () => {
      const txt = generateRobotsTxt();
      const lines = txt.split("\n");
      for (const line of lines) {
        expect(line).toBe(line.trimEnd());
      }
    });
  });
});

describe("JSON-LD WebSite schema", () => {
  it("should have correct @context", () => {
    const jsonLd = createWebSiteJsonLd();
    expect(jsonLd["@context"]).toBe("https://schema.org");
  });

  it("should have correct @type", () => {
    const jsonLd = createWebSiteJsonLd();
    expect(jsonLd["@type"]).toBe("WebSite");
  });

  it("should include site name", () => {
    const jsonLd = createWebSiteJsonLd();
    expect(jsonLd.name).toBe(SITE_TITLE);
  });

  it("should include site description", () => {
    const jsonLd = createWebSiteJsonLd();
    expect(jsonLd.description).toBe(SITE_DESCRIPTION);
  });

  it("should include site URL", () => {
    const jsonLd = createWebSiteJsonLd();
    expect(jsonLd.url).toBe(SITE_URL);
  });

  it("should have sorted keys", () => {
    const jsonLd = createWebSiteJsonLd();
    const keys = Object.keys(jsonLd);
    expect(keys).toEqual(["@context", "@type", "description", "name", "url"]);
  });
});

describe("JSON-LD BlogPosting schema", () => {
  const testPost = {
    date: "2024-01-15 10:30",
    slug: "test-post",
    title: "Test Post Title",
  };

  it("should have correct @context", () => {
    const jsonLd = createBlogPostingJsonLd(testPost);
    expect(jsonLd["@context"]).toBe("https://schema.org");
  });

  it("should have correct @type", () => {
    const jsonLd = createBlogPostingJsonLd(testPost);
    expect(jsonLd["@type"]).toBe("BlogPosting");
  });

  it("should include headline from title", () => {
    const jsonLd = createBlogPostingJsonLd(testPost);
    expect(jsonLd.headline).toBe(testPost.title);
  });

  it("should include datePublished", () => {
    const jsonLd = createBlogPostingJsonLd(testPost);
    expect(jsonLd.datePublished).toBe(testPost.date);
  });

  it("should include author as Person", () => {
    const jsonLd = createBlogPostingJsonLd(testPost);
    expect(jsonLd.author).toEqual({ "@type": "Person", name: "r-aizawa" });
  });

  it("should include canonical URL (posts path)", () => {
    const jsonLd = createBlogPostingJsonLd(testPost);
    expect(jsonLd.url).toBe(`${SITE_URL}/posts/${testPost.slug}`);
  });

  it("should have sorted keys", () => {
    const jsonLd = createBlogPostingJsonLd(testPost);
    const keys = Object.keys(jsonLd);
    expect(keys).toEqual(["@context", "@type", "author", "datePublished", "headline", "url"]);
  });

  describe("boundary tests", () => {
    it("should handle title with special characters", () => {
      const post = { ...testPost, title: 'Test <script> & "quotes"' };
      const jsonLd = createBlogPostingJsonLd(post);
      expect(jsonLd.headline).toBe('Test <script> & "quotes"');
    });

    it("should handle date without time", () => {
      const post = { ...testPost, date: "2024-01-15" };
      const jsonLd = createBlogPostingJsonLd(post);
      expect(jsonLd.datePublished).toBe("2024-01-15");
    });

    it("should handle slug with special characters", () => {
      const post = { ...testPost, slug: "test-post-123" };
      const jsonLd = createBlogPostingJsonLd(post);
      expect(jsonLd.url).toBe(`${SITE_URL}/posts/test-post-123`);
    });
  });
});

describe("JSON-LD serialization", () => {
  it("should produce valid JSON string", () => {
    const jsonLd = createWebSiteJsonLd();
    const jsonString = JSON.stringify(jsonLd);
    expect(() => JSON.parse(jsonString) as unknown).not.toThrow();
  });

  it("should produce valid JSON for BlogPosting", () => {
    const jsonLd = createBlogPostingJsonLd({
      date: "2024-01-15",
      slug: "test",
      title: "Test",
    });
    const jsonString = JSON.stringify(jsonLd);
    expect(() => JSON.parse(jsonString) as unknown).not.toThrow();
  });
});
