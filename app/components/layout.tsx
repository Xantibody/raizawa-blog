import { type Child } from "hono/jsx";
import { Link } from "honox/server";
import { FAVICON_URL, SITE_TITLE } from "../lib/config";

const containerWidth = (wide: boolean): string => {
  if (wide) {
    return "max-w-6xl";
  }
  return "max-w-3xl";
};

interface JsonLd {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

interface LayoutProps {
  title: string;
  description: string;
  ogType?: "website" | "article";
  ogUrl: string;
  jsonLd?: JsonLd;
  wide?: boolean;
  children: Child;
}

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    class="inline-block h-6 w-6 stroke-current"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const DRAWER_ID = "nav-drawer";

const headerScrollScript = `{
  const h = document.getElementById('header-wrapper');
  if (h) {
    let s = false;
    addEventListener('scroll', () => {
      const n = scrollY > 0;
      if (n !== s) { s = n; s ? h.dataset.scrolled = '' : delete h.dataset.scrolled; }
    }, { passive: true });
  }
}`;

export default function Layout({
  title,
  description,
  ogType = "website",
  ogUrl,
  jsonLd,
  wide = false,
  children,
}: LayoutProps) {
  const containerClass = containerWidth(wide);

  return (
    <html lang="ja" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta name="twitter:card" content="summary" />
        <link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/feed.xml" />
        <link rel="canonical" href={ogUrl} />
        <link rel="icon" href={FAVICON_URL} />
        <Link href="/app/style.css" rel="stylesheet" />
        {jsonLd !== undefined && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body class="min-h-screen bg-base-200">
        <div class="drawer">
          <input id={DRAWER_ID} type="checkbox" class="drawer-toggle" />
          <div class="drawer-content flex flex-col pt-16">
            <div
              id="header-wrapper"
              class="fixed top-0 left-0 right-0 z-40 transition-opacity duration-300"
            >
              <div class="navbar bg-base-100 shadow-sm">
                <div class="flex-none">
                  <label for={DRAWER_ID} aria-label="open sidebar" class="btn btn-square btn-ghost">
                    <HamburgerIcon />
                  </label>
                </div>
                <div class="flex-1">
                  <a href="/" class="btn btn-ghost text-xl">
                    {SITE_TITLE}
                  </a>
                </div>
              </div>
            </div>
            <div class={`container mx-auto ${containerClass} px-4 py-6`}>{children}</div>
          </div>
          <div class="drawer-side z-50">
            <label for={DRAWER_ID} aria-label="close sidebar" class="drawer-overlay" />
            <ul class="menu bg-base-200 min-h-full w-80 p-4">
              <li>
                <a href="/">ホーム</a>
              </li>
              <li>
                <a href="/posts">ブログ</a>
              </li>
              <li>
                <a href="/category">カテゴリ</a>
              </li>
              <li>
                <a href="/tag">タグ</a>
              </li>
            </ul>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: headerScrollScript }} />
      </body>
    </html>
  );
}
