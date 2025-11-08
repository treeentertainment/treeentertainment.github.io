import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeExternalLinks from "rehype-external-links";
import remarkGithubAdmonitions from "@/lib/remarkGithubAdmonitions";

const components: Components = {
  code(props) {
    const { className, children, ...rest } = props as any;
    const inline = (props as any).inline as boolean | undefined;
    const match = /language-(\w+)/.exec(className || "");
    const isInline = inline ?? !Boolean(match);

    return !isInline ? (
      <pre>
        <code className={className} {...rest}>{children}</code>
      </pre>
    ) : (
      <code className={className} {...rest}>{children}</code>
    );
  },
};

export default function ClientMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkGithubAdmonitions]}
      rehypePlugins={[
        rehypeRaw,
        rehypeHighlight,
        [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }]
      ]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}