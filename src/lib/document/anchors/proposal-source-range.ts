import type { ResolvedContractDocument } from '../../contract/resolve.ts';
import type { TextSourcePoint, TextSourceRange } from '../../contract/proposals.ts';
import { blockIndex } from '../../contract/text-source-range.ts';
import type { TextAnchor } from './types.ts';

type IndexedCharacter = {
	value: string;
	start?: TextSourcePoint;
	end?: TextSourcePoint;
	selectable: boolean;
};

export function sourceRangeForAnchor(
	document: ResolvedContractDocument,
	anchor: TextAnchor
): TextSourceRange | null {
	if (anchor.segments.length !== 1) return null;
	const segment = anchor.segments[0];
	const index = blockIndex(segment.blockId);
	const block = index === null ? undefined : document.blocks[index];
	if (!block || block.type === 'signature-grid') return null;

	const characters: IndexedCharacter[] = [];
	for (const node of block.content) {
		let offset = 0;
		for (const character of node.value) {
			const nextOffset = offset + character.length;
			const whitespace = /\s/u.test(character);
			const value = whitespace ? ' ' : character;
			const start = node.source
				? { nodeIndex: node.source.nodeIndex, offset: node.source.start + offset }
				: undefined;
			const end = node.source
				? { nodeIndex: node.source.nodeIndex, offset: node.source.start + nextOffset }
				: undefined;
			const selectable = Boolean(
				node.source && node.clauseId === undefined && node.revisionState === undefined
			);

			if (whitespace && characters.length > 0 && characters.at(-1)?.value === ' ') {
				const previous = characters.at(-1)!;
				previous.end = end;
				previous.selectable &&= selectable;
				offset = nextOffset;
				continue;
			}
			if (whitespace && characters.length === 0) {
				offset = nextOffset;
				continue;
			}

			for (let index = 0; index < value.length; index += 1) {
				characters.push({ value: value[index], start, end, selectable });
			}
			offset = nextOffset;
		}
	}

	const selected = characters.slice(segment.start, segment.end);
	if (
		selected.length === 0 ||
		selected.map((character) => character.value).join('') !== segment.quote ||
		selected.some((character) => !character.selectable || !character.start || !character.end)
	) {
		return null;
	}

	return {
		blockId: segment.blockId,
		start: selected[0].start!,
		end: selected.at(-1)!.end!
	};
}
