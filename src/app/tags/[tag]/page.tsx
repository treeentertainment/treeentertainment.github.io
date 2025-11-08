"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
}

export default function TagPage() {
  const params = useParams();
  const tag = params.tag as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/tags/${tag}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (tag) {
      fetchPosts();
    }
  }, [tag]);

  if (loading) return <div className="max-w-4xl mx-auto p-6">로딩 중...</div>;
  if (error) return <div className="max-w-4xl mx-auto p-6 text-red-600">에러: {error}</div>;
  if (posts.length === 0) return <div className="max-w-4xl mx-auto p-6">포스트가 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">태그: {decodeURIComponent(tag)}</h1>
        <p className="text-neutral-600">{posts.length}개의 포스트</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-neutral-200 pb-6 last:border-b-0">
            <Link href={`/${post.slug}`} className="group">
              <h2 className="text-2xl font-semibold mb-2 text-neutral-900 group-hover:text-blue-600 transition">
                {post.title}
              </h2>
            </Link>
            <time className="text-sm text-neutral-500 block mb-3">
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <p className="text-neutral-700 mb-3 line-clamp-3">{post.excerpt}</p>
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