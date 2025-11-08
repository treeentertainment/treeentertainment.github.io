import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

const postsDir = path.join(process.cwd(), "posts");

function getAllMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? getAllMarkdownFiles(fullPath) : [fullPath];
  });
  return files.filter((f) => f.endsWith(".md"));
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((t) => (typeof t === "string" ? t.trim() : "")).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(/[,;]+/).map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tags: string }> }
) {
  try {
    // Next.js 16에서 params는 Promise로 변경됨
    const resolvedParams = await params;
    
    // 요청에서 패스 파라미터 또는 쿼리 파라미터(tag)를 허용
    const url = new URL(request.url);
    const rawParam = resolvedParams.tags ?? url.searchParams.get("tag") ?? "";

    // 디코딩 안전하게 처리
    let decodedTag = "";
    try {
      decodedTag = rawParam ? decodeURIComponent(rawParam) : "";
    } catch {
      decodedTag = rawParam;
    }

    // 디버그 로그(서버 터미널에 찍힙니다)
    console.debug("GET /api/tags/[tags] - params.tags:", resolvedParams.tags, "query.tag:", url.searchParams.get("tag"), "decoded:", decodedTag);

    if (!decodedTag) {
      return NextResponse.json({ error: "Tag required. Use /api/tags/<tag> or provide ?tag=<tag>" }, { status: 400 });
    }

    const files = getAllMarkdownFiles(postsDir);
    const posts: any[] = [];

    for (const file of files) {
      const fileContent = fs.readFileSync(file, "utf-8");
      const { data, content: markdown } = matter(fileContent);
      const tags = parseTags(data.tags);

      if (tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase())) {
        const slug = file
          .replace(postsDir, "")
          .replace(/\.md$/, "")
          .replace(/\\/g, "/")
          .replace(/^\/+/, "");

        posts.push({
          slug,
          title: data.title || "",
          date: data.date || "",
          tags,
          excerpt: data.excerpt || markdown.slice(0, 200),
        });
      }
    }

    if (posts.length === 0) {
      return NextResponse.json({ error: "No posts found for this tag" }, { status: 404 });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("tags route error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}