import { getAllPosts } from "../lib/posts";
import baseStyles from "../styles/base";
import indexStyles from "../styles/index";

export default function Home() {
  const posts = getAllPosts();

  return (
    <html>
      <head>
        <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>R-Aizawa Blog</title>
        <meta name="description" content="R-Aizawaの技術ブログ" />
        <meta property="og:title" content="R-Aizawa Blog" />
        <meta property="og:description" content="R-Aizawaの技術ブログ" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://raizawa-blog.pages.dev" />
        <meta property="og:site_name" content="R-Aizawa Blog" />
        <meta name="twitter:card" content="summary" />
        <link rel="alternate" type="application/rss+xml" title="R-Aizawa Blog" href="/feed.xml" />
        <style>{baseStyles + indexStyles}</style>
      </head>
      <body>
        <header>
          <h1>R-Aizawa Blog</h1>
          <div class="links">
            <a href="https://github.com/Xantibody" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://zenn.dev/master_peace_36" target="_blank" rel="noopener noreferrer">
              Zenn
            </a>
          </div>
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
                  {post.category && (
                    <span>
                      {" "}
                      •{" "}
                      <a href={`/category/${post.category}`}>{post.category}</a>
                    </span>
                  )}
                </div>
                {post.tags.length > 0 && (
                  <div class="post-tags">
                    {post.tags.map((tag) => (
                      <a class="tag" key={tag} href={`/tag/${tag}`}>
                        {tag}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
