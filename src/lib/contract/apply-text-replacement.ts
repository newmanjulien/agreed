import type { ContractTextProposal } from './proposals.ts';
import type { ResolvedContractDocument, ResolvedTextNode } from './resolve.ts';
import {
	blockIndex,
	sourceOverlapForNode,
	textForSourceRange
} from './text-source-range.ts';

export class UnresolvedTextReplacementError extends Error {
	constructor(message = 'The selected wording could not be resolved.') {
		super(message);
		this.name = 'UnresolvedTextReplacementError';
	}
}

function replaceTextRange(
	content: ResolvedTextNode[],
	proposal: ContractTextProposal
): ResolvedTextNode[] {
	const result: ResolvedTextNode[] = [];
	let inserted = false;

	for (const node of content) {
		const source = node.source;
		const overlap = sourceOverlapForNode(node, proposal.range);
		if (!source || !overlap) {
			result.push(node);
			continue;
		}

		if (source.start < overlap.start) {
			result.push({
				...node,
				value: node.value.slice(0, overlap.start - source.start),
				source: { ...source, end: overlap.start }
			});
		}
		if (!inserted) {
			result.push({
				type: 'text',
				value: proposal.text,
				proposalId: proposal.id,
				revisionState: 'proposed'
			});
			inserted = true;
		}
		if (source.end > overlap.end) {
			result.push({
				...node,
				value: node.value.slice(overlap.end - source.start),
				source: { ...source, start: overlap.end }
			});
		}
	}

	if (!inserted) {
		throw new UnresolvedTextReplacementError();
	}
	return result;
}

export function applyTextReplacement(
	document: ResolvedContractDocument,
	proposal: ContractTextProposal
): void {
	const index = blockIndex(proposal.range.blockId);
	const block = index === null ? undefined : document.blocks[index];
	if (!block || block.type === 'signature-grid') {
		throw new UnresolvedTextReplacementError();
	}

	if (textForSourceRange(block.content, proposal.range) !== proposal.originalText) {
		throw new UnresolvedTextReplacementError(
			'The selected source wording could not be resolved.'
		);
	}

	block.content = replaceTextRange(block.content, proposal);
}
