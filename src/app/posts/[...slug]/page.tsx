import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

const postsDir = path.join(process.cwd(), "posts");

// ✅ 여러 depth 경로를 모두 탐색
export async function generateStaticParams() {
  function getAllFiles(dir: string, parentSlug: string[] = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: { slug: string[] }[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        files.push(...getAllFiles(path.join(dir, entry.name), [...parentSlug, entry.name]));
      } else if (entry.name.endsWith(".md")) {
        files.push({ slug: [...parentSlug, entry.name.replace(/\.md$/, "")] });
      }
    }
    return files;
  }

  return getAllFiles(postsDir);
}

export default function PostPage({ params }: { params: { slug: string[] } }) {
  const filePath = path.join(postsDir, ...params.slug) + ".md";
  if (!fs.existsSync(filePath)) return notFound();

  const file = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(file);

  return (
    <main className="prose mx-auto p-8">
      <h1>{data.title}</h1>
      {data.date && <p className="text-gray-500">{data.date}</p>}
      <ReactMarkdown>{content}</ReactMarkdown>
    </main>
  );
}