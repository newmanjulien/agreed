import type { ResolvedTextNode } from '../../contract/resolve.ts';
import type { SignatureGridNode } from '../../contract/types.ts';

export interface InlineToken extends ResolvedTextNode {
	type: 'text';
	isClauseStart?: boolean;
}

export type PageFragment = HeadingFragment | ParagraphFragment | SignatureFragment;

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

export interface SignatureFragment extends SignatureGridNode {
	type: 'signature-grid';
	blockKey: string;
}

export interface PageLayout {
	number: number;
	fragments: PageFragment[];
}
