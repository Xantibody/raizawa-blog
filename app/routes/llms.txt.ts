import { createRoute } from "honox/factory";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../lib/config";
import { HTTP_OK } from "../lib/http";
import { getAllPosts } from "../lib/posts";

export default createRoute((c) => {
  const posts = getAllPosts();

  const lines = [
    `# ${SITE_TITLE}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `- [Full content](${SITE_URL}/llms-full.txt)`,
    "",
    "## Blog Posts",
    "",
  ];

  for (const post of posts) {
    lines.push(`- [${post.title}](${SITE_URL}/posts/${post.slug}): ${post.date}, ${post.category}`);
  }

  lines.push("");

  return c.body(lines.join("\n"), HTTP_OK, {
    "Content-Type": "text/plain; charset=utf-8",
  });
});
