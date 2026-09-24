import type { HeadingNode, ParagraphNode, TableNode, TextNode } from './types';

export interface ResolvedTextNode extends TextNode {
	removed?: true;
}

export type ResolvedInlineNode = ResolvedTextNode | {
	type: 'clause';
	id: string;
	content: ResolvedTextNode[];
};

export type ResolvedBlockNode =
	| (Omit<HeadingNode, 'content'> & { content: ResolvedInlineNode[] })
	| (Omit<ParagraphNode, 'content'> & { content: ResolvedInlineNode[] })
	| TableNode;

export interface ResolvedContract {
	id: string;
	blocks: ResolvedBlockNode[];
}
