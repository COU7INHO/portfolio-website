import { useMemo, type ReactNode } from 'react';
import { parseChatMarkdown, type ChatNode } from '@/lib/chatMarkdown';

const renderNodes = (nodes: ChatNode[]): ReactNode[] =>
  nodes.map((node, i) => {
    switch (node.type) {
      case 'bold':
        return (
          <strong key={i} className="font-semibold text-foreground">
            {renderNodes(node.children)}
          </strong>
        );
      case 'link':
        return (
          <a
            key={i}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary break-all transition-colors"
          >
            {node.text}
          </a>
        );
      default:
        return node.value;
    }
  });

/** Renders an assistant message with **bold**, links and bare URLs/emails. */
const ChatMarkdown = ({ content }: { content: string }) => {
  const nodes = useMemo(() => parseChatMarkdown(content), [content]);
  return <>{renderNodes(nodes)}</>;
};

export default ChatMarkdown;
