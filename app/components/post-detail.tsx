import { type Post, type PostMeta } from "../lib/posts";
import { SITE_TITLE, SITE_URL } from "../lib/config";
import Layout from "./layout";
import { TocLayout, shouldShowToc } from "./toc";
import UpdatedAt from "./updated-at";

const copyScript = `document.querySelectorAll('.copy-button').forEach(button => {
  button.addEventListener('click', async () => {
    const wrapper = button.closest('.code-block-wrapper');
    const code = wrapper.querySelector('code');
    const text = code.innerText.replace(/^\\d+\\s*/gm, '');
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied!';
    button.classList.add('copied');
    setTimeout(() => { button.textContent = 'Copy'; button.classList.remove('copied'); }, 2000);
  });
});`;

const PrevPostLink = ({ linkPrefix, prev }: { linkPrefix: string; prev: PostMeta | undefined }) => {
  if (prev === undefined) {
    return <div />;
  }
  return (
    <a
      href={`${linkPrefix}${prev.slug}`}
      class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div class="card-body p-4">
        <span class="text-xs opacity-60">← 前の記事</span>
        <span class="text-sm font-medium">{prev.title}</span>
      </div>
    </a>
  );
};

const NextPostLink = ({ linkPrefix, next }: { linkPrefix: string; next: PostMeta | undefined }) => {
  if (next === undefined) {
    return <></>;
  }
  return (
    <a
      href={`${linkPrefix}${next.slug}`}
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
  linkPrefix,
  next,
  prev,
}: {
  linkPrefix: string;
  next: PostMeta | undefined;
  prev: PostMeta | undefined;
}) => {
  if (prev === undefined && next === undefined) {
    return <></>;
  }
  return (
    <nav class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-base-300">
      <PrevPostLink prev={prev} linkPrefix={linkPrefix} />
      <NextPostLink next={next} linkPrefix={linkPrefix} />
    </nav>
  );
};

const PostHeader = ({ meta }: { meta: PostMeta }) => (
  <header class="card bg-base-100 shadow-sm mb-6">
    <div class="card-body p-6">
      <h1 class="text-2xl sm:text-3xl font-bold">{meta.title}</h1>
      <div class="text-sm opacity-70 mt-1">
        <time>{new Date(meta.createdAt).toLocaleDateString("ja-JP")}</time>
        <UpdatedAt createdAt={meta.createdAt} updatedAt={meta.updatedAt} />
        {meta.category !== "" && (
          <span>
            {" "}
            •{" "}
            <a href={`/category/${meta.category}`} class="link link-hover">
              {meta.category}
            </a>
          </span>
        )}
      </div>
      {meta.tags.length > 0 && (
        <div class="flex flex-wrap gap-2 mt-3">
          {meta.tags.map((tag) => (
            <a class="badge badge-primary badge-outline" key={tag} href={`/tag/${tag}`}>
              {tag}
            </a>
          ))}
        </div>
      )}
    </div>
  </header>
);

interface PostDetailProps {
  linkPrefix: string;
  next: PostMeta | undefined;
  ogUrl: string;
  post: Post;
  prev: PostMeta | undefined;
}

const PostDetail = ({ linkPrefix, next, ogUrl, post, prev }: PostDetailProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: { "@type": "Person", name: "r-aizawa" },
    dateModified: post.meta.updatedAt,
    datePublished: post.meta.createdAt,
    headline: post.meta.title,
    url: `${SITE_URL}/posts/${post.meta.slug}`,
  };

  return (
    <Layout
      title={`${post.meta.title} - ${SITE_TITLE}`}
      description={`${post.meta.title} - ${SITE_TITLE}`}
      ogType="article"
      ogUrl={ogUrl}
      jsonLd={jsonLd}
      wide={shouldShowToc(post.toc)}
    >
      <TocLayout items={post.toc}>
        <PostHeader meta={post.meta} />
        <article class="card bg-base-100 shadow-sm">
          <div
            class="card-body p-6 prose-article"
            dangerouslySetInnerHTML={{ __html: post.html }}
          ></div>
        </article>
        <PostNav linkPrefix={linkPrefix} next={next} prev={prev} />
      </TocLayout>
      <script dangerouslySetInnerHTML={{ __html: copyScript }} />
    </Layout>
  );
};

export default PostDetail;
