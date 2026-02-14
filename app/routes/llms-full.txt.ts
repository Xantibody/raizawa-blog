import { createRoute } from "honox/factory";
import { SITE_DESCRIPTION, SITE_TITLE } from "../lib/config";
import { HTTP_OK } from "../lib/http";
import { type Post, getAllPosts, getPostBySlug } from "../lib/posts";

const formatPost = (post: Post): string => {
  const meta = [
    `## ${post.meta.title}`,
    "",
    `- date: ${post.meta.date}`,
    `- category: ${post.meta.category}`,
  ];

  if (post.meta.tags.length > 0) {
    meta.push(`- tags: ${post.meta.tags.join(", ")}`);
  }

  meta.push("", post.content.trim());

  return meta.join("\n");
};

export default createRoute(async (c) => {
  const postsMeta = getAllPosts();
  const posts = await Promise.all(postsMeta.map((meta) => getPostBySlug(meta.slug)));
  const validPosts = posts.filter((post): post is Post => post !== undefined);

  const header = `# ${SITE_TITLE}\n\n> ${SITE_DESCRIPTION}`;
  const body = validPosts.map((post) => formatPost(post)).join("\n\n---\n\n");

  return c.body(`${header}\n\n---\n\n${body}\n`, HTTP_OK, {
    "Content-Type": "text/plain; charset=utf-8",
  });
});
