import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { BookIcon, FileIcon, FileDirectoryIcon } from "@primer/octicons-react";

const postsDir = path.join(process.cwd(), "posts");

// Server component only (no "use client")
export default function AllPostsPage() {
  const entries = fs.readdirSync(postsDir, { withFileTypes: true });

  // Posts without categories
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

  // Posts by category
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

  // Render
  return (
    <div className="prose mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BookIcon size={24} />
        모든 글
      </h1>

      {rootPosts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FileIcon size={16} />
            카테고리 없는 글
          </h2>
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
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FileDirectoryIcon size={16} />
            {category}
          </h2>
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
