import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import ArticleNav from "../../components/article-nav";
import Layout from "../../components/layout";
import { SITE_TITLE, SITE_URL } from "../../lib/config";
import { getPostsByTag, getTags } from "../../lib/posts";

export default createRoute(
  ssgParams(() => getTags().map((tag) => ({ tag }))),
  (c) => {
    const tag = c.req.param("tag");
    if (tag === undefined || tag === "") {
      return c.notFound();
    }

    const posts = getPostsByTag(tag);
    if (posts.length === 0) {
      return c.notFound();
    }

    return c.render(
      <Layout
        title={`${tag} - ${SITE_TITLE}`}
        description={`${tag}の記事一覧`}
        ogUrl={`${SITE_URL}/tag/${tag}`}
      >
        <ArticleNav breadcrumbs={[{ href: "/tag", label: "タグ一覧" }]} />
        <header class="card bg-base-100 shadow-sm mb-6">
          <div class="card-body p-6">
            <h1 class="text-2xl sm:text-3xl font-bold">{tag}</h1>
          </div>
        </header>

        <main>
          <ul class="space-y-4">
            {posts.map((post) => (
              <li class="card bg-base-100 shadow-sm" key={post.slug}>
                <div class="card-body p-4">
                  <h2 class="card-title">
                    <a href={`/tag/${tag}/posts/${post.slug}`} class="link link-hover">
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
                </div>
              </li>
            ))}
          </ul>
        </main>
      </Layout>,
    );
  },
);
