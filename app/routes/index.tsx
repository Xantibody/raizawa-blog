import { createRoute } from "honox/factory";
import Header from "../components/header";
import Layout from "../components/layout";
import Pagination from "../components/pagination";
import PostList from "../components/post-list";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../lib/config";
import { getPostsForPage, getTotalPages } from "../lib/posts";

export default createRoute((c) => {
  const currentPage = 1;
  const posts = getPostsForPage(currentPage);
  const totalPages = getTotalPages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: SITE_DESCRIPTION,
    name: SITE_TITLE,
    url: SITE_URL,
  };

  return c.render(
    <Layout title={SITE_TITLE} description={SITE_DESCRIPTION} ogUrl={SITE_URL} jsonLd={jsonLd}>
      <Header />
      <main>
        <PostList posts={posts} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </main>
    </Layout>,
  );
});
