import { parseFragment, type ParserError } from 'parse5';
import type {
	BlockNode,
	HeadingNode,
	ParagraphNode,
	SignatureGridNode,
	SignaturePartyNode,
	ClauseNode,
	TextMarks,
	TextNode,
	ValueNode
} from '../../contract/types.ts';
import type { ContractSourceIssue } from '../../contract/source-result.ts';
import {
	SLUG,
	addIssue,
	isElement,
	isText,
	type CompileState,
	type CompiledBlock,
	type HtmlElement,
	type HtmlNode
} from './compiler-context.ts';

type SpecialInlineNode = ClauseNode | ValueNode;
const NO_ATTRIBUTES = new Set<string>();
const ID_ATTRIBUTE = new Set(['id']);
const SIGNATURE_ATTRIBUTES = new Set(['provider', 'customer']);

function normalizeText(value: string): string {
	return value.replace(/[\t\n\f\r ]+/gu, ' ');
}

function sameMarks(left: TextNode, right: TextNode): boolean {
	return (
		Boolean(left.marks?.bold) === Boolean(right.marks?.bold) &&
		Boolean(left.marks?.italic) === Boolean(right.marks?.italic)
	);
}

function appendText<T extends SpecialInlineNode>(
	output: Array<TextNode | T>,
	value: string,
	marks: TextMarks
): void {
	let normalized = normalizeText(value);
	const previous = output.at(-1);
	if (normalized.startsWith(' ') && previous?.type === 'text' && previous.value.endsWith(' ')) {
		normalized = normalized.slice(1);
	}
	const next: TextNode = {
		type: 'text',
		value: normalized,
		...(marks.bold || marks.italic ? { marks: { ...marks } } : {})
	};
	if (previous?.type === 'text' && sameMarks(previous, next)) {
		output[output.length - 1] = { ...previous, value: previous.value + next.value };
		return;
	}

	output.push(next);
}

function trimBoundaryWhitespace<T extends SpecialInlineNode>(
	nodes: Array<TextNode | T>
): Array<TextNode | T> {
	if (!nodes.length) return nodes;

	return nodes
		.map((node, index) => {
			if (node.type !== 'text') return node;
			let value = node.value;
			if (index === 0) value = value.trimStart();
			if (index === nodes.length - 1) value = value.trimEnd();
			return value === node.value ? node : { ...node, value };
		})
		.filter((node) => node.type !== 'text' || node.value.length > 0);
}

function readAttributes(
	element: HtmlElement,
	allowed: ReadonlySet<string>,
	state: CompileState
): Record<string, string> {
	const values: Record<string, string> = {};

	for (const attribute of element.attrs) {
		if (!allowed.has(attribute.name)) {
			addIssue(
				state,
				'unsupported-attribute',
				`<${element.tagName}> does not support the "${attribute.name}" attribute.`,
				element,
				attribute.name
			);
			continue;
		}
		values[attribute.name] = attribute.value;
	}

	return values;
}

function requireClosingTag(element: HtmlElement, state: CompileState): void {
	if (element.sourceCodeLocation && !element.sourceCodeLocation.endTag) {
		addIssue(
			state,
			'missing-closing-tag',
			`<${element.tagName}> must have a closing tag.`,
			element
		);
	}
}

function compileValue(
	element: HtmlElement,
	state: CompileState,
	marks: TextMarks,
	clauseId?: string
): ValueNode | null {
	const issueCount = state.issues.length;
	const id = readAttributes(element, ID_ATTRIBUTE, state).id;
	requireClosingTag(element, state);

	if (!id) {
		addIssue(state, 'missing-value-id', '<contract-value> requires an id.', element);
	} else if (!SLUG.test(id)) {
		addIssue(state, 'invalid-value-id', `Value id "${id}" must be a lowercase slug.`, element);
	} else if (clauseId) {
		const valueIds = state.clauseDocumentValueIds.get(clauseId) ?? new Set<string>();
		valueIds.add(id);
		state.clauseDocumentValueIds.set(clauseId, valueIds);

		if (!state.clauses[clauseId]?.values?.[id]) {
			addIssue(
				state,
				'unknown-clause-value',
				`Clause "${clauseId}" does not define value "${id}".`,
				element
			);
		}
	}

	if (element.childNodes.some((child) => !isText(child) || child.value.trim())) {
		addIssue(state, 'value-content', '<contract-value> must be empty.', element);
	}

	return state.issues.length === issueCount && id
		? {
				type: 'value',
				id,
				...(marks.bold || marks.italic ? { marks: { ...marks } } : {})
			}
		: null;
}

function compileInline<T extends SpecialInlineNode>(
	nodes: HtmlNode[],
	state: CompileState,
	context: string,
	compileElement: (element: HtmlElement, marks: TextMarks) => T | null
): Array<TextNode | T> {
	const output: Array<TextNode | T> = [];

	function visit(children: HtmlNode[], marks: TextMarks): void {
		for (const node of children) {
			if (isText(node)) {
				appendText(output, node.value, marks);
				continue;
			}
			if (!isElement(node)) {
				addIssue(state, 'unsupported-content', `${context} content must be text.`, node);
				continue;
			}

			if (node.tagName === 'strong' || node.tagName === 'em') {
				readAttributes(node, NO_ATTRIBUTES, state);
				requireClosingTag(node, state);
				visit(node.childNodes, {
					...marks,
					...(node.tagName === 'strong' ? { bold: true } : { italic: true })
				});
				continue;
			}

			const compiled = compileElement(node, marks);
			if (compiled) output.push(compiled);
		}
	}

	visit(nodes, {});
	return trimBoundaryWhitespace(output);
}

function compileClause(
	element: HtmlElement,
	state: CompileState,
	paragraphClauseIds: Set<string>
): ClauseNode | null {
	const issueCount = state.issues.length;
	const id = readAttributes(element, ID_ATTRIBUTE, state).id;
	requireClosingTag(element, state);

	if (!id) {
		addIssue(state, 'missing-clause-id', '<contract-clause> requires an id.', element);
	} else if (!SLUG.test(id)) {
		addIssue(state, 'invalid-clause-id', `Clause id "${id}" must be a lowercase slug.`, element);
	} else if (state.clauseIds.has(id) || paragraphClauseIds.has(id)) {
		addIssue(state, 'duplicate-clause-id', `Duplicate clause id "${id}".`, element);
	}

	const content = compileInline<ValueNode>(
		element.childNodes,
		state,
		'a clause',
		(node, childMarks) => {
			if (node.tagName === 'contract-value') {
				return compileValue(node, state, childMarks, id);
			}
			if (node.tagName === 'contract-clause') {
				addIssue(state, 'nested-clause', 'Clauses cannot be nested.', node);
			} else {
				addIssue(
					state,
					'unsupported-inline-content',
					`<${node.tagName}> is not supported inside a clause.`,
					node
				);
			}
			return null;
		}
	);
	if (
		state.issues.length === issueCount &&
		!content.some((node) => node.type === 'value' || Boolean(node.value.trim()))
	) {
		addIssue(state, 'empty-clause', 'Clauses cannot be empty.', element);
	}

	if (state.issues.length !== issueCount || !id) return null;
	paragraphClauseIds.add(id);
	return { type: 'clause', id, content };
}

function compileHeading(element: HtmlElement, state: CompileState): HeadingNode | null {
	const issueCount = state.issues.length;
	const anchor = readAttributes(element, ID_ATTRIBUTE, state).id;
	requireClosingTag(element, state);

	if (!anchor) {
		addIssue(state, 'missing-heading-id', `<${element.tagName}> requires an id.`, element);
	} else if (!SLUG.test(anchor)) {
		addIssue(
			state,
			'invalid-heading-id',
			`Heading id "${anchor}" must be a lowercase slug.`,
			element
		);
	} else if (state.headingIds.has(anchor)) {
		addIssue(state, 'duplicate-heading-id', `Duplicate heading id "${anchor}".`, element);
	}

	const content = compileInline<never>(element.childNodes, state, 'a heading', (node) => {
		if (node.tagName === 'contract-clause') {
			addIssue(state, 'clause-outside-paragraph', 'Clauses must be directly inside a paragraph.', node);
		} else if (node.tagName === 'contract-value') {
			addIssue(state, 'value-outside-clause', 'Values must be inside a clause.', node);
		} else {
			addIssue(
				state,
				'unsupported-inline-content',
				`<${node.tagName}> is not supported inside a heading.`,
				node
			);
		}
		return null;
	});
	if (state.issues.length === issueCount && !content.some((item) => item.value.trim())) {
		addIssue(state, 'empty-heading', 'Headings cannot be empty.', element);
	}

	if (state.issues.length !== issueCount || !anchor) return null;
	state.headingIds.add(anchor);
	return {
		type: 'heading',
		anchor,
		level: Number(element.tagName.slice(1)) as 1 | 2 | 3,
		content
	};
}

function compileParagraph(element: HtmlElement, state: CompileState): ParagraphNode | null {
	const issueCount = state.issues.length;
	const paragraphClauseIds = new Set<string>();
	readAttributes(element, NO_ATTRIBUTES, state);
	requireClosingTag(element, state);
	const content = compileInline<ClauseNode>(element.childNodes, state, 'a paragraph', (node, marks) => {
		if (node.tagName === 'contract-clause') {
			if (marks.bold || marks.italic) {
				addIssue(state, 'formatted-clause', 'A clause cannot be wrapped in <strong> or <em>.', node);
				return null;
			}
			return compileClause(node, state, paragraphClauseIds);
		}
		if (node.tagName === 'contract-value') {
			addIssue(state, 'value-outside-clause', 'Values must be inside a clause.', node);
		} else {
			addIssue(
				state,
				'unsupported-inline-content',
				`<${node.tagName}> is not supported inside a paragraph.`,
				node
			);
		}
		return null;
	});

	if (
		state.issues.length === issueCount &&
		!content.some((node) => node.type === 'clause' || Boolean(node.value.trim()))
	) {
		addIssue(state, 'empty-paragraph', 'Paragraphs cannot be empty.', element);
	}

	if (state.issues.length !== issueCount) return null;
	for (const clauseId of paragraphClauseIds) state.clauseIds.add(clauseId);
	return { type: 'paragraph', content };
}

function signatureParty(name: string): SignaturePartyNode {
	return {
		name,
		fields: [
			{ label: 'By', kind: 'signature-line' },
			{ label: 'Name', kind: 'text', value: '[Name]', marks: { bold: true } },
			{ label: 'Title', kind: 'text', value: '[Title]', marks: { bold: true } },
			{ label: 'Date', kind: 'text', value: '[Date]', marks: { bold: true } }
		]
	};
}

function compileSignatures(element: HtmlElement, state: CompileState): SignatureGridNode | null {
	const issueCount = state.issues.length;
	const attributes = readAttributes(element, SIGNATURE_ATTRIBUTES, state);
	requireClosingTag(element, state);

	if (!attributes.provider || !attributes.customer) {
		addIssue(
			state,
			'missing-signature-party',
			'<contract-signatures> requires provider and customer attributes.',
			element
		);
	}
	if (element.childNodes.some((child) => !isText(child) || child.value.trim())) {
		addIssue(state, 'signature-content', '<contract-signatures> must be empty.', element);
	}

	if (state.issues.length !== issueCount || !attributes.provider || !attributes.customer) {
		return null;
	}

	return {
		type: 'signature-grid',
		title: 'SIGNATURES',
		parties: [signatureParty(attributes.provider), signatureParty(attributes.customer)]
	};
}

export function parseSource(source: string):
	| { ok: true; nodes: HtmlNode[] }
	| { ok: false; issues: ContractSourceIssue[] } {
	const issues: ContractSourceIssue[] = [];
	const fragment = parseFragment(source.replace(/^\uFEFF/u, ''), {
		sourceCodeLocationInfo: true,
		scriptingEnabled: false,
		onParseError(error: ParserError) {
			issues.push({
				code: `html-${error.code}`,
				message: 'The contract contains malformed HTML near this location.',
				line: error.startLine,
				column: error.startCol
			});
		}
	});

	return issues.length
		? { ok: false, issues }
		: { ok: true, nodes: fragment.childNodes };
}

export function compileSourceBlocks(
	nodes: HtmlNode[],
	state: CompileState
): CompiledBlock[] {
	const compiled: CompiledBlock[] = [];

	for (const node of nodes) {
		if (isText(node) && !node.value.trim()) continue;
		if (!isElement(node)) {
			addIssue(
				state,
				'unsupported-document-content',
				'Only contract elements are allowed here.',
				node
			);
			continue;
		}

		let block: BlockNode | null = null;
		if (node.tagName === 'h1' || node.tagName === 'h2' || node.tagName === 'h3') {
			block = compileHeading(node, state);
		} else if (node.tagName === 'p') {
			block = compileParagraph(node, state);
		} else if (node.tagName === 'contract-signatures') {
			block = compileSignatures(node, state);
		} else {
			addIssue(
				state,
				'unsupported-document-element',
				`<${node.tagName}> is not a supported contract element.`,
				node
			);
		}

		if (block) compiled.push({ block, source: node });
	}

	return compiled;
}
