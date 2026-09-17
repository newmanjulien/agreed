import type { ResolvedTextNode } from '../../contract/resolve.ts';
import type { InlineToken } from './types.ts';

const TEXT_CHUNK = /\S+\s*|\s+/gu;

export function tokenizeInline(nodes: ResolvedTextNode[]): InlineToken[] {
	const tokens: InlineToken[] = [];
	let previousClauseId: string | undefined;

	for (const node of nodes) {
		const values = node.value.match(TEXT_CHUNK) ?? [];
		for (const [index, value] of values.entries()) {
			tokens.push({
				...node,
				value,
				...(node.clauseId && node.clauseId !== previousClauseId && index === 0
					? { isClauseStart: true }
					: {})
			});
		}
		previousClauseId = node.clauseId;
	}
	return tokens;
}
