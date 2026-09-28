export interface TextMatch {
	start: number;
	end: number;
}

export interface DocumentSearchResult extends TextMatch {
	blockId: string;
	range: Range;
}
