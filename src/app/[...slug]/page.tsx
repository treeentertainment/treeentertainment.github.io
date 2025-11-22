import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import ClientMarkdown from "../components/ClientMarkdown";
import Link from "next/link";
import { getAllPosts } from "../../../lib/posts";

const postsDir = path.join(process.cwd(), "posts");

// generateStaticParams로 빌드 타임에 모든 포스트 페이지 생성
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }));
}

export default async function PostPage(props: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await props.params;
  const slugArray = slug ?? ["index"];
  const filePath = path.join(postsDir, ...slugArray) + ".md";

  if (!fs.existsSync(filePath)) return notFound();

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent); // front matter 분리

  return (
    <article className="prose mx-auto p-6">
      {/* 제목 */}
      {data?.title && <h1>{data.title}</h1>}

      {/* 날짜 */}
      {data?.date && (
        <p className="m-0 text-sm text-neutral-500">
          {new Date(data.date).toLocaleDateString("ko-KR")}
        </p>
      )}

      {/* 설명 */}
      {data?.description && (
        <p className="text-neutral-600 italic mt-2">{data.description}</p>
      )}

      {/* 태그 (클릭 시 /tags/[tag]로 이동) */}
      {data?.tags && Array.isArray(data.tags) && (
        <div className="flex flex-wrap gap-2 my-4">
          {data.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-2 py-1 rounded-full text-sm transition"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* 본문 */}
      <ClientMarkdown>{content}</ClientMarkdown>
    </article>
  );
}
