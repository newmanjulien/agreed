import type { ContractDocument, TextNode } from './types';

export type ParagraphText = string | ReadonlyArray<string>;

export function toParagraphs(content: ParagraphText): ReadonlyArray<string> {
	return typeof content === 'string' ? [content] : content;
}

export interface ConcessionDefinition {
	targetProvisionId: string;
	paragraph: TextNode[];
}

export type ConcessionRegistry = Readonly<Record<string, ConcessionDefinition>>;

interface ClauseBoxBase {
	intro: ParagraphText;
	footerNote?: string;
}

export type ClauseBoxDefinition = ClauseBoxBase & (
	| { negotiation?: never; preferredConcessions?: never }
	| {
		negotiation: { body: ParagraphText };
		preferredConcessions?: {
			concessionIds: readonly [string, ...string[]];
			showInfoTooltip?: boolean;
		};
	}
);

export type ClauseBoxRegistry = Readonly<Record<string, ClauseBoxDefinition>>;

export interface CompiledContract {
	document: ContractDocument;
	clauseBoxes: ClauseBoxRegistry;
	concessions: ConcessionRegistry;
}
