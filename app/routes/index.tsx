import { getAllPosts } from '../lib/posts'

export default function Home() {
  const posts = getAllPosts()

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
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
        <style>{`
          body {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
          }
          header {
            border-bottom: 2px solid #333;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
          }
          h1 {
            margin: 0 0 0.5rem 0;
          }
          .links {
            display: flex;
            gap: 1rem;
          }
          .links a {
            text-decoration: none;
            color: #0066cc;
          }
          .links a:hover {
            text-decoration: underline;
          }
          .posts {
            list-style: none;
            padding: 0;
          }
          .post-item {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
          }
          .post-item:last-child {
            border-bottom: none;
          }
          .post-title {
            font-size: 1.5rem;
            margin: 0 0 0.5rem 0;
          }
          .post-title a {
            color: #333;
            text-decoration: none;
          }
          .post-title a:hover {
            color: #0066cc;
          }
          .post-meta {
            color: #666;
            font-size: 0.9rem;
          }
          .post-tags {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }
          .tag {
            background: #f0f0f0;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.85rem;
          }
        `}</style>
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
                  <time>{new Date(post.date).toLocaleDateString('ja-JP')}</time>
                  {post.categories && post.categories.length > 0 && (
                    <span> • {post.categories.join(', ')}</span>
                  )}
                </div>
                {post.tags && post.tags.length > 0 && (
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
    </html>
  )
}
