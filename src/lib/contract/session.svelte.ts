import type { ClauseRegistry } from './model.ts';
import type { ContractDocument } from './types.ts';
import {
	changeFailed,
	changeSucceeded,
	type ContractChangeResult
} from './change-result.ts';
import {
	cloneContractControlValues,
	createDefaultControlValues,
	getChangesControl,
	normalizeControlValue,
	type ContractControlValues
} from './control-values.ts';
import {
	cloneContractProposals,
	createContractProposalId,
	findContractProposal,
	findClauseProposal,
	normalizeProposalText,
	type ContractProposal,
	type ContractProposals,
	type TextSourceRange
} from './proposals.ts';
import { UnresolvedTextReplacementError } from './apply-text-replacement.ts';
import { resolveContract, type ResolvedContractDocument } from './resolve.ts';
import {
	blockIndex,
	sourceRangesOverlap,
	textForSourceRange
} from './text-source-range.ts';

export interface PreparedContractChange {
	controlValues: ContractControlValues;
	proposals: ContractProposals;
	document: ResolvedContractDocument;
}

export interface PreparedProposalChange extends PreparedContractChange {
	proposalId: string;
}

function tryResolveContract(
	template: ContractDocument,
	clauses: ClauseRegistry,
	controlValues: Readonly<ContractControlValues>,
	proposals: ReadonlyArray<ContractProposal>
): ResolvedContractDocument | null {
	try {
		return resolveContract(template, clauses, controlValues, proposals);
	} catch (error) {
		if (error instanceof UnresolvedTextReplacementError) return null;
		throw error;
	}
}

function resolvedClauseText(
	document: ResolvedContractDocument,
	clauseId: string
): string | null {
	const text = document.blocks
		.flatMap((block) => (block.type === 'signature-grid' ? [] : block.content))
		.filter((node) => node.clauseId === clauseId)
		.map((node) => node.value)
		.join('');
	return text || null;
}

export class ContractSession {
	controlValues = $state<ContractControlValues>({});
	proposals = $state<ContractProposals>([]);

	currentControlValues(clauses: ClauseRegistry): ContractControlValues {
		const current = createDefaultControlValues(clauses);
		for (const [clauseId, storedValues] of Object.entries(this.controlValues)) {
			for (const [controlId, value] of Object.entries(storedValues)) {
				const normalized = normalizeControlValue(clauses, clauseId, controlId, value);
				if (normalized === null) continue;
				current[clauseId] = { ...current[clauseId], [controlId]: normalized };
			}
		}
		return current;
	}

	snapshot(template: ContractDocument, clauses: ClauseRegistry): ResolvedContractDocument {
		const controlValues = this.currentControlValues(clauses);
		return resolveContract(template, clauses, controlValues, this.proposals);
	}

	proposal(id: string): Readonly<ContractProposal> | undefined {
		return findContractProposal(this.proposals, id);
	}

	prepareControlChange(
		template: ContractDocument,
		clauses: ClauseRegistry,
		clauseId: string,
		controlId: string,
		value: string
	): ContractChangeResult<PreparedContractChange> {
		const normalized = normalizeControlValue(clauses, clauseId, controlId, value);
		if (normalized === null) return changeFailed('invalid');
		const control = getChangesControl(clauses, clauseId, controlId);
		const selectedOption = control?.options.find((option) => option.value === normalized);
		if (selectedOption?.kind === 'custom') return changeFailed('invalid');
		const currentControlValues = this.currentControlValues(clauses);
		if (currentControlValues[clauseId]?.[controlId] === normalized) {
			return changeFailed('unchanged');
		}
		const controlValues = {
			...currentControlValues,
			[clauseId]: { ...currentControlValues[clauseId], [controlId]: normalized }
		};
		const proposals = cloneContractProposals(this.proposals);
		const clauseProposal = findClauseProposal(proposals, clauseId);
		if (clauseProposal) {
			proposals.splice(proposals.indexOf(clauseProposal), 1);
		}
		const document = tryResolveContract(template, clauses, controlValues, proposals);
		if (!document) return changeFailed('conflict');
		return changeSucceeded({
			controlValues,
			proposals,
			document
		});
	}

	prepareClauseProposal(
		template: ContractDocument,
		clauses: ClauseRegistry,
		clauseId: string,
		optionValue: string,
		text: string
	): ContractChangeResult<PreparedProposalChange> {
		const proposalText = normalizeProposalText(text);
		if (!proposalText) return changeFailed('invalid');

		const widget = clauses[clauseId]?.widget;
		if (widget?.type !== 'changes') return changeFailed('invalid');

		const selectedOption = widget.control.options.find((option) => option.value === optionValue);
		if (selectedOption?.kind !== 'custom') return changeFailed('invalid');

		const currentControlValues = this.currentControlValues(clauses);
		const previousControlValue = currentControlValues[clauseId]?.[widget.control.id];
		if (previousControlValue === undefined) return changeFailed('invalid');
		if (findClauseProposal(this.proposals, clauseId)) return changeFailed('conflict');
		const currentDocument = tryResolveContract(
			template,
			clauses,
			currentControlValues,
			this.proposals
		);
		const originalText = currentDocument
			? resolvedClauseText(currentDocument, clauseId)
			: null;
		if (!originalText) return changeFailed('invalid');
		if (normalizeProposalText(originalText) === proposalText) {
			return changeFailed('unchanged');
		}

		const controlValues = {
			...currentControlValues,
			[clauseId]: {
				...currentControlValues[clauseId],
				[widget.control.id]: selectedOption.value
			}
		};
		const proposals = cloneContractProposals(this.proposals);
		const proposalId = createContractProposalId();
		proposals.push({
			kind: 'clause',
			id: proposalId,
			clauseId,
			previousControlValue,
			originalText,
			text: proposalText
		});
		const document = tryResolveContract(template, clauses, controlValues, proposals);
		if (!document) return changeFailed('conflict');

		return changeSucceeded({
			controlValues,
			proposals,
			document,
			proposalId
		});
	}

	prepareTextProposal(
		template: ContractDocument,
		clauses: ClauseRegistry,
		range: TextSourceRange,
		text: string
	): ContractChangeResult<PreparedProposalChange> {
		const proposalText = normalizeProposalText(text);
		if (!proposalText) return changeFailed('invalid');

		const controlValues = this.currentControlValues(clauses);
		const currentDocument = tryResolveContract(
			template,
			clauses,
			controlValues,
			this.proposals
		);
		if (!currentDocument) return changeFailed('conflict');
		const rangeBlockIndex = blockIndex(range.blockId);
		const rangeBlock =
			rangeBlockIndex === null ? undefined : currentDocument.blocks[rangeBlockIndex];
		const originalText =
			rangeBlock && rangeBlock.type !== 'signature-grid'
				? textForSourceRange(rangeBlock.content, range)
				: null;
		if (!originalText) return changeFailed('invalid');
		if (normalizeProposalText(originalText) === proposalText) {
			return changeFailed('unchanged');
		}
		if (
			this.proposals.some(
				(proposal) =>
					proposal.kind === 'text' && sourceRangesOverlap(proposal.range, range)
			)
		) {
			return changeFailed('conflict');
		}

		const proposals = cloneContractProposals(this.proposals);
		const proposalId = createContractProposalId();
		proposals.push({
			kind: 'text',
			id: proposalId,
			range,
			originalText,
			text: proposalText
		});
		const document = tryResolveContract(template, clauses, controlValues, proposals);
		if (!document) return changeFailed('conflict');

		return changeSucceeded({
			controlValues,
			proposals,
			document,
			proposalId
		});
	}

	prepareProposalEdit(
		template: ContractDocument,
		clauses: ClauseRegistry,
		proposalId: string,
		text: string
	): ContractChangeResult<PreparedProposalChange> {
		const proposalText = normalizeProposalText(text);
		if (!proposalText) return changeFailed('invalid');

		const controlValues = this.currentControlValues(clauses);
		const proposals = cloneContractProposals(this.proposals);
		const proposal = findContractProposal(proposals, proposalId);
		if (!proposal) return changeFailed('invalid');
		if (
			normalizeProposalText(proposal.text) === proposalText ||
			normalizeProposalText(proposal.originalText) === proposalText
		) {
			return changeFailed('unchanged');
		}
		proposal.text = proposalText;
		const document = tryResolveContract(template, clauses, controlValues, proposals);
		if (!document) return changeFailed('conflict');

		return changeSucceeded({ controlValues, proposals, document, proposalId });
	}

	prepareProposalDeletion(
		template: ContractDocument,
		clauses: ClauseRegistry,
		proposalId: string
	): ContractChangeResult<PreparedContractChange> {
		const controlValues = this.currentControlValues(clauses);
		const proposals = cloneContractProposals(this.proposals);
		const proposal = findContractProposal(proposals, proposalId);
		if (!proposal) return changeFailed('invalid');

		if (proposal.kind === 'clause') {
			const widget = clauses[proposal.clauseId]?.widget;
			if (widget?.type !== 'changes') return changeFailed('invalid');
			proposals.splice(proposals.indexOf(proposal), 1);
			controlValues[proposal.clauseId] = {
				...controlValues[proposal.clauseId],
				[widget.control.id]: proposal.previousControlValue
			};
		} else {
			const index = proposals.findIndex((candidate) => candidate.id === proposalId);
			if (index === -1) return changeFailed('invalid');
			proposals.splice(index, 1);
		}

		const document = tryResolveContract(template, clauses, controlValues, proposals);
		if (!document) return changeFailed('conflict');
		return changeSucceeded({ controlValues, proposals, document });
	}

	commit(change: PreparedContractChange): void {
		this.controlValues = cloneContractControlValues(change.controlValues);
		this.proposals = cloneContractProposals(change.proposals);
	}
}
