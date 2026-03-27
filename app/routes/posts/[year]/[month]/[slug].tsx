import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import PostDetail from "../../../../components/post-detail";
import { SITE_URL } from "../../../../lib/config";
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  isValidParam,
  parseSlugParts,
} from "../../../../lib/posts";

const buildFullSlug = (params: {
  month: string | undefined;
  slug: string | undefined;
  year: string | undefined;
}): string | undefined => {
  if (!isValidParam(params.year) || !isValidParam(params.month) || !isValidParam(params.slug)) {
    return undefined;
  }
  return `${params.year}/${params.month}/${params.slug}`;
};

export default createRoute(
  ssgParams(() =>
    getAllPosts().map((post) => {
      const { year, month, slug } = parseSlugParts(post.slug);
      return { month, slug, year };
    }),
  ),
  async (c) => {
    const fullSlug = buildFullSlug({
      month: c.req.param("month"),
      slug: c.req.param("slug"),
      year: c.req.param("year"),
    });
    if (fullSlug === undefined) {
      return c.notFound();
    }

    const post = await getPostBySlug(fullSlug);
    if (post === undefined) {
      return c.notFound();
    }

    const { prev, next } = getAdjacentPosts(fullSlug);

    return c.render(
      <PostDetail
        post={post}
        prev={prev}
        next={next}
        linkPrefix="/posts/"
        ogUrl={`${SITE_URL}/posts/${fullSlug}`}
      />,
    );
  },
);
