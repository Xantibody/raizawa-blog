import { type PostMeta } from "../lib/posts";

interface PostListProps {
  posts: PostMeta[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <ul class="space-y-4">
      {posts.map((post) => (
        <li class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow" key={post.slug}>
          <div class="card-body p-5">
            <h2 class="card-title text-lg">
              <a href={`/posts/${post.slug}`} class="hover:text-primary transition-colors">
                {post.title}
              </a>
            </h2>
            <div class="text-sm opacity-70 flex items-center gap-2">
              <time>{new Date(post.date).toLocaleDateString("ja-JP")}</time>
              {post.category !== "" && (
                <>
                  <span class="divider divider-horizontal mx-0"></span>
                  <a href={`/category/${post.category}`} class="link link-hover">
                    {post.category}
                  </a>
                </>
              )}
            </div>
            {post.tags.length > 0 && (
              <div class="card-actions justify-start mt-2">
                {post.tags.map((tag) => (
                  <a
                    class="badge badge-outline badge-sm hover:badge-primary"
                    key={tag}
                    href={`/tag/${tag}`}
                  >
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
}
