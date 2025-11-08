import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";

const postsDir = path.join(process.cwd(), "posts");

// 🔍 모든 하위 폴더 재귀적으로 탐색
function getAllMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? getAllMarkdownFiles(fullPath) : [fullPath];
  });
  return files.filter((f) => f.endsWith(".md"));
}

// ✅ 정적 경로 생성 (모든 태그 페이지 미리 생성)
export async function generateStaticParams() {
  const files = getAllMarkdownFiles(postsDir);
  const tagSet = new Set<string>();

  // 모든 파일의 태그 수집
  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const { data } = matter(content);
    if (Array.isArray(data.tags)) {
      for (const tag of data.tags) {
        tagSet.add(encodeURIComponent(tag)); // URL용 인코딩
      }
    }
  }

  // 정적 경로 리턴
  return Array.from(tagSet).map((tag) => ({
    tag,
  }));
}

// ✅ 페이지 렌더링
export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const files = getAllMarkdownFiles(postsDir);

  // front matter 읽기
  const posts = files
    .map((filePath) => {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      const slug = path
        .relative(postsDir, filePath)
        .replace(/\\/g, "/")
        .replace(/\.md$/, "");

      return {
        title: data.title || "제목 없음",
        date: data.date || null,
        description: data.description || "",
        tags: data.tags || [],
        slug,
      };
    })
    .filter((post) => post.tags?.includes(decodedTag));

  if (posts.length === 0) return notFound();

  return (
    <section className="prose mx-auto p-6">
      <h1 className="mb-6">#{decodedTag}</h1>

      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-neutral-200 pb-4">
            <Link href={`/${post.slug}`} className="no-underline hover:underline">
              <h2>{post.title}</h2>
            </Link>

            {post.date && (
              <p className="text-sm text-neutral-500 m-0">
                {new Date(post.date).toLocaleDateString("ko-KR")}
              </p>
            )}

            {post.description && <p className="text-neutral-600">{post.description}</p>}

            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((t: string) => (
                <Link
                  key={t}
                  href={`/tags/${encodeURIComponent(t)}`}
                  className={`text-sm px-2 py-1 rounded-full ${
                    t === decodedTag
                      ? "bg-blue-200 text-blue-800 font-semibold"
                      : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                  }`}
                >
                  #{t}
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}