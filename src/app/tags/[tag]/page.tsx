import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/tags";

// generateStaticParams로 빌드 타임에 모든 태그 페이지 생성
export function generateStaticParams() {
  const allTags = getAllTags();
  return allTags.map((item) => ({
    tag: encodeURIComponent(item.tag),
  }));
}

export default async function TagPage(props: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await props.params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    return <div className="max-w-4xl mx-auto p-6">포스트가 없습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">태그: {decodedTag}</h1>
        <p className="text-neutral-600">{posts.length}개의 포스트</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border-b border-neutral-200 pb-6 last:border-b-0"
          >
            <Link href={`/${post.slug}`} className="group">
              <h2 className="text-2xl font-semibold mb-2 text-neutral-900 group-hover:text-blue-600 transition">
                {post.title}
              </h2>
            </Link>
            {post.date && (
              <time className="text-sm text-neutral-500 block mb-3">
                {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            <p className="text-neutral-700 mb-3 line-clamp-3">
              {post.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tagName) => (
                <Link
                  key={tagName}
                  href={`/tags/${encodeURIComponent(tagName)}`}
                  className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-2 py-1 rounded-full text-sm transition"
                >
                  #{tagName}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}