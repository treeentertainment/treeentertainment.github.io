import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

const postsDir = path.join(process.cwd(), "posts");

export default function PostsPage() {
  const files = fs.readdirSync(postsDir);
  const posts = files
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(postsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title || file,
        date: data.date || "Unknown",
      };
    });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold mb-6">📚 전체 포스트</h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="text-blue-600 hover:underline"
            >
              {post.title} <span className="text-gray-400 text-sm">({post.date})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
