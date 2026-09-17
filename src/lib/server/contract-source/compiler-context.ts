import type { DefaultTreeAdapterTypes } from 'parse5';
import type { BlockNode } from '../../contract/types.ts';
import type { ContractSourceIssue } from '../../contract/source-result.ts';
import type { ClauseRegistry } from '../../contract/model.ts';

export type HtmlNode = DefaultTreeAdapterTypes.ChildNode;
export type HtmlElement = DefaultTreeAdapterTypes.Element;

export interface CompileState {
	issues: ContractSourceIssue[];
	clauseIds: Set<string>;
	clauseDocumentValueIds: Map<string, Set<string>>;
	headingIds: Set<string>;
	clauses: ClauseRegistry;
}

export interface CompiledBlock {
	block: BlockNode;
	source: HtmlElement;
}

export const SLUG = /^[a-z][a-z0-9-]*$/u;
export const CLAUSE_HIGHLIGHT_TONES = new Set(['informational', 'editable']);

export function createCompileState(clauses: ClauseRegistry): CompileState {
	return {
		issues: [],
		clauseIds: new Set<string>(),
		clauseDocumentValueIds: new Map<string, Set<string>>(),
		headingIds: new Set<string>(),
		clauses
	};
}

export function isElement(node: HtmlNode): node is HtmlElement {
	return 'tagName' in node;
}

export function isText(node: HtmlNode): node is DefaultTreeAdapterTypes.TextNode {
	return node.nodeName === '#text';
}

function sourcePosition(
	node?: HtmlNode,
	attributeName?: string
): Pick<ContractSourceIssue, 'line' | 'column'> {
	if (!node?.sourceCodeLocation) return {};

	const attributeLocation =
		attributeName && isElement(node)
			? node.sourceCodeLocation.attrs?.[attributeName]
			: undefined;
	const location = attributeLocation ?? node.sourceCodeLocation;
	return { line: location.startLine, column: location.startCol };
}

export function addIssue(
	state: CompileState,
	code: string,
	message: string,
	node?: HtmlNode,
	attributeName?: string
): void {
	state.issues.push({ code, message, ...sourcePosition(node, attributeName) });
}
