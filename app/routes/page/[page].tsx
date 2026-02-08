import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { Pagination } from "../../components/Pagination";
import { PostList } from "../../components/PostList";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../../lib/config";
import { getPostsForPage, getTotalPages } from "../../lib/posts";

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
        title={`${SITE_TITLE} - ページ ${currentPage}`}
        description={SITE_DESCRIPTION}
        ogUrl={`${SITE_URL}/page/${currentPage}`}
      >
        <Header />
        <main>
          <PostList posts={posts} />
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </main>
      </Layout>,
    );
  },
);
