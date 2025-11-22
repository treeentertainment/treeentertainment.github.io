import Link from "next/link";
import { getAllTags } from "@/lib/tags";

export default function AllTagsPage() {
  const allTags = getAllTags();

  return (
    <section className="prose mx-auto p-6">
      <h1 className="mb-6">모든 태그</h1>

      {allTags.length === 0 ? (
        <p>태그가 없습니다.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {allTags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-3 py-2 rounded-full text-sm transition"
            >
              #{tag}
              <span className="ml-1 text-neutral-500">({count})</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
