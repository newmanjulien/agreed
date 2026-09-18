import { tick } from 'svelte';
import { CLAUSE_REFERENCE_DURATION_MS } from './clause-reference.ts';

export class ClauseReferenceController {
	clauseId = $state<string | null>(null);
	private timer?: ReturnType<typeof setTimeout>;
	private navigationId = 0;

	constructor(private readonly findClause: (clauseId: string) => HTMLElement | undefined) {}

	clear(): void {
		this.navigationId += 1;
		this.reset();
	}

	private reset(): void {
		if (this.timer) clearTimeout(this.timer);
		this.timer = undefined;
		this.clauseId = null;
	}

	async navigate(clauseId: string, beforeNavigate: () => void): Promise<void> {
		const navigationId = ++this.navigationId;
		beforeNavigate();
		this.reset();
		await tick();
		if (navigationId !== this.navigationId) return;
		this.clauseId = clauseId;
		await tick();
		if (navigationId !== this.navigationId) return;

		const fragment = this.findClause(clauseId);
		if (!fragment) {
			this.clear();
			return;
		}

		fragment.focus({ preventScroll: true });
		fragment.scrollIntoView({
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'auto'
				: 'smooth',
			block: 'center'
		});

		this.timer = setTimeout(() => {
			if (navigationId === this.navigationId) this.clear();
		}, CLAUSE_REFERENCE_DURATION_MS);
	}

	destroy(): void {
		this.clear();
	}
}
