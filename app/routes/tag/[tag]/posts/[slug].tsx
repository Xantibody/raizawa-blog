import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import Layout from "../../../../components/layout";
import { SITE_TITLE, SITE_URL } from "../../../../lib/config";
import { type PostMeta, getAdjacentPosts, getAllPosts, getPostBySlug } from "../../../../lib/posts";

const isValidParam = (param: string | undefined): param is string =>
  param !== undefined && param !== "";

const PrevPostLink = ({ prev, tag }: { prev: PostMeta | undefined; tag: string }) => {
  if (prev === undefined) {
    return <div />;
  }
  return (
    <a
      href={`/tag/${tag}/posts/${prev.slug}`}
      class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div class="card-body p-4">
        <span class="text-xs opacity-60">← 前の記事</span>
        <span class="text-sm font-medium">{prev.title}</span>
      </div>
    </a>
  );
};

const NextPostLink = ({ next, tag }: { next: PostMeta | undefined; tag: string }) => {
  if (next === undefined) {
    return <></>;
  }
  return (
    <a
      href={`/tag/${tag}/posts/${next.slug}`}
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
  next,
  prev,
  tag,
}: {
  next: PostMeta | undefined;
  prev: PostMeta | undefined;
  tag: string;
}) => {
  if (prev === undefined && next === undefined) {
    return <></>;
  }
  return (
    <nav class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-base-300">
      <PrevPostLink prev={prev} tag={tag} />
      <NextPostLink next={next} tag={tag} />
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
    const params: { slug: string; tag: string }[] = [];
    const allPosts = getAllPosts();
    const tags = [...new Set(allPosts.flatMap((post) => post.tags))];

    for (const tag of tags) {
      const posts = allPosts.filter((post) => post.tags.includes(tag));
      for (const post of posts) {
        params.push({ slug: post.slug, tag });
      }
    }

    return params;
  }),
  async (c) => {
    const tag = c.req.param("tag");
    const slug = c.req.param("slug");
    if (!isValidParam(tag) || !isValidParam(slug)) {
      return c.notFound();
    }

    const post = await getPostBySlug(slug);
    if (post === undefined || !post.meta.tags.includes(tag)) {
      return c.notFound();
    }

    const { prev, next } = getAdjacentPosts(slug, { tag });

    return c.render(
      <Layout
        title={`${post.meta.title} - ${SITE_TITLE}`}
        description={`${post.meta.title} - ${SITE_TITLE}`}
        ogType="article"
        ogUrl={`${SITE_URL}/tag/${tag}/posts/${slug}`}
      >
        <header class="card bg-base-100 shadow-sm mb-6">
          <div class="card-body p-6">
            <div class="flex gap-2 flex-wrap">
              <a href="/" class="btn btn-ghost btn-sm gap-1">
                <span>←</span>
                <span>トップ</span>
              </a>
              <a href={`/tag/${tag}`} class="btn btn-ghost btn-sm gap-1">
                <span>←</span>
                <span>{tag}</span>
              </a>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold mt-2">{post.meta.title}</h1>
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
                {post.meta.tags.map((tagName) => (
                  <a
                    class="badge badge-primary badge-outline"
                    key={tagName}
                    href={`/tag/${tagName}`}
                  >
                    {tagName}
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
        <PostNav next={next} prev={prev} tag={tag} />
        <script dangerouslySetInnerHTML={{ __html: copyScript }} />
      </Layout>,
    );
  },
);
