export interface TextAnchorSegment {
	blockId: string;
	start: number;
	end: number;
	quote: string;
}

export interface TextAnchor {
	segments: TextAnchorSegment[];
}
