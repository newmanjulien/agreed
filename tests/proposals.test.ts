import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import JSZip from 'jszip';
import type { ClauseRegistry } from '../src/lib/contract/model.ts';
import type { ContractTextProposal } from '../src/lib/contract/proposals.ts';
import {
	applyTextReplacement,
	UnresolvedTextReplacementError
} from '../src/lib/contract/apply-text-replacement.ts';
import { createContractDocx } from '../src/lib/document/export/docx/create-contract-docx.ts';
import {
	resolveContract,
	type ResolvedContractDocument
} from '../src/lib/contract/resolve.ts';
import type { ContractDocument } from '../src/lib/contract/types.ts';
import { sourceRangeForAnchor } from '../src/lib/document/anchors/proposal-source-range.ts';

globalThis.$state = (<Value>(value: Value) => value) as typeof $state;
const { ContractSession } = await import('../src/lib/contract/session.svelte.ts');

function documentWithText(): ResolvedContractDocument {
	return {
		id: 'proposal-test',
		blocks: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						value: 'Alpha ',
						source: { nodeIndex: 0, start: 0, end: 6 }
					},
					{
						type: 'text',
						value: 'bold',
						marks: { bold: true },
						source: { nodeIndex: 1, start: 0, end: 4 }
					},
					{
						type: 'text',
						value: ' ending',
						source: { nodeIndex: 2, start: 0, end: 7 }
					}
				]
			}
		]
	};
}

function textProposal(
	id: string,
	originalText: string,
	text: string,
	start: { nodeIndex: number; offset: number },
	end: { nodeIndex: number; offset: number }
): ContractTextProposal {
	return {
		kind: 'text',
		id,
		originalText,
		text,
		range: { blockId: 'block-0', start, end }
	};
}

describe('contract text proposals', () => {
	it('maps normalized rendered text back to its exact source range', () => {
		const template: ContractDocument = {
			id: 'normalized-source-range',
			blocks: [
				{
					type: 'paragraph',
					content: [
						{ type: 'text', value: 'Alpha  ' },
						{ type: 'text', value: '\n beta' }
					]
				}
			]
		};
		const session = new ContractSession();
		const range = sourceRangeForAnchor(session.snapshot(template, {}), {
			segments: [{ blockId: 'block-0', start: 3, end: 8, quote: 'ha be' }]
		});
		assert.ok(range);
		const result = session.prepareTextProposal(
			template,
			{},
			range,
			'new'
		);

		assert.equal(result.ok, true);
		if (!result.ok) return;
		const change = result.value;
		const proposal = change.proposals.find(
			(candidate) => candidate.id === change.proposalId
		);
		assert.equal(proposal?.kind, 'text');
		if (proposal?.kind !== 'text') return;
		assert.deepEqual(proposal.range, {
			blockId: 'block-0',
			start: { nodeIndex: 0, offset: 3 },
			end: { nodeIndex: 1, offset: 4 }
		});
		assert.equal(proposal.originalText, 'ha  \n be');
		const block = change.document.blocks[0];
		assert.notEqual(block.type, 'signature-grid');
		if (block.type !== 'signature-grid') {
			assert.equal(block.content.map((node) => node.value).join(''), 'Alpnewta');
		}
	});

	it('restores a clause control to its prior non-default value when deleted', () => {
		const template: ContractDocument = {
			id: 'clause-restore',
			blocks: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'clause',
							id: 'term',
							content: [{ type: 'text', value: 'Original wording' }]
						}
					]
				}
			]
		};
		const clauses: ClauseRegistry = {
			term: {
				title: 'Term',
				highlightTone: 'editable',
				widget: {
					type: 'changes',
					prompt: 'Choose wording',
					appliedMessage: 'Applied',
					control: {
						id: 'wording',
						label: 'Wording',
						defaultValue: 'standard',
						options: [
							{
								kind: 'value',
								value: 'standard',
								controlLabel: 'Standard',
								documentLabel: 'Standard'
							},
							{
								kind: 'deactivate',
								value: 'inactive',
								controlLabel: 'Inactive',
								documentLabel: 'Inactive'
							},
							{ kind: 'custom', value: 'custom', controlLabel: 'Custom' }
						]
					}
				}
			}
		};
		const session = new ContractSession();
		session.controlValues = { term: { wording: 'inactive' } };
		const createdResult = session.prepareClauseProposal(
			template,
			clauses,
			'term',
			'custom',
			'Proposed wording'
		);
		assert.equal(createdResult.ok, true);
		if (!createdResult.ok) return;
		const created = createdResult.value;
		session.commit(created);

		const deletedResult = session.prepareProposalDeletion(
			template,
			clauses,
			created.proposalId
		);
		assert.equal(deletedResult.ok, true);
		if (!deletedResult.ok) return;
		const deleted = deletedResult.value;
		assert.equal(deleted.controlValues.term.wording, 'inactive');
		assert.equal(deleted.proposals.length, 0);
	});

	it('replaces a source range across formatted runs', () => {
		const document = documentWithText();
		applyTextReplacement(
			document,
			textProposal(
				'proposal-test',
				'ha bold en',
				'proposal',
				{ nodeIndex: 0, offset: 3 },
				{ nodeIndex: 2, offset: 3 }
			)
		);

		const block = document.blocks[0];
		assert.notEqual(block.type, 'signature-grid');
		if (block.type === 'signature-grid') return;
		assert.deepEqual(block.content, [
			{
				type: 'text',
				value: 'Alp',
				source: { nodeIndex: 0, start: 0, end: 3 }
			},
			{
				type: 'text',
				value: 'proposal',
				proposalId: 'proposal-test',
				revisionState: 'proposed'
			},
			{
				type: 'text',
				value: 'ding',
				source: { nodeIndex: 2, start: 3, end: 7 }
			}
		]);
	});

	it('targets repeated wording by source position and rejects invalid ranges', () => {
		const repeated: ResolvedContractDocument = {
			id: 'repeated-test',
			blocks: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							value: 'same and same',
							source: { nodeIndex: 0, start: 0, end: 13 }
						}
					]
				}
			]
		};
		applyTextReplacement(
			repeated,
			textProposal(
				'second-same',
				'same',
				'proposal',
				{ nodeIndex: 0, offset: 9 },
				{ nodeIndex: 0, offset: 13 }
			)
		);
		const repeatedBlock = repeated.blocks[0];
		if (repeatedBlock.type !== 'signature-grid') {
			assert.equal(repeatedBlock.content.map((node) => node.value).join(''), 'same and proposal');
		}

		assert.throws(
			() =>
				applyTextReplacement(
					documentWithText(),
					textProposal(
						'invalid',
						'bold',
						'proposal',
						{ nodeIndex: 1, offset: 4 },
						{ nodeIndex: 1, offset: 0 }
					)
				),
			UnresolvedTextReplacementError
		);

		const highlighted = documentWithText();
		const highlightedBlock = highlighted.blocks[0];
		if (highlightedBlock.type !== 'signature-grid') {
			highlightedBlock.content[1].revisionState = 'proposed';
		}
		assert.throws(
			() =>
				applyTextReplacement(
					highlighted,
					textProposal(
						'highlighted',
						'bold',
						'proposal',
						{ nodeIndex: 1, offset: 0 },
						{ nodeIndex: 1, offset: 4 }
					)
				),
			UnresolvedTextReplacementError
		);
	});

	it('keeps same-block proposals independent when an earlier proposal changes', () => {
		const template: ContractDocument = {
			id: 'independent-proposals',
			blocks: [
				{
					type: 'paragraph',
					content: [{ type: 'text', value: 'same then same' }]
				}
			]
		};
		const first = textProposal(
			'first',
			'same',
			'a much longer proposal',
			{ nodeIndex: 0, offset: 0 },
			{ nodeIndex: 0, offset: 4 }
		);
		const second = textProposal(
			'second',
			'same',
			'second proposal',
			{ nodeIndex: 0, offset: 10 },
			{ nodeIndex: 0, offset: 14 }
		);

		const initial = resolveContract(template, {}, {}, [first, second]);
		const edited = resolveContract(template, {}, {}, [
			{ ...first, text: 'short' },
			second
		]);
		const firstDeleted = resolveContract(template, {}, {}, [second]);
		const blockText = (document: ResolvedContractDocument) => {
			const block = document.blocks[0];
			return block.type === 'signature-grid'
				? ''
				: block.content.map((node) => node.value).join('');
		};

		assert.equal(initial && blockText(initial), 'a much longer proposal then second proposal');
		assert.equal(edited && blockText(edited), 'short then second proposal');
		assert.equal(firstDeleted && blockText(firstDeleted), 'same then second proposal');
	});

	it('exports proposed wording as yellow highlight without strikethrough', async () => {
		const document = documentWithText();
		applyTextReplacement(
			document,
			textProposal(
				'proposal-test',
				'bold',
				'proposal',
				{ nodeIndex: 1, offset: 0 },
				{ nodeIndex: 1, offset: 4 }
			)
		);
		document.blocks.unshift({
			type: 'heading',
			anchor: 'proposal-test',
			level: 1,
			content: [{ type: 'text', value: 'Proposal test' }]
		});

		const blob = await createContractDocx(document);
		const archive = await JSZip.loadAsync(new Uint8Array(await blob.arrayBuffer()));
		const xml = await archive.file('word/document.xml')?.async('string');

		assert.ok(xml);
		assert.match(xml, /<w:highlight w:val="yellow"\/>/u);
		assert.doesNotMatch(xml, /<w:strike/u);
	});
});
