let fallbackProposalId = 0;

export interface TextSourcePoint {
	nodeIndex: number;
	offset: number;
}

export interface TextSourceRange {
	blockId: string;
	start: TextSourcePoint;
	end: TextSourcePoint;
}

interface ContractProposalBase {
	id: string;
	originalText: string;
	text: string;
}

export interface ContractClauseProposal extends ContractProposalBase {
	kind: 'clause';
	clauseId: string;
	previousControlValue: string;
}

export interface ContractTextProposal extends ContractProposalBase {
	kind: 'text';
	range: TextSourceRange;
}

export type ContractProposal = ContractClauseProposal | ContractTextProposal;
export type ContractProposals = ContractProposal[];

export function normalizeProposalText(text: string): string {
	return text.trim().replace(/\s+/gu, ' ');
}

export function createContractProposalId(): string {
	return globalThis.crypto?.randomUUID?.() ?? `proposal-${++fallbackProposalId}`;
}

export function cloneContractProposals(
	proposals: ReadonlyArray<ContractProposal>
): ContractProposals {
	return proposals.map((proposal) =>
		proposal.kind === 'text'
			? {
					...proposal,
					range: {
						...proposal.range,
						start: { ...proposal.range.start },
						end: { ...proposal.range.end }
					}
				}
			: { ...proposal }
	);
}

export function findContractProposal(
	proposals: ReadonlyArray<ContractProposal>,
	id: string
): ContractProposal | undefined {
	return proposals.find((proposal) => proposal.id === id);
}

export function findClauseProposal(
	proposals: ReadonlyArray<ContractProposal>,
	clauseId: string
): ContractClauseProposal | undefined {
	return proposals.find(
		(proposal): proposal is ContractClauseProposal =>
			proposal.kind === 'clause' && proposal.clauseId === clauseId
	);
}
