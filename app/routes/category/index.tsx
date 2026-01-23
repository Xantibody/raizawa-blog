import { createRoute } from "honox/factory";
import { FAVICON_URL, SITE_TITLE } from "../../lib/config";
import { getCategories, getPostsByCategory } from "../../lib/posts";
import baseStyles from "../../styles/base";
import indexStyles from "../../styles/index";

export default createRoute((c) => {
  const categories = getCategories();

  return c.render(
    <>
      {"<!DOCTYPE html>"}
      <html>
        <head>
          <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>カテゴリ一覧 - {SITE_TITLE}</title>
        <meta name="description" content="カテゴリ一覧" />
        <link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/feed.xml" />
        <link rel="icon" href={FAVICON_URL} />
        <style>{baseStyles + indexStyles}</style>
      </head>
      <body>
        <header>
          <a href="/" class="back-link">
            ← トップページに戻る
          </a>
          <h1>カテゴリ一覧</h1>
        </header>

        <main>
          <ul class="posts">
            {categories.map((category) => {
              const posts = getPostsByCategory(category);
              return (
                <li class="post-item" key={category}>
                  <h2 class="post-title">
                    <a href={`/category/${category}`}>{category}</a>
                  </h2>
                  <div class="post-meta">{posts.length}件の記事</div>
                </li>
              );
            })}
          </ul>
        </main>
      </body>
    </html>
    </>,
  );
});
