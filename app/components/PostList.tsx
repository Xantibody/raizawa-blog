import type { PostMeta } from "../lib/posts";

type PostListProps = {
  posts: PostMeta[];
};

export const PostList = ({ posts }: PostListProps) => {
  return (
    <ul class="space-y-6">
      {posts.map((post) => (
        <li class="card bg-base-200 shadow-sm" key={post.slug}>
          <div class="card-body p-4">
            <h2 class="card-title">
              <a href={`/posts/${post.slug}`} class="link link-hover">
                {post.title}
              </a>
            </h2>
            <div class="text-sm text-base-content/70">
              <time>{new Date(post.date).toLocaleDateString("ja-JP")}</time>
              {post.category !== "" && (
                <span>
                  {" "}
                  •{" "}
                  <a href={`/category/${post.category}`} class="link">
                    {post.category}
                  </a>
                </span>
              )}
            </div>
            {post.tags.length > 0 && (
              <div class="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag) => (
                  <a class="badge badge-outline" key={tag} href={`/tag/${tag}`}>
                    {tag}
                  </a>
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
