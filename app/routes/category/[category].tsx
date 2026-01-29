import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { FAVICON_URL, SITE_TITLE } from "../../lib/config";
import { getCategories, getPostsByCategory } from "../../lib/posts";
import baseStyles from "../../styles/base";
import indexStyles from "../../styles/index";

export default createRoute(
  ssgParams(() => getCategories().map((category) => ({ category }))),
  (c) => {
    const category = c.req.param("category");
    if (category === undefined || category === "") {
      return c.notFound();
    }

    const posts = getPostsByCategory(category);
    if (posts.length === 0) {
      return c.notFound();
    }

    return c.render(
      <html>
        <head>
          <meta charSet="utf8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>
            {category} - {SITE_TITLE}
          </title>
          <meta name="description" content={`${category}の記事一覧`} />
          <link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/feed.xml" />
          <link rel="icon" href={FAVICON_URL} />
          <style>{baseStyles + indexStyles}</style>
        </head>
        <body>
          <header>
            <a href="/" class="back-link">
              ← トップページに戻る
            </a>
            <h1>{category}</h1>
          </header>

          <main>
            <ul class="posts">
              {posts.map((post) => (
                <li class="post-item" key={post.slug}>
                  <h2 class="post-title">
                    <a href={`/category/${category}/posts/${post.slug}`}>{post.title}</a>
                  </h2>
                  <div class="post-meta">
                    <time>{new Date(post.date).toLocaleDateString("ja-JP")}</time>
                  </div>
                  {post.tags.length > 0 && (
                    <div class="post-tags">
                      {post.tags.map((tag) => (
                        <span class="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </main>
        </body>
      </html>,
    );
  },
);
