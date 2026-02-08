import { createRoute } from "honox/factory";
import { Header } from "../components/Header";
import { Layout } from "../components/Layout";
import { Pagination } from "../components/Pagination";
import { PostList } from "../components/PostList";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../lib/config";
import { getPostsForPage, getTotalPages } from "../lib/posts";

export default createRoute((c) => {
  const currentPage = 1;
  const posts = getPostsForPage(currentPage);
  const totalPages = getTotalPages();

  return c.render(
    <Layout title={SITE_TITLE} description={SITE_DESCRIPTION} ogUrl={SITE_URL}>
      <Header />
      <main>
        <PostList posts={posts} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </main>
    </Layout>,
  );
});
