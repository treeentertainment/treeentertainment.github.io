import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

const postsDir = path.join(process.cwd(), "posts");

export default async function PostPage(props: { params: Promise<{ slug?: string[] }> }) {
  // ✅ Next.js 16에서는 params가 Promise이므로 await으로 풀어야 함
  const { slug } = await props.params;

  // slug가 없으면 index로 처리
  const slugArray = slug ?? ["index"];

  // 예: ["posts", "tips", "go"] → posts/posts/tips/go.md
  const filePath = path.join(postsDir, ...slugArray) + ".md";

  if (!fs.existsSync(filePath)) return notFound();

  const fileContent = fs.readFileSync(filePath, "utf-8");

  return (
    <article className="prose mx-auto p-6">
      <Markdown>{fileContent}</Markdown>
    </article>
  );
}
