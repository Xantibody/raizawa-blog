import { type Child } from "hono/jsx";
import { Link } from "honox/server";
import { FAVICON_URL, SITE_TITLE } from "../lib/config";

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
  children: Child;
}

export default function Layout({
  title,
  description,
  ogType = "website",
  ogUrl,
  jsonLd,
  children,
}: LayoutProps) {
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
        <div class="container mx-auto max-w-3xl px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
