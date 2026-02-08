import { createRoute } from "honox/factory";
import { Layout } from "../../components/Layout";
import { SITE_TITLE, SITE_URL } from "../../lib/config";
import { getCategories, getPostsByCategory } from "../../lib/posts";

export default createRoute((c) => {
  const categories = getCategories();

  return c.render(
    <Layout title={`カテゴリ一覧 - ${SITE_TITLE}`} description="カテゴリ一覧" ogUrl={`${SITE_URL}/category`}>
      <header class="mb-8">
        <a href="/" class="link link-primary">
          ← トップページに戻る
        </a>
        <h1 class="text-3xl font-bold mt-2">カテゴリ一覧</h1>
      </header>

      <main>
        <ul class="space-y-4">
          {categories.map((category) => {
            const posts = getPostsByCategory(category);
            return (
              <li class="card bg-base-200 shadow-sm" key={category}>
                <div class="card-body p-4">
                  <h2 class="card-title">
                    <a href={`/category/${category}`} class="link link-hover">
                      {category}
                    </a>
                  </h2>
                  <div class="text-sm text-base-content/70">{posts.length}件の記事</div>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </Layout>,
  );
});
