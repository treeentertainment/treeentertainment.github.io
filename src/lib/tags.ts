import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

// 모든 마크다운 파일 재귀적으로 가져오기
function getAllMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? getAllMarkdownFiles(fullPath) : [fullPath];
  });
  return files.filter((f) => f.endsWith(".md"));
}

// 태그 파싱 헬퍼
function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((t) => (typeof t === "string" ? t.trim() : ""))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,;]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

// 모든 태그와 각 태그별 포스트 수 반환
export function getAllTags(): { tag: string; count: number }[] {
  const files = getAllMarkdownFiles(postsDirectory);
  const tagCount: Record<string, number> = {};

  files.forEach((file) => {
    const fileContents = fs.readFileSync(file, "utf8");
    const { data } = matter(fileContents);
    const tags = parseTags(data.tags);

    tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

// 특정 태그의 모든 포스트 반환
export function getPostsByTag(tag: string) {
  const files = getAllMarkdownFiles(postsDirectory);
  const posts: Array<{
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
  }> = [];

  files.forEach((file) => {
    const fileContents = fs.readFileSync(file, "utf8");
    const { data, content } = matter(fileContents);
    const tags = parseTags(data.tags);

    // 태그 매칭 (대소문자 구분 없이)
    if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      const slug = file
        .replace(postsDirectory, "")
        .replace(/\.md$/, "")
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");

      posts.push({
        slug,
        title: data.title || "",
        date: data.date || "",
        description: data.description || content.slice(0, 200),
        tags,
      });
    }
  });

  // 날짜순 정렬 (최신순)
  return posts.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
