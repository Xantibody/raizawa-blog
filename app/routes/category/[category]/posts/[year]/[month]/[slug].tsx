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
  category: string | undefined;
  month: string | undefined;
  slug: string | undefined;
  year: string | undefined;
}): { category: string; fullSlug: string } | undefined => {
  if (
    !isValidParam(params.category) ||
    !isValidParam(params.year) ||
    !isValidParam(params.month) ||
    !isValidParam(params.slug)
  ) {
    return undefined;
  }
  return { category: params.category, fullSlug: `${params.year}/${params.month}/${params.slug}` };
};

export default createRoute(
  ssgParams(() => {
    const params: { category: string; month: string; slug: string; year: string }[] = [];
    const allPosts = getAllPosts();
    const categories = [...new Set(allPosts.map((post) => post.category))];

    for (const category of categories) {
      const posts = allPosts.filter((post) => post.category === category);
      for (const post of posts) {
        params.push({ category, ...parseSlugParts(post.slug) });
      }
    }

    return params;
  }),
  async (c) => {
    const validated = validateParams({
      category: c.req.param("category"),
      month: c.req.param("month"),
      slug: c.req.param("slug"),
      year: c.req.param("year"),
    });
    if (validated === undefined) {
      return c.notFound();
    }

    const { category, fullSlug } = validated;
    const post = await getPostBySlug(fullSlug);
    if (post === undefined || post.meta.category !== category) {
      return c.notFound();
    }

    const { prev, next } = getAdjacentPosts(fullSlug, { category });

    return c.render(
      <PostDetail
        post={post}
        prev={prev}
        next={next}
        linkPrefix={`/category/${category}/posts/`}
        ogUrl={`${SITE_URL}/category/${category}/posts/${fullSlug}`}
      />,
    );
  },
);
