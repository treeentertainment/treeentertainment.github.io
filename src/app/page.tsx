import fs from "fs";
import path from "path";
import Link from "next/link";

const postsDir = path.join(process.cwd(), "posts");

function getAllPosts(dir: string, parent: string[] = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const links: { title: string; slug: string }[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      links.push(...getAllPosts(path.join(dir, entry.name), [...parent, entry.name]));
    } else if (entry.name.endsWith(".md")) {
      const slug = [...parent, entry.name.replace(/\.md$/, "")].join("/");
      links.push({ title: slug, slug });
    }
  }

  return links;
}

export default function PostsPage() {
  const posts = getAllPosts(postsDir);

  return (
    <main className="prose mx-auto p-8">
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}