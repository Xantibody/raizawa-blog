import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { FAVICON_URL, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../../lib/config";
import { getPostsForPage, getTotalPages } from "../../lib/posts";
import baseStyles from "../../styles/base";
import indexStyles from "../../styles/index";

const SECOND_PAGE = 2;
const FIRST_PAGE = 1;

const Pagination = ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => {
  let prevHref = "/";
  if (currentPage !== SECOND_PAGE) {
    prevHref = `/page/${currentPage - 1}`;
  }

  const getPageHref = (page: number): string => {
    if (page === FIRST_PAGE) {
      return "/";
    }
    return `/page/${page}`;
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showRange = 1;

    for (let pageNum = FIRST_PAGE; pageNum <= totalPages; pageNum++) {
      const isFirst = pageNum === FIRST_PAGE;
      const isLast = pageNum === totalPages;
      const isNearCurrent = Math.abs(pageNum - currentPage) <= showRange;

      if (isFirst || isLast || isNearCurrent) {
        pages.push(pageNum);
      } else if (pages.at(-1) !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div class="pagination">
      <div class="pagination-prev">
        {currentPage > 1 && (
          <a href={prevHref} class="pagination-link">
            ← 前のページ
          </a>
        )}
      </div>
      <div class="pagination-numbers">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <span key={`ellipsis-${index}`} class="pagination-ellipsis">
                ...
              </span>
            );
          }
          // After filtering "...", pageNum is guaranteed to be a number
          const pageNumber = Number(pageNum);
          if (pageNumber === currentPage) {
            return (
              <span key={pageNumber} class="pagination-number pagination-current">
                {pageNumber}
              </span>
            );
          }
          return (
            <a key={pageNumber} href={getPageHref(pageNumber)} class="pagination-number">
              {pageNumber}
            </a>
          );
        })}
      </div>
      <div class="pagination-next">
        {currentPage < totalPages && (
          <a href={`/page/${currentPage + 1}`} class="pagination-link">
            次のページ →
          </a>
        )}
      </div>
    </div>
  );
};

export default createRoute(
  ssgParams(() => {
    const totalPages = getTotalPages();
    const pages = [];
    for (let pageNum = SECOND_PAGE; pageNum <= totalPages; pageNum++) {
      pages.push({ page: String(pageNum) });
    }
    return pages;
  }),
  (c) => {
    const pageParam = c.req.param("page");
    const currentPage = Number.parseInt(pageParam ?? "1", 10);
    const totalPages = getTotalPages();

    if (Number.isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
      return c.notFound();
    }

    const posts = getPostsForPage(currentPage);

    return c.render(
      <html>
        <head>
          <meta charSet="utf8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>
            {SITE_TITLE} - ページ {currentPage}
          </title>
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
      </html>,
    );
  },
);
