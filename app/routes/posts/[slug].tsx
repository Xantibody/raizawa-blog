import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { Layout } from "../../components/Layout";
import { SITE_TITLE, SITE_URL } from "../../lib/config";
import { type PostMeta, getAdjacentPosts, getAllPosts, getPostBySlug } from "../../lib/posts";

const PostNav = ({ next, prev }: { next: PostMeta | undefined; prev: PostMeta | undefined }) => {
  if (prev === undefined && next === undefined) {
    return <></>;
  }
  return (
    <nav class="post-nav">
      {prev === undefined && <span />}
      {prev !== undefined && (
        <a href={`/posts/${prev.slug}`} class="post-nav-prev">
          ← {prev.title}
        </a>
      )}
      {next !== undefined && (
        <a href={`/posts/${next.slug}`} class="post-nav-next">
          {next.title} →
        </a>
      )}
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
  ssgParams(() => getAllPosts().map((post) => ({ slug: post.slug }))),
  async (c) => {
    const slug = c.req.param("slug");
    if (slug === undefined || slug === "") {
      return c.notFound();
    }

    const post = await getPostBySlug(slug);
    if (post === undefined) {
      return c.notFound();
    }

    const htmlContent = post.html;
    const { prev, next } = getAdjacentPosts(slug);

    return c.render(
      <Layout
        title={`${post.meta.title} - ${SITE_TITLE}`}
        description={`${post.meta.title} - ${SITE_TITLE}`}
        ogType="article"
        ogUrl={`${SITE_URL}/posts/${slug}`}
      >
        <header class="mb-8">
          <a href="/" class="link link-primary">
            ← トップページに戻る
          </a>
          <h1 class="text-3xl font-bold mt-2">{post.meta.title}</h1>
          <div class="text-sm text-base-content/70 mt-2">
            <time>{new Date(post.meta.date).toLocaleDateString("ja-JP")}</time>
            {post.meta.category !== "" && (
              <span>
                {" "}
                •{" "}
                <a href={`/category/${post.meta.category}`} class="link">
                  {post.meta.category}
                </a>
              </span>
            )}
          </div>
          {post.meta.tags.length > 0 && (
            <div class="flex flex-wrap gap-2 mt-2">
              {post.meta.tags.map((tag) => (
                <a class="badge badge-outline" key={tag} href={`/tag/${tag}`}>
                  {tag}
                </a>
              ))}
            </div>
          )}
        </header>

        <article class="prose-article" dangerouslySetInnerHTML={{ __html: htmlContent }}></article>
        <PostNav next={next} prev={prev} />
        <script dangerouslySetInnerHTML={{ __html: copyScript }} />
      </Layout>,
    );
  },
);
