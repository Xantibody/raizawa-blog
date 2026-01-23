import { FAVICON_URL, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../lib/config";
import { getPostsForPage, getTotalPages } from "../lib/posts";
import baseStyles from "../styles/base";
import indexStyles from "../styles/index";

const SECOND_PAGE = 2;

const Pagination = ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => {
  let prevHref = "/";
  if (currentPage !== SECOND_PAGE) {
    prevHref = `/page/${currentPage - 1}`;
  }

  return (
    <div class="pagination">
      {currentPage > 1 && (
        <a href={prevHref} class="pagination-link">
          ← 前のページ
        </a>
      )}
      <span class="pagination-info">
        {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages && (
        <a href={`/page/${currentPage + 1}`} class="pagination-link">
          次のページ →
        </a>
      )}
    </div>
  );
};

export default function Home() {
  const currentPage = 1;
  const posts = getPostsForPage(currentPage);
  const totalPages = getTotalPages();

  return (
    <html>
      <head>
        <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta name="twitter:card" content="summary" />
        <link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/feed.xml" />
        <link rel="icon" href={FAVICON_URL} />
        <style>{baseStyles + indexStyles}</style>
      </head>
      <body>
        <header>
          <h1>{SITE_TITLE}</h1>
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
                  {post.category !== "" && (
                    <span>
                      {" "}
                      • <a href={`/category/${post.category}`}>{post.category}</a>
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
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </main>
      </body>
    </html>
  );
}
