import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import PostDetail from "../../../../../../components/post-detail";
import { SITE_URL } from "../../../../../../lib/config";
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  isValidParam,
  parseSlugParts,
} from "../../../../../../lib/posts";

const validateParams = (params: {
  month: string | undefined;
  slug: string | undefined;
  tag: string | undefined;
  year: string | undefined;
}): { fullSlug: string; tag: string } | undefined => {
  if (
    !isValidParam(params.tag) ||
    !isValidParam(params.year) ||
    !isValidParam(params.month) ||
    !isValidParam(params.slug)
  ) {
    return undefined;
  }
  return { fullSlug: `${params.year}/${params.month}/${params.slug}`, tag: params.tag };
};

export default createRoute(
  ssgParams(() => {
    const params: { month: string; slug: string; tag: string; year: string }[] = [];
    const allPosts = getAllPosts();
    const tags = [...new Set(allPosts.flatMap((post) => post.tags))];

    for (const tag of tags) {
      const posts = allPosts.filter((post) => post.tags.includes(tag));
      for (const post of posts) {
        params.push({ tag, ...parseSlugParts(post.slug) });
      }
    }

    return params;
  }),
  async (c) => {
    const validated = validateParams({
      month: c.req.param("month"),
      slug: c.req.param("slug"),
      tag: c.req.param("tag"),
      year: c.req.param("year"),
    });
    if (validated === undefined) {
      return c.notFound();
    }

    const { fullSlug, tag } = validated;
    const post = await getPostBySlug(fullSlug);
    if (post === undefined || !post.meta.tags.includes(tag)) {
      return c.notFound();
    }

    const { prev, next } = getAdjacentPosts(fullSlug, { tag });

    return c.render(
      <PostDetail
        post={post}
        prev={prev}
        next={next}
        linkPrefix={`/tag/${tag}/posts/`}
        ogUrl={`${SITE_URL}/tag/${tag}/posts/${fullSlug}`}
      />,
    );
  },
);
