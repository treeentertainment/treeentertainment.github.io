"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookIcon, FileDirectoryIcon, TagIcon, ThreeBarsIcon, XIcon } from "@primer/octicons-react";

interface Tag {
  name: string;
  count: number;
}

interface Post {
  title: string;
  slug: string;
}

interface Category {
  category: string;
  posts: Post[];
}

export default function Sidebar() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [rootPosts, setRootPosts] = useState<Post[]>([]);
  const [categoryPosts, setCategoryPosts] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Fetch tags
      const tagRes = await fetch("/api/tags");
      if (tagRes.ok) setTags(await tagRes.json());

      // Fetch posts
      const postRes = await fetch("/api/posts");
      if (postRes.ok) {
        const data = await postRes.json();
        setRootPosts(data.rootPosts);
        setCategoryPosts(data.categoryPosts);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/* Toggle button - visible when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-md shadow-md transition-colors"
          aria-label="Open sidebar"
        >
          <ThreeBarsIcon size={24} />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`p-4 border-r border-neutral-200 fixed top-0 left-0 h-screen w-64 overflow-y-auto bg-neutral-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-40`}>
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 p-1 hover:bg-neutral-200 rounded-md transition-colors"
          aria-label="Close sidebar"
        >
          <XIcon size={20} />
        </button>

      {/* All posts */}
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 mt-8">
        <BookIcon size={16} />
        모든 글
      </h2>
      <ul className="mb-4 flex flex-col gap-1">
        {rootPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/${post.slug}`}
              className="text-neutral-700 hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
        {categoryPosts.map(({ category, posts }) => (
          <li key={category}>
            <details>
              <summary className="cursor-pointer font-medium flex items-center gap-2">
                <FileDirectoryIcon size={16} />
                {category}
              </summary>
              <ul className="ml-4 mt-1 flex flex-col gap-1">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/${post.slug}`}
                      className="text-neutral-700 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>

      {/* Tags */}
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <TagIcon size={16} />
        태그
      </h2>
      <ul className="flex flex-col gap-2">
        {tags.map((tag) => (
          <li key={tag.name}>
            <Link
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="text-neutral-700 hover:underline flex justify-between"
            >
              <span>#{tag.name}</span>
              <span className="text-neutral-500 text-sm">({tag.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
    </>
  );
}