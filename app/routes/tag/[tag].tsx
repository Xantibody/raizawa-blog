import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { FAVICON_URL, SITE_TITLE } from "../../lib/config";
import { getPostsByTag, getTags } from "../../lib/posts";
import baseStyles from "../../styles/base";
import indexStyles from "../../styles/index";

export default createRoute(
  ssgParams(() => getTags().map((tag) => ({ tag }))),
  (c) => {
    const tag = c.req.param("tag");
    if (tag === undefined || tag === "") {
      return c.notFound();
    }

    const posts = getPostsByTag(tag);
    if (posts.length === 0) {
      return c.notFound();
    }

    return c.render(
      <html>
        <head>
          <meta charSet="utf8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>
            {tag} - {SITE_TITLE}
          </title>
          <meta name="description" content={`${tag}の記事一覧`} />
          <link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/feed.xml" />
          <link rel="icon" href={FAVICON_URL} />
          <style>{baseStyles + indexStyles}</style>
        </head>
        <body>
          <header>
            <a href="/" class="back-link">
              ← トップページに戻る
            </a>
            <h1>{tag}</h1>
          </header>

          <main>
            <ul class="posts">
              {posts.map((post) => (
                <li class="post-item" key={post.slug}>
                  <h2 class="post-title">
                    <a href={`/posts/${post.slug}`}>{post.title}</a>
                  </h2>
                  <div class="post-meta">
                    <time>{new Date(post.date).toLocaleDateString("ja-JP")}</time>
                    {post.category !== "" && (
                      <span>
                        {" "}
                        • <a href={`/category/${post.category}`}>{post.category}</a>
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </main>
        </body>
      </html>,
    );
  },
);
