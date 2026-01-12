import { createRoute } from "honox/factory";
import { getPostBySlug } from "../../lib/posts";
import baseStyles from "../../styles/base";
import { codeBlockStyles, mobileStyles, ogpCardStyles, postStyles } from "../../styles/post";

export default createRoute((c) => {
  const slug = c.req.param("slug");
  if (slug === undefined || slug === "") {
    return c.notFound();
  }

  const post = getPostBySlug(slug);
  if (post === undefined) {
    return c.notFound();
  }

  // Use pre-rendered HTML from build time
  const htmlContent = post.html;
  const allStyles = baseStyles + postStyles + codeBlockStyles + ogpCardStyles + mobileStyles;

  return c.render(
    <html>
      <head>
        <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{post.meta.title} - R-Aizawa Blog</title>
        <meta name="description" content={`${post.meta.title} - R-Aizawa Blog`} />
        <meta property="og:title" content={post.meta.title} />
        <meta property="og:description" content={`${post.meta.title} - R-Aizawa Blog`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://raizawa-blog.pages.dev/posts/${slug}`} />
        <meta property="og:site_name" content="R-Aizawa Blog" />
        <meta name="twitter:card" content="summary" />
        <link rel="alternate" type="application/rss+xml" title="R-Aizawa Blog" href="/feed.xml" />
        <style>{allStyles}</style>
      </head>
      <body>
        <header>
          <a href="/" class="back-link">
            ← トップページに戻る
          </a>
          <h1>{post.meta.title}</h1>
          <div class="post-meta">
            <time>{new Date(post.meta.date).toLocaleDateString("ja-JP")}</time>
            {post.meta.category && (
              <span>
                {" "}
                •{" "}
                <a href={`/category/${post.meta.category}`}>{post.meta.category}</a>
              </span>
            )}
          </div>
          {post.meta.tags.length > 0 && (
            <div class="post-tags">
              {post.meta.tags.map((tag) => (
                <span class="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article dangerouslySetInnerHTML={{ __html: htmlContent }}></article>
      </body>
    </html>,
  );
});
