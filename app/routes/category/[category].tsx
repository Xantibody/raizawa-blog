import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import Layout from "../../components/layout";
import { SITE_TITLE, SITE_URL } from "../../lib/config";
import { getCategories, getPostsByCategory } from "../../lib/posts";

export default createRoute(
  ssgParams(() => getCategories().map((category) => ({ category }))),
  (c) => {
    const category = c.req.param("category");
    if (category === undefined || category === "") {
      return c.notFound();
    }

    const posts = getPostsByCategory(category);
    if (posts.length === 0) {
      return c.notFound();
    }

    return c.render(
      <Layout
        title={`${category} - ${SITE_TITLE}`}
        description={`${category}の記事一覧`}
        ogUrl={`${SITE_URL}/category/${category}`}
      >
        <header class="mb-8">
          <a href="/" class="link link-primary">
            ← トップページに戻る
          </a>
          <h1 class="text-3xl font-bold mt-2">{category}</h1>
        </header>

        <main>
          <ul class="space-y-4">
            {posts.map((post) => (
              <li class="card bg-base-200 shadow-sm" key={post.slug}>
                <div class="card-body p-4">
                  <h2 class="card-title">
                    <a href={`/category/${category}/posts/${post.slug}`} class="link link-hover">
                      {post.title}
                    </a>
                  </h2>
                  <div class="text-sm text-base-content/70">
                    <time>{new Date(post.date).toLocaleDateString("ja-JP")}</time>
                  </div>
                  {post.tags.length > 0 && (
                    <div class="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag) => (
                        <span class="badge badge-outline" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </main>
      </Layout>,
    );
  },
);
