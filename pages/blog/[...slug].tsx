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
