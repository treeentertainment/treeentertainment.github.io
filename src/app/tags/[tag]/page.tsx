"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (posts.length === 0) return <div>포스트가 없습니다.</div>;

  return (
    <div>
      <h1>태그: {decodeURIComponent(tag)}</h1>
      <div className="posts">
        {posts.map((post) => (
          <article key={post.slug}>
            <h2>{post.title}</h2>
            <time>{post.date}</time>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}