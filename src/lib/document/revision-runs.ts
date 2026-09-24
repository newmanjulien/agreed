import type { InlineToken } from './pagination/types';

export interface RevisionRun {
	removed: boolean;
	tokens: InlineToken[];
}

export function groupRevisionRuns(tokens: InlineToken[]): RevisionRun[] {
	const runs: RevisionRun[] = [];
	for (const token of tokens) {
		const previous = runs.at(-1);
		const removed = token.removed === true;
		if (
			previous && previous.removed === removed &&
			(!removed ||
				(previous.tokens[0].marks?.bold === token.marks?.bold &&
					previous.tokens[0].marks?.italic === token.marks?.italic))
		) {
			previous.tokens.push(token);
		} else {
			runs.push({ removed, tokens: [token] });
		}
	}
	return runs;
}
