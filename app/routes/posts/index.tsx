import { createRoute } from "honox/factory";
import ArticleNav from "../../components/article-nav";
import Layout from "../../components/layout";
import Pagination from "../../components/pagination";
import PostList from "../../components/post-list";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../../lib/config";
import { getPostsForPage, getTotalPages } from "../../lib/posts";

export default createRoute((c) => {
  const currentPage = 1;
  const posts = getPostsForPage(currentPage);
  const totalPages = getTotalPages();

  return c.render(
    <Layout
      title={`ブログ記事一覧 - ${SITE_TITLE}`}
      description={SITE_DESCRIPTION}
      ogUrl={`${SITE_URL}/posts`}
    >
      <ArticleNav />
      <header class="card bg-base-100 shadow-sm mb-6">
        <div class="card-body p-6">
          <h1 class="text-2xl sm:text-3xl font-bold">ブログ記事一覧</h1>
        </div>
      </header>
      <main>
        <PostList posts={posts} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </main>
    </Layout>,
  );
});
