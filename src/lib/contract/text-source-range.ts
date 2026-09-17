import type { ResolvedTextNode } from './resolve.ts';
import type { TextSourcePoint, TextSourceRange } from './proposals.ts';

export function blockIndex(blockId: string): number | null {
	const match = /^block-(\d+)$/u.exec(blockId);
	return match ? Number(match[1]) : null;
}

function compareSourcePoints(left: TextSourcePoint, right: TextSourcePoint): number {
	return left.nodeIndex === right.nodeIndex
		? left.offset - right.offset
		: left.nodeIndex - right.nodeIndex;
}

export function sourceOverlapForNode(
	node: ResolvedTextNode,
	range: TextSourceRange
): { start: number; end: number } | null {
	const source = node.source;
	if (!source) return null;
	if (
		source.nodeIndex < range.start.nodeIndex ||
		source.nodeIndex > range.end.nodeIndex
	) {
		return null;
	}

	const start = Math.max(
		source.start,
		source.nodeIndex === range.start.nodeIndex ? range.start.offset : source.start
	);
	const end = Math.min(
		source.end,
		source.nodeIndex === range.end.nodeIndex ? range.end.offset : source.end
	);
	return start < end ? { start, end } : null;
}

export function textForSourceRange(
	content: ResolvedTextNode[],
	range: TextSourceRange
): string | null {
	if (compareSourcePoints(range.start, range.end) >= 0) return null;
	let hasStart = false;
	let hasEnd = false;
	let text = '';

	for (const node of content) {
		const source = node.source;
		if (!source) continue;
		if (
			source.nodeIndex === range.start.nodeIndex &&
			range.start.offset >= source.start &&
			range.start.offset < source.end
		) {
			hasStart = true;
		}
		if (
			source.nodeIndex === range.end.nodeIndex &&
			range.end.offset > source.start &&
			range.end.offset <= source.end
		) {
			hasEnd = true;
		}

		const overlap = sourceOverlapForNode(node, range);
		if (!overlap) continue;
		if (node.clauseId !== undefined || node.revisionState !== undefined) return null;
		text += node.value.slice(overlap.start - source.start, overlap.end - source.start);
	}

	return hasStart && hasEnd ? text : null;
}

export function sourceRangesOverlap(left: TextSourceRange, right: TextSourceRange): boolean {
	return (
		left.blockId === right.blockId &&
		compareSourcePoints(left.start, right.end) < 0 &&
		compareSourcePoints(left.end, right.start) > 0
	);
}
