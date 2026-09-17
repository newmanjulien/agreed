import type { ContractControlValues } from './control-values.ts';
import {
	findClauseProposal,
	type ContractProposal,
	type ContractTextProposal
} from './proposals.ts';
import { applyTextReplacement } from './apply-text-replacement.ts';
import type {
	ChangesControlDefinition,
	ChangesControlOption,
	ClauseRegistry
} from './model.ts';
import type {
	ContractDocument,
	HeadingNode,
	ParagraphContentNode,
	ParagraphNode,
	SignatureGridNode,
	TextNode
} from './types.ts';

export type RevisionState = 'inactive' | 'proposed';

export interface ResolvedContractDocument {
	id: string;
	blocks: ResolvedBlockNode[];
}

export type ResolvedBlockNode =
	| ResolvedHeadingNode
	| ResolvedParagraphNode
	| SignatureGridNode;

export interface ResolvedTextNode extends TextNode {
	clauseId?: string;
	proposalId?: string;
	revisionState?: RevisionState;
	source?: {
		nodeIndex: number;
		start: number;
		end: number;
	};
}

export interface ResolvedHeadingNode extends Omit<HeadingNode, 'content'> {
	content: ResolvedTextNode[];
}

export interface ResolvedParagraphNode extends Omit<ParagraphNode, 'content'> {
	content: ResolvedTextNode[];
}

function cloneText(node: TextNode, nodeIndex: number): ResolvedTextNode {
	return {
		type: 'text',
		value: node.value,
		...(node.marks ? { marks: { ...node.marks } } : {}),
		source: { nodeIndex, start: 0, end: node.value.length }
	};
}

function cloneSignatureParty(party: SignatureGridNode['parties'][number]) {
	return {
		...party,
		fields: party.fields.map((field) => ({
			...field,
			...(field.marks ? { marks: { ...field.marks } } : {})
		}))
	};
}

function resolveSelectedControlOption(
	control: ChangesControlDefinition,
	controlValues: Readonly<ContractControlValues>,
	clauseId: string
): ChangesControlOption {
	const selectedValue = controlValues[clauseId]?.[control.id] ?? control.defaultValue;
	const selectedOption = control.options.find((option) => option.value === selectedValue);
	if (!selectedOption) {
		throw new Error(`Invalid selected value for "${clauseId}.${control.id}".`);
	}
	return selectedOption;
}

function resolveClauseValue(
	clauses: ClauseRegistry,
	controlValues: Readonly<ContractControlValues>,
	clauseId: string,
	valueId: string
): string {
	const clause = clauses[clauseId];
	const definition = clause?.values?.[valueId];
	if (!clause || !definition) {
		throw new Error(`Missing displayed value for "${clauseId}.${valueId}".`);
	}

	if (clause.widget.type !== 'changes' || clause.widget.control.id !== valueId) {
		return definition.defaultLabel;
	}

	const selectedOption = resolveSelectedControlOption(
		clause.widget.control,
		controlValues,
		clauseId
	);
	return selectedOption.kind === 'custom'
		? definition.defaultLabel
		: selectedOption.documentLabel;
}

function resolveClause(
	node: Extract<ParagraphContentNode, { type: 'clause' }>,
	nodeIndex: number,
	clauses: ClauseRegistry,
	controlValues: Readonly<ContractControlValues>,
	proposals: ReadonlyArray<ContractProposal>
): ResolvedTextNode[] {
	const clause = clauses[node.id];
	const selectedOption =
		clause?.widget.type === 'changes'
			? resolveSelectedControlOption(clause.widget.control, controlValues, node.id)
			: undefined;
	const proposal =
		selectedOption?.kind === 'custom'
			? findClauseProposal(proposals, node.id)
			: undefined;
	if (selectedOption?.kind === 'custom' && !proposal) {
		throw new Error(`Custom clause "${node.id}" is missing proposal text.`);
	}

	if (proposal) {
		return [
			{
				type: 'text',
				value: proposal.text,
				clauseId: node.id,
				proposalId: proposal.id,
				revisionState: 'proposed',
				source: { nodeIndex, start: 0, end: proposal.originalText.length }
			}
		];
	}

	const revisionState = selectedOption?.kind === 'deactivate' ? 'inactive' : undefined;
	let offset = 0;
	return node.content.map((child): ResolvedTextNode => {
		const value =
			child.type === 'text'
				? child.value
				: resolveClauseValue(clauses, controlValues, node.id, child.id);
		const source = { nodeIndex, start: offset, end: offset + value.length };
		offset = source.end;
		return {
			type: 'text',
			value,
			...(child.marks ? { marks: { ...child.marks } } : {}),
			clauseId: node.id,
			source,
			...(revisionState ? { revisionState } : {})
		};
	});
}

function compareTextProposalsDescending(
	left: ContractTextProposal,
	right: ContractTextProposal
): number {
	if (left.range.blockId !== right.range.blockId) {
		return right.range.blockId.localeCompare(left.range.blockId, undefined, { numeric: true });
	}
	if (left.range.start.nodeIndex !== right.range.start.nodeIndex) {
		return right.range.start.nodeIndex - left.range.start.nodeIndex;
	}
	return right.range.start.offset - left.range.start.offset;
}

export function resolveContract(
	template: ContractDocument,
	clauses: ClauseRegistry,
	controlValues: Readonly<ContractControlValues>,
	proposals: ReadonlyArray<ContractProposal> = []
): ResolvedContractDocument {
	const document: ResolvedContractDocument = {
		id: template.id,
		blocks: template.blocks.map((block): ResolvedBlockNode => {
			if (block.type === 'signature-grid') {
				return {
					...block,
					parties: [
						cloneSignatureParty(block.parties[0]),
						cloneSignatureParty(block.parties[1])
					]
				};
			}

			if (block.type === 'heading') {
				return {
					...block,
					content: block.content.map((node, nodeIndex) => cloneText(node, nodeIndex))
				};
			}

			return {
				...block,
				content: block.content.flatMap((node, nodeIndex): ResolvedTextNode[] =>
					node.type === 'text'
						? [cloneText(node, nodeIndex)]
						: resolveClause(node, nodeIndex, clauses, controlValues, proposals)
				)
			};
		})
	};

	const textProposals = proposals
		.filter((proposal): proposal is ContractTextProposal => proposal.kind === 'text')
		.sort(compareTextProposalsDescending);
	for (const proposal of textProposals) applyTextReplacement(document, proposal);
	return document;
}

export function getContractTitle(
	document: ContractDocument | ResolvedContractDocument
): string {
	const title = document.blocks.find(
		(block) => block.type === 'heading' && block.level === 1
	);
	if (!title || title.type !== 'heading') throw new Error('Contract title is missing.');
	return title.content.map((node) => node.value).join('');
}
