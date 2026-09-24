import type { TableNode } from '../types';
import type { ResolvedTextNode } from '../resolved-types';

export interface InlineToken extends ResolvedTextNode {
	type: 'text';
	clauseId?: string;
}

export type PageFragment = HeadingFragment | ParagraphFragment | TableFragment;

export interface HeadingFragment {
	type: 'heading';
	blockKey: string;
	anchor: string;
	level: 1 | 2 | 3;
	tokens: InlineToken[];
}

export interface ParagraphFragment {
	type: 'paragraph';
	blockKey: string;
	tokens: InlineToken[];
	isContinuation: boolean;
	isFinal: boolean;
}

export interface TableFragment extends TableNode {
	type: 'table';
	blockKey: string;
}

export interface PageLayout {
	number: number;
	fragments: PageFragment[];
}
