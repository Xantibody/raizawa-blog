import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import Layout from "../../../components/layout";
import Pagination from "../../../components/pagination";
import PostList from "../../../components/post-list";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../../../lib/config";
import { getPostsForPage, getTotalPages } from "../../../lib/posts";

const SECOND_PAGE = 2;

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
      <Layout
        title={`ブログ記事一覧 - ページ ${currentPage} - ${SITE_TITLE}`}
        description={SITE_DESCRIPTION}
        ogUrl={`${SITE_URL}/posts/page/${currentPage}`}
      >
        <header class="card bg-base-100 shadow-sm mb-6">
          <div class="card-body p-6">
            <h1 class="text-2xl sm:text-3xl font-bold">ブログ記事一覧 - ページ {currentPage}</h1>
          </div>
        </header>
        <main>
          <PostList posts={posts} />
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </main>
      </Layout>,
    );
  },
);
