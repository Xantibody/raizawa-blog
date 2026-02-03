import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { FAVICON_URL, SITE_TITLE, SITE_URL } from "../../../../lib/config";
import { type PostMeta, getAdjacentPosts, getAllPosts, getPostBySlug } from "../../../../lib/posts";
import { allPostStyles } from "../../../../styles/post";

const isValidParam = (param: string | undefined): param is string =>
  param !== undefined && param !== "";

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
    <nav class="post-nav">
      {prev === undefined && <span />}
      {prev !== undefined && (
        <a href={`/tag/${tag}/posts/${prev.slug}`} class="post-nav-prev">
          ← {prev.title}
        </a>
      )}
      {next !== undefined && (
        <a href={`/tag/${tag}/posts/${next.slug}`} class="post-nav-next">
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
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>
            {post.meta.title} - {SITE_TITLE}
          </title>
          <meta name="description" content={`${post.meta.title} - ${SITE_TITLE}`} />
          <meta property="og:title" content={post.meta.title} />
          <meta property="og:description" content={`${post.meta.title} - ${SITE_TITLE}`} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`${SITE_URL}/tag/${tag}/posts/${slug}`} />
          <meta property="og:site_name" content={SITE_TITLE} />
          <meta name="twitter:card" content="summary" />
          <link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/feed.xml" />
          <link rel="icon" href={FAVICON_URL} />
          <style>{allPostStyles}</style>
        </head>
        <body>
          <header>
            <div class="back-links">
              <a href="/" class="back-link">
                ← トップページ
              </a>
              <a href={`/tag/${tag}`} class="back-link">
                ← {tag}
              </a>
            </div>
            <h1>{post.meta.title}</h1>
            <div class="post-meta">
              <time>{new Date(post.meta.date).toLocaleDateString("ja-JP")}</time>
              {post.meta.category !== "" && (
                <span>
                  {" "}
                  • <a href={`/category/${post.meta.category}`}>{post.meta.category}</a>
                </span>
              )}
            </div>
            {post.meta.tags.length > 0 && (
              <div class="post-tags">
                {post.meta.tags.map((tagName) => (
                  <a class="tag" key={tagName} href={`/tag/${tagName}`}>
                    {tagName}
                  </a>
                ))}
              </div>
            )}
          </header>

          <article dangerouslySetInnerHTML={{ __html: post.html }}></article>
          <PostNav next={next} prev={prev} tag={tag} />
          <script dangerouslySetInnerHTML={{ __html: copyScript }} />
        </body>
      </html>,
    );
  },
);
