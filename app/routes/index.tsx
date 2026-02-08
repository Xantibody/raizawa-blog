import { createRoute } from "honox/factory";
import { Link } from "honox/server";
import { FAVICON_URL, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../lib/config";
import { getPostsForPage, getTotalPages } from "../lib/posts";

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
    <div class="join mt-8 pt-6 border-t border-base-300 flex justify-center">
      {currentPage > 1 && (
        <a href={prevHref} class="join-item btn">
          «
        </a>
      )}
      {pageNumbers.map((pageNum, index) => {
        if (pageNum === "...") {
          return (
            <span key={`ellipsis-${index}`} class="join-item btn btn-disabled">
              ...
            </span>
          );
        }
        const pageNumber = Number(pageNum);
        if (pageNumber === currentPage) {
          return (
            <span key={pageNumber} class="join-item btn btn-active">
              {pageNumber}
            </span>
          );
        }
        return (
          <a key={pageNumber} href={getPageHref(pageNumber)} class="join-item btn">
            {pageNumber}
          </a>
        );
      })}
      {currentPage < totalPages && (
        <a href={`/page/${currentPage + 1}`} class="join-item btn">
          »
        </a>
      )}
    </div>
  );
};

export default createRoute((c) => {
  const currentPage = 1;
  const posts = getPostsForPage(currentPage);
  const totalPages = getTotalPages();

  return c.render(
    <html data-theme="light">
      <head>
        <meta charSet="utf-8" />
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
        <Link href="/app/style.css" rel="stylesheet" />
      </head>
      <body class="min-h-screen bg-base-100">
        <div class="container mx-auto max-w-3xl px-4 py-8">
          <header class="border-b-2 border-base-content pb-4 mb-8">
            <h1 class="text-3xl font-bold">{SITE_TITLE}</h1>
            <div class="flex gap-4 mt-2">
              <a
                href="https://github.com/Xantibody"
                target="_blank"
                rel="noopener noreferrer"
                class="link link-primary"
              >
                GitHub
              </a>
              <a
                href="https://zenn.dev/master_peace_36"
                target="_blank"
                rel="noopener noreferrer"
                class="link link-primary"
              >
                Zenn
              </a>
            </div>
          </header>

          <main>
            <ul class="space-y-6">
              {posts.map((post) => (
                <li class="card bg-base-200 shadow-sm" key={post.slug}>
                  <div class="card-body p-4">
                    <h2 class="card-title">
                      <a href={`/posts/${post.slug}`} class="link link-hover">
                        {post.title}
                      </a>
                    </h2>
                    <div class="text-sm text-base-content/70">
                      <time>{new Date(post.date).toLocaleDateString("ja-JP")}</time>
                      {post.category !== "" && (
                        <span>
                          {" "}
                          •{" "}
                          <a href={`/category/${post.category}`} class="link">
                            {post.category}
                          </a>
                        </span>
                      )}
                    </div>
                    {post.tags.length > 0 && (
                      <div class="flex flex-wrap gap-2 mt-2">
                        {post.tags.map((tag) => (
                          <a class="badge badge-outline" key={tag} href={`/tag/${tag}`}>
                            {tag}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </main>
        </div>
      </body>
    </html>,
  );
});
