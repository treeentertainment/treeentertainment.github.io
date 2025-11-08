import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Blockquote, Paragraph, Text } from 'mdast';

const types = ['NOTE','TIP','IMPORTANT','WARNING','CAUTION'];

export const remarkSimpleAdmonitions: Plugin<[]> = () => (tree: Root) => {
  visit(tree, 'blockquote', (node: Blockquote) => {
    if (!node.children.length) return;
    const first = node.children[0];
    if (first.type !== 'paragraph') return;
    const p = first as Paragraph;
    if (!p.children.length) return;
    const t = p.children[0];
    if (t.type !== 'text') return;
    const raw = (t as Text).value.trim();

    const match = raw.match(/^\[\!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/);
    if (!match) return;

    const kind = match[1];
    const titleRest = match[2]; // 커스텀 제목(있다면)

    // 첫 텍스트 노드 수정: 제거
    (t as Text).value = '';

    // 제목을 별도 paragraph로 유지
    const titlePara: Paragraph = {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: titleRest ? titleRest : kind
        }
      ],
      data: {
        hName: 'div',
        hProperties: { className: ['admonition-title'] }
      }
    };

    // 기존 첫 paragraph가 비었으면 제거
    if (p.children.length === 1 && (p.children[0] as Text).value === '') {
      node.children.shift();
    }

    node.children.unshift(titlePara);

    // blockquote에 클래스 부여
    (node as any).data = {
      hName: 'blockquote',
      hProperties: {
        className: ['admonition', kind.toLowerCase()]
      }
    };
  });
};