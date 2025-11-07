#!/data/data/com.termux/files/usr/bin/bash
# 📦 Termux Next.js + Tailwind + Markdown Blog (폴더 지원)
# 실행: bash setup_next_blog.sh

echo "🚀 Termux Next.js Markdown Blog Installer 시작..."

# 1️⃣ 필수 패키지 설치
echo "📦 개발 도구 설치 중..."
pkg update -y && pkg upgrade -y
pkg install -y nodejs-lts git python build-essential

# 2️⃣ 블로그 이름 입력
read -p "블로그 프로젝트 이름을 입력하세요 (예: blog101): " BLOGNAME

# 3️⃣ 프로젝트 생성
echo "📁 Next.js 프로젝트 생성 중..."
npx create-next-app@latest $BLOGNAME --typescript --use-npm
cd $BLOGNAME || exit

# 4️⃣ TailwindCSS 설치
echo "🎨 TailwindCSS 설정 중..."
npm install -D tailwindcss postcss autoprefixer --ignore-scripts --no-bin-links
npx tailwindcss init -p

# 5️⃣ Tailwind 설정
sed -i 's/content: \[\]/content: ["\.\/app\/**/*.{js,ts,jsx,tsx,md,mdx}", "\.\/pages\/**/*.{js,ts,jsx,tsx,md,mdx}", "\.\/components\/**/*.{js,ts,jsx,tsx,md,mdx}"]/g' tailwind.config.js
echo "@tailwind base;\n@tailwind components;\n@tailwind utilities;" > ./app/globals.css

# 6️⃣ Markdown 지원 라이브러리
npm install gray-matter remark remark-html --ignore-scripts --no-bin-links

# 7️⃣ posts 폴더 생성 + 예제 카테고리
mkdir -p posts/tech posts/life
echo "# Welcome to My Blog" > posts/index.md
echo "# AI Post\n\nMarkdown 예제입니다." > posts/tech/ai.md
echo "# Travel Post\n\n여행 글 예제입니다." > posts/life/travel.md

# 8️⃣ lib/posts.ts 작성 (재귀 탐색 지원)
mkdir -p lib
cat << 'EOF' > lib/posts.ts
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
EOF

# 9️⃣ pages/blog/[...slug].tsx 생성 (폴더 경로 반영)
mkdir -p pages/blog
cat << 'EOF' > pages/blog/[...slug].tsx
import { GetStaticPaths, GetStaticProps } from "next";
import { getAllPosts } from "@/lib/posts";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug.split("/") },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[];
  const fullPath = path.join(process.cwd(), "posts", ...slugArray) + ".md";
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(fileContents);
  const processed = await remark().use(html).process(content);
  return {
    props: {
      frontMatter: data,
      contentHtml: processed.toString(),
      slug: slugArray.join("/"),
    },
  };
};

export default function PostPage({ frontMatter, contentHtml, slug }: any) {
  return (
    <main className="p-6 prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{frontMatter?.title || slug}</h1>
      <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
EOF

# 🔟 완료
echo ""
echo "✅ 설치 완료!"
echo "📂 프로젝트 경로: $(pwd)"
echo "👉 실행: npm run dev"
echo "🌐 접속: http://localhost:3000"
echo ""
echo "⚠️ Termux에서는 브라우저가 자동 실행되지 않습니다."
echo "📱 같은 Wi-Fi 내 다른 기기에서 접속: http://<Termux_IP>:3000"