import { visit } from 'unist-util-visit';
import type { Root, Blockquote, Paragraph, Text } from 'mdast';

const ADMONITION_TYPES = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'] as const;
type AdmonitionType = typeof ADMONITION_TYPES[number];

export default function remarkGithubAdmonitions() {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote) => {
      if (!node.children?.length) return;

      const first = node.children[0];
      if (first.type !== 'paragraph') return;

      const textNode = first.children?.[0] as Text;
      const raw = textNode?.value?.trim?.();
      if (!raw) return;

      const match = raw.match(/^\[\!(\w+)\]\s*(.*)$/);
      if (!match) return;

      const type = match[1].toUpperCase() as AdmonitionType;
      if (!ADMONITION_TYPES.includes(type)) return;

      const titleText = match[2] || type.charAt(0) + type.slice(1).toLowerCase();

      // 💡 Blockquote 스타일 설정
      (node as any).data = (node as any).data || {};
      (node as any).data.hProperties = {
        className: ['admonition', type.toLowerCase()],
      };

      // 💡 제목 노드 생성
      const titleNode: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: titleText }],
        data: { hProperties: { className: ['admonition-title'] } },
      };

      // 첫 문단([!NOTE])은 제거
      node.children.shift();

      // 남은 내용이 없으면 빈 문단 추가
      if (node.children.length === 0) {
        node.children.push({
          type: 'paragraph',
          children: [{ type: 'text', value: '' }],
        });
      }

      // 💡 children 재구성: 제목 + 내용
      node.children = [titleNode, ...node.children];
    });
  };
}