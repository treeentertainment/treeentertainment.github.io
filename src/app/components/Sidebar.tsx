import Link from "next/link";
import { BookIcon, FileDirectoryIcon, TagIcon } from "@primer/octicons-react";
import { getAllTags } from "@/lib/tags";
import { getRootPosts, getCategoryPosts } from "@lib/posts";
import SidebarToggle from "./SidebarToggle";

export default function Sidebar() {
  // Load static data at build time
  const tags = getAllTags();
  const rootPosts = getRootPosts();
  const categoryPosts = getCategoryPosts();

  return (
    <SidebarToggle>
      {/* All posts */}
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 mt-8">
        <BookIcon size={16} />
        모든 글
      </h2>
      <ul className="mb-4 flex flex-col gap-1">
        {rootPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/${encodeURIComponent(post.slug)}`}
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
                      href={`/${encodeURIComponent(post.slug)}`}
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
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <Link
              href={`/tags/${encodeURIComponent(tag)}`}
              className="text-neutral-700 hover:underline flex justify-between"
            >
              <span>#{tag}</span>
              <span className="text-neutral-500 text-sm">({count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </SidebarToggle>
  );
}