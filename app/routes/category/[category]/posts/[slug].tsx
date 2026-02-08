import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import ArticleNav from "../../../../components/article-nav";
import Layout from "../../../../components/layout";
import { SITE_TITLE, SITE_URL } from "../../../../lib/config";
import { type PostMeta, getAdjacentPosts, getAllPosts, getPostBySlug } from "../../../../lib/posts";

const isValidParam = (param: string | undefined): param is string =>
  param !== undefined && param !== "";

const PrevPostLink = ({ prev, category }: { prev: PostMeta | undefined; category: string }) => {
  if (prev === undefined) {
    return <div />;
  }
  return (
    <a
      href={`/category/${category}/posts/${prev.slug}`}
      class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div class="card-body p-4">
        <span class="text-xs opacity-60">← 前の記事</span>
        <span class="text-sm font-medium">{prev.title}</span>
      </div>
    </a>
  );
};

const NextPostLink = ({ next, category }: { next: PostMeta | undefined; category: string }) => {
  if (next === undefined) {
    return <></>;
  }
  return (
    <a
      href={`/category/${category}/posts/${next.slug}`}
      class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow sm:text-right"
    >
      <div class="card-body p-4">
        <span class="text-xs opacity-60">次の記事 →</span>
        <span class="text-sm font-medium">{next.title}</span>
      </div>
    </a>
  );
};

const PostNav = ({
  category,
  next,
  prev,
}: {
  category: string;
  next: PostMeta | undefined;
  prev: PostMeta | undefined;
}) => {
  if (prev === undefined && next === undefined) {
    return <></>;
  }
  return (
    <nav class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-base-300">
      <PrevPostLink prev={prev} category={category} />
      <NextPostLink next={next} category={category} />
    </nav>
  );
};

const copyScript = `document.querySelectorAll('.copy-button').forEach(button => {
  button.addEventListener('click', async () => {
    const pre = button.closest('pre');
    const code = pre.querySelector('code');
    const text = code.innerText.replace(/^\\d+\\s*/gm, '');
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied!';
    button.classList.add('copied');
    setTimeout(() => { button.textContent = 'Copy'; button.classList.remove('copied'); }, 2000);
  });
});`;

export default createRoute(
  ssgParams(() => {
    const params: { category: string; slug: string }[] = [];
    const allPosts = getAllPosts();
    const categories = [...new Set(allPosts.map((post) => post.category))];

    for (const category of categories) {
      const posts = allPosts.filter((post) => post.category === category);
      for (const post of posts) {
        params.push({ category, slug: post.slug });
      }
    }

    return params;
  }),
  async (c) => {
    const category = c.req.param("category");
    const slug = c.req.param("slug");
    if (!isValidParam(category) || !isValidParam(slug)) {
      return c.notFound();
    }

    const post = await getPostBySlug(slug);
    if (post === undefined || post.meta.category !== category) {
      return c.notFound();
    }

    const { prev, next } = getAdjacentPosts(slug, { category });

    return c.render(
      <Layout
        title={`${post.meta.title} - ${SITE_TITLE}`}
        description={`${post.meta.title} - ${SITE_TITLE}`}
        ogType="article"
        ogUrl={`${SITE_URL}/category/${category}/posts/${slug}`}
      >
        <ArticleNav
          breadcrumbs={[
            { href: "/category", label: "カテゴリ一覧" },
            { href: `/category/${category}`, label: category },
          ]}
        />
        <header class="card bg-base-100 shadow-sm mb-6">
          <div class="card-body p-6">
            <h1 class="text-2xl sm:text-3xl font-bold">{post.meta.title}</h1>
            <div class="text-sm opacity-70 mt-1">
              <time>{new Date(post.meta.date).toLocaleDateString("ja-JP")}</time>
              {post.meta.category !== "" && (
                <span>
                  {" "}
                  •{" "}
                  <a href={`/category/${post.meta.category}`} class="link link-hover">
                    {post.meta.category}
                  </a>
                </span>
              )}
            </div>
            {post.meta.tags.length > 0 && (
              <div class="flex flex-wrap gap-2 mt-3">
                {post.meta.tags.map((tag) => (
                  <a class="badge badge-primary badge-outline" key={tag} href={`/tag/${tag}`}>
                    {tag}
                  </a>
                ))}
              </div>
            )}
          </div>
        </header>

        <article class="card bg-base-100 shadow-sm">
          <div
            class="card-body p-6 prose-article"
            dangerouslySetInnerHTML={{ __html: post.html }}
          ></div>
        </article>
        <PostNav category={category} next={next} prev={prev} />
        <script dangerouslySetInnerHTML={{ __html: copyScript }} />
      </Layout>,
    );
  },
);
