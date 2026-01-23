import { createRoute } from "honox/factory";
import { FAVICON_URL, SITE_TITLE } from "../../lib/config";
import { getPostsByTag, getTags } from "../../lib/posts";
import baseStyles from "../../styles/base";
import indexStyles from "../../styles/index";

export default createRoute((c) => {
  const tags = getTags();

  return c.render(
    <>
      {"<!DOCTYPE html>"}
      <html>
        <head>
          <meta charSet="utf8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>タグ一覧 - {SITE_TITLE}</title>
          <meta name="description" content="タグ一覧" />
          <link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/feed.xml" />
          <link rel="icon" href={FAVICON_URL} />
          <style>{baseStyles + indexStyles}</style>
        </head>
        <body>
          <header>
            <a href="/" class="back-link">
              ← トップページに戻る
            </a>
            <h1>タグ一覧</h1>
          </header>

          <main>
            <ul class="posts">
              {tags.map((tag) => {
                const posts = getPostsByTag(tag);
                return (
                  <li class="post-item" key={tag}>
                    <h2 class="post-title">
                      <a href={`/tag/${tag}`}>{tag}</a>
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
