import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

const postsDir = path.join(process.cwd(), "posts");

// 🔍 모든 하위 폴더의 .md 파일 재귀적으로 가져오기
function getAllMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? getAllMarkdownFiles(fullPath) : [fullPath];
  });
  return files.filter((f) => f.endsWith(".md"));
}

export default function AllTagsPage() {
  const files = getAllMarkdownFiles(postsDir);
  const tagCount: Record<string, number> = {};

  // 모든 파일의 태그 수집
  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const { data } = matter(content);
    if (Array.isArray(data.tags)) {
      data.tags.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });

  const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);

  return (
    <section className="prose mx-auto p-6">
      <h1 className="mb-6">모든 태그</h1>

      {sortedTags.length === 0 ? (
        <p>태그가 없습니다.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {sortedTags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-3 py-2 rounded-full text-sm transition"
            >
              #{tag}
              <span className="ml-1 text-neutral-500">({count})</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
