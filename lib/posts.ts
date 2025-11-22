import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export const EXCERPT_LENGTH = 200;

export function getAllPostFiles(dir = postsDirectory): string[] {
  const files = fs.readdirSync(dir);
  const allFiles: string[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      allFiles.push(...getAllPostFiles(fullPath));
    } else if (file.endsWith(".md")) {
      allFiles.push(fullPath);
    }
  }
  return allFiles;
}

export function getSlugFromFilePath(filePath: string): string {
  return filePath
    .replace(postsDirectory + "/", "")
    .replace(/\.md$/, "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");
}

export function getAllPosts() {
  const filePaths = getAllPostFiles();

  return filePaths.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const slug = getSlugFromFilePath(filePath);
    return { slug, frontMatter: data, content };
  });
}
