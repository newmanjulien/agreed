export interface ContractDocument {
	id: string;
	blocks: BlockNode[];
}

export type BlockNode = HeadingNode | ParagraphNode | TableNode;

export interface HeadingNode {
	type: 'heading';
	anchor: string;
	level: 1 | 2 | 3;
	content: InlineNode[];
}

export interface ParagraphNode {
	type: 'paragraph';
	content: InlineNode[];
}

export interface TableNode {
	type: 'table';
	rows: string[][];
	variant?: 'signature';
}

export type InlineNode = TextNode | ClauseNode;

export interface TextNode {
	type: 'text';
	value: string;
	marks?: TextMarks;
}

export interface TextMarks {
	bold?: boolean;
	italic?: boolean;
}

export interface ClauseNode {
	type: 'clause';
	id: string;
	content: (TextNode | ProvisionNode)[];
}

export interface ProvisionNode {
	type: 'provision';
	id: string;
	content: TextNode[];
}
