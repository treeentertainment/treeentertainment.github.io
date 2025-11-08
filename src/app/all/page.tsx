import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

const postsDir = path.join(process.cwd(), "posts");

// ✅ 서버 컴포넌트로만 동작하도록 (use client 없음)
export default function AllPostsPage() {
  const entries = fs.readdirSync(postsDir, { withFileTypes: true });

  // 📄 카테고리 없는 글
  const rootPosts = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(postsDir, file.name);
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);

      return {
        title: data.title || file.name.replace(/\.md$/, ""),
        slug: file.name.replace(/\.md$/, ""),
      };
    });

  // 📂 카테고리별 글
  const categoryPosts = entries
    .filter((entry) => entry.isDirectory())
    .map((dir) => {
      const files = fs
        .readdirSync(path.join(postsDir, dir.name))
        .filter((f) => f.endsWith(".md"));

      const posts = files.map((f) => {
        const filePath = path.join(postsDir, dir.name, f);
        const content = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(content);

        return {
          title: data.title || f.replace(/\.md$/, ""),
          slug: `${dir.name}/${f.replace(/\.md$/, "")}`,
        };
      });

      return { category: dir.name, posts };
    });

  // 📜 렌더링
  return (
    <div className="prose mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📰 모든 글</h1>

      {rootPosts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">📄 카테고리 없는 글</h2>
          <ul className="list-disc pl-6">
            {rootPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/${post.slug}`} className="text-blue-600 hover:underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {categoryPosts.map(({ category, posts }) => (
        <section key={category} className="mb-8">
          <h2 className="text-lg font-semibold mb-2">📂 {category}</h2>
          <ul className="list-disc pl-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/${post.slug}`} className="text-blue-600 hover:underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
