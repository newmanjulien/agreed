import type { TextAnchor } from '$lib/document/anchors/types';

export interface TextProposalTarget {
	kind: 'text';
	anchor: TextAnchor;
}

export interface ClauseProposalTarget {
	kind: 'clause';
	clauseId: string;
	optionValue: string;
}

export type ProposalTarget = TextProposalTarget | ClauseProposalTarget;
