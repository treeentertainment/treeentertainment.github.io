import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export const EXCERPT_LENGTH = 200;

function sanitizeSlug(slug: string): string {
  // Allow only URL-safe characters in slugs (alphanumerics, dash, underscore, slash)
  // and remove any leading slashes to keep the slug relative.
  const cleaned = slug.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+/, "");
  return cleaned;
}

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
  const rawSlug = filePath
    .replace(postsDirectory + "/", "")
    .replace(/\.md$/, "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");
  return sanitizeSlug(rawSlug);
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

// 루트 레벨 포스트들 반환 (posts 디렉토리 바로 아래에 있는 .md 파일들)
export function getRootPosts() {
  const files = fs.readdirSync(postsDirectory);
  const rootPosts: Array<{ title: string; slug: string }> = [];

  for (const file of files) {
    if (file.endsWith(".md")) {
      const filePath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      const slug = getSlugFromFilePath(filePath);

      rootPosts.push({
        title: data.title || file.replace(/\.md$/, ""),
        slug,
      });
    }
  }

  return rootPosts;
}

// 카테고리별 포스트들 반환 (posts 디렉토리의 서브디렉토리들)
export function getCategoryPosts() {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  const categoryPosts: Array<{
    category: string;
    posts: Array<{ title: string; slug: string }>;
  }> = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const categoryPath = path.join(postsDirectory, entry.name);
      const posts: Array<{ title: string; slug: string }> = [];

      const categoryFiles = getAllPostFiles(categoryPath);
      for (const filePath of categoryFiles) {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);
        const slug = getSlugFromFilePath(filePath);

        posts.push({
          title: data.title || path.basename(filePath, ".md"),
          slug,
        });
      }

      if (posts.length > 0) {
        categoryPosts.push({
          category: entry.name,
          posts,
        });
      }
    }
  }

  return categoryPosts;
}
