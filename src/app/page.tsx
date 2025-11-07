import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

// posts 폴더 경로
const postsDir = path.join(process.cwd(), "posts");

// ✅ 정적 경로 생성
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

// ✅ 페이지 컴포넌트
interface PostPageProps {
  params: {
    slug: string[]; // /posts/tips/go → ["tips", "go"]
  };
}

export default function PostPage({ params }: PostPageProps) {
  if (!params?.slug) return notFound();

  // posts/tips/go.md 형태의 실제 파일 경로
  const filePath = path.join(postsDir, ...params.slug) + ".md";
  if (!fs.existsSync(filePath)) return notFound();

  const file = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(file);

  return (
    <main className="prose mx-auto p-8">
      <h1>{data.title ?? params.slug.join(" / ")}</h1>
      {data.date && <p className="text-gray-500">{data.date}</p>}
      <ReactMarkdown>{content}</ReactMarkdown>
    </main>
  );
}