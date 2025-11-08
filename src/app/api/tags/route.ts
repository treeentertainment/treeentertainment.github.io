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

export async function GET() {
  const files = getAllMarkdownFiles(postsDir);
  const tagCount: Record<string, number> = {};

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const { data } = matter(content);
    if (Array.isArray(data.tags)) {
      for (const tag of data.tags) {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      }
    }
  }

  const tags = Object.entries(tagCount).map(([name, count]) => ({ name, count }));

  return NextResponse.json(tags);
}
