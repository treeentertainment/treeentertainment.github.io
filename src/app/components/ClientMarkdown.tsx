import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

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
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}