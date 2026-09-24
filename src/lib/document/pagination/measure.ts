import type { InlineToken, PageFragment } from './types';
import { PAGE_FORMAT } from './page-format.ts';
import { groupRevisionRuns } from '../revision-runs';

export interface PageMeasurement {
	fits(fragments: PageFragment[], pageIndex: number): boolean;
}

function appendInlineTokens(container: HTMLElement, tokens: InlineToken[]) {
	for (const run of groupRevisionRuns(tokens)) {
		if (run.removed) {
			const removed = document.createElement('span');
			removed.className = 'contract-revision-removed';
			removed.classList.toggle('revision-bold', Boolean(run.tokens[0].marks?.bold));
			removed.classList.toggle('revision-italic', Boolean(run.tokens[0].marks?.italic));
			removed.dataset.removedText = run.tokens.map((token) => token.value).join('');
			container.appendChild(removed);
			continue;
		}

		for (const token of run.tokens) {
			let node: Node = document.createTextNode(token.value);
			if (token.marks?.italic) {
				const emphasis = document.createElement('em');
				emphasis.appendChild(node);
				node = emphasis;
			}
			if (token.marks?.bold) {
				const strong = document.createElement('strong');
				strong.appendChild(node);
				node = strong;
			}
			container.appendChild(node);
		}
	}
}

function createFragmentElement(fragment: PageFragment): HTMLElement {
	if (fragment.type === 'heading') {
		const heading = document.createElement(`h${fragment.level}`);
		heading.className = 'contract-block contract-heading';
		heading.dataset.blockId = fragment.blockKey;
		appendInlineTokens(heading, fragment.tokens);
		return heading;
	}

	if (fragment.type === 'paragraph') {
		const paragraph = document.createElement('p');
		paragraph.className = 'contract-block contract-paragraph';
		paragraph.classList.toggle('is-continuation', fragment.isContinuation);
		paragraph.classList.toggle('is-final', fragment.isFinal);
		paragraph.dataset.blockId = fragment.blockKey;
		appendInlineTokens(paragraph, fragment.tokens);
		return paragraph;
	}

	const table = document.createElement('table');
	table.className = 'contract-block contract-table';
	table.classList.toggle('signature-table', fragment.variant === 'signature');
	table.dataset.blockId = fragment.blockKey;
	const head = table.createTHead();
	const body = table.createTBody();
	for (const [rowIndex, cells] of fragment.rows.entries()) {
		const row = (rowIndex === 0 ? head : body).insertRow();
		for (const cell of cells) {
			const element = rowIndex === 0 ? document.createElement('th') : row.insertCell();
			if (rowIndex === 0) element.setAttribute('scope', 'col');
			element.textContent = cell;
			if (rowIndex === 0) row.appendChild(element);
		}
	}
	return table;
}

export function createPageMeasurement(
	surface: HTMLElement
): PageMeasurement {
	return {
		fits(fragments, pageIndex) {
			surface.replaceChildren(...fragments.map(createFragmentElement));

			const topPadding =
				pageIndex === 0 ? PAGE_FORMAT.firstTopPadding : PAGE_FORMAT.topPadding;
			const capacity = PAGE_FORMAT.height - topPadding - PAGE_FORMAT.bottomPadding;
			return surface.scrollHeight <= capacity + 0.5;
		}
	};
}
