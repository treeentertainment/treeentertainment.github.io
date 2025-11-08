import Link from "next/link";

interface TagLinkProps {
  tag: string;
  count?: number;
}

export default function TagLink({ tag, count }: TagLinkProps) {
  // URL 인코딩: "React Native" → "React%20Native"
  const encodedTag = encodeURIComponent(tag);

  return (
    <Link href={`/tags/${encodedTag}`}>
      <a className="tag">
        {tag}
        {count && <span className="count">{count}</span>}
      </a>
    </Link>
  );
}