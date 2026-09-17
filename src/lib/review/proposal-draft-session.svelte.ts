import { clearCustomHighlights, setCustomHighlight } from '../document/highlights/custom-highlights.ts';
import { resolveTextAnchor } from '../document/anchors/text-anchor.ts';
import type { ProposalTarget } from './proposal-target.ts';

const PROPOSAL_DRAFT_HIGHLIGHT = 'agreed-review-proposal-draft';

export class ProposalDraftSession {
	target = $state<ProposalTarget | null>(null);
	ranges = $state<Range[]>([]);
	draftId = $state(0);

	#documentElement: HTMLElement | undefined;
	#observer: MutationObserver | undefined;
	#refreshQueued = false;

	setDocumentElement(element: HTMLElement | undefined): void {
		if (element === this.#documentElement) return;

		this.#observer?.disconnect();
		this.#observer = undefined;
		this.#documentElement = element;
		this.refresh();

		if (!element || typeof MutationObserver === 'undefined') return;
		this.#observer = new MutationObserver(() => this.#scheduleRefresh());
		this.#observer.observe(element, {
			childList: true,
			characterData: true,
			subtree: true
		});
	}

	start(target: ProposalTarget): void {
		this.draftId += 1;
		this.target = target;
		this.refresh();
	}

	cancel(): boolean {
		if (!this.target) return false;
		this.target = null;
		this.ranges = [];
		this.#renderHighlight();
		return true;
	}

	refresh(): void {
		const element = this.#documentElement;
		const target = this.target;
		if (!element || target?.kind !== 'text') {
			this.ranges = [];
			this.#renderHighlight();
			return;
		}

		const resolved = resolveTextAnchor(element, target.anchor);
		if (resolved && resolved.anchor !== target.anchor) {
			this.target = { ...target, anchor: resolved.anchor };
		}
		this.ranges = resolved?.ranges ?? [];
		this.#renderHighlight();
	}

	destroy(): void {
		this.#observer?.disconnect();
		this.#observer = undefined;
		this.#documentElement = undefined;
		this.target = null;
		this.ranges = [];
		clearCustomHighlights(PROPOSAL_DRAFT_HIGHLIGHT);
	}

	#renderHighlight(): void {
		clearCustomHighlights(PROPOSAL_DRAFT_HIGHLIGHT);
		setCustomHighlight(PROPOSAL_DRAFT_HIGHLIGHT, this.ranges, 2);
	}

	#scheduleRefresh(): void {
		if (this.#refreshQueued) return;
		this.#refreshQueued = true;
		queueMicrotask(() => {
			this.#refreshQueued = false;
			this.refresh();
		});
	}
}
