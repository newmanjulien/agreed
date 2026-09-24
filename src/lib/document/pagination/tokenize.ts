import type { ResolvedInlineNode } from '../resolved-types';
import type { InlineToken } from './types';

const TEXT_CHUNK = /\S+\s*|\s+/gu;

export function tokenizeInline(nodes: ResolvedInlineNode[]): InlineToken[] {
	const tokens: InlineToken[] = [];

	function append(nodesToTokenize: ResolvedInlineNode[], clauseId?: string) {
		for (const node of nodesToTokenize) {
			if (node.type === 'clause') {
				append(node.content, node.id);
				continue;
			}

			for (const value of node.value.match(TEXT_CHUNK) ?? []) {
				tokens.push({
					type: 'text',
					value,
					...(clauseId ? { clauseId } : {}),
					...(node.removed ? { removed: true as const } : {}),
					...(node.marks ? { marks: { ...node.marks } } : {})
				});
			}
		}
	}

	append(nodes);
	return tokens;
}
