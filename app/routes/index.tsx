import { createRoute } from "honox/factory";
import Layout from "../components/layout";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../lib/config";

export default createRoute((c) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: SITE_DESCRIPTION,
    name: SITE_TITLE,
    url: SITE_URL,
  };

  return c.render(
    <Layout title={SITE_TITLE} description={SITE_DESCRIPTION} ogUrl={SITE_URL} jsonLd={jsonLd}>
      <main class="flex flex-col items-center justify-center min-h-[60vh]">
        <div class="card bg-base-100 shadow-sm w-full max-w-md">
          <div class="card-body items-center text-center">
            <h1 class="card-title text-3xl font-bold">{SITE_TITLE}</h1>
            <p class="text-base-content/70 mt-2">{SITE_DESCRIPTION}</p>
            <div class="divider" />
            <div class="flex flex-col gap-3 w-full">
              <a href="/posts/" class="btn btn-primary">
                ブログ記事一覧
              </a>
              <a
                href="https://github.com/Xantibody"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline gap-2"
              >
                <span class="nf nf-fa-github text-lg" />
                GitHub
              </a>
              <a
                href="https://zenn.dev/master_peace_36"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline gap-2"
              >
                Zenn
              </a>
            </div>
          </div>
        </div>
      </main>
    </Layout>,
  );
});
