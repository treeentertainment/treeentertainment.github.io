// /app/api/posts/route.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

const postsDir = path.join(process.cwd(), "posts");

export async function GET() {
  const entries = fs.readdirSync(postsDir, { withFileTypes: true });

  // 📄 루트 글 (카테고리 없는 글)
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

  // 📂 폴더(카테고리)별 글
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

  return NextResponse.json({
    rootPosts,
    categoryPosts,
  });
}