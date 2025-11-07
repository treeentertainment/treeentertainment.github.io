import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

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

export function getAllPosts() {
  const filePaths = getAllPostFiles();

  return filePaths.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const slug = filePath.replace(postsDirectory + "/", "").replace(/\.md$/, "");
    return { slug, frontMatter: data, content };
  });
}
