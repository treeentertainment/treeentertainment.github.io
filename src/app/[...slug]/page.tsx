import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

const postsDir = path.join(process.cwd(), "posts");

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

interface PostPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const filePath = path.join(postsDir, ...resolvedParams.slug) + ".md";
  if (!fs.existsSync(filePath)) return notFound();

  const file = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(file);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <article className="prose prose-lg dark:prose-invert">
        <h1>{data.title ?? resolvedParams.slug.join(" / ")}</h1>
        {data.date && <p className="text-gray-500">{data.date}</p>}
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
