import { tick } from 'svelte';
import { getDocumentViewportMetrics } from '$lib/contract/document/document-viewport';

export type ClauseWidgetTarget = {
	kind: 'clause';
	id: string;
	fragmentKey: string;
};

export type WidgetTarget = ClauseWidgetTarget;

export class WidgetPositioner {
	top = $state(0);
	element = $state<HTMLElement>();

	constructor(private readonly documentStage: () => HTMLElement | undefined) {}

	reset(): void {
		this.top = 0;
	}

	restoreFocus(target: WidgetTarget): void {
		const focusTarget = this.targetElement(target);
		if (focusTarget) {
			void tick().then(() => focusTarget.focus({ preventScroll: true }));
		}
	}

	findClause(clauseId: string, preferredFragmentKey?: string | null): HTMLElement | undefined {
		return this.findFragment(preferredFragmentKey, (element) => element.dataset.clauseId === clauseId);
	}

	async positionAfterRender(target: WidgetTarget | null): Promise<void> {
		await tick();
		this.updatePosition(target);
		this.ensureTargetVisible(target);
	}

	ensureTargetVisible(target: WidgetTarget | null): void {
		if (!target) return;
		const fragment = this.targetElement(target);
		const widget = this.element;
		if (!fragment || !widget) return;
		const anchor = widget.parentElement;
		if (!anchor || getComputedStyle(anchor).position !== 'fixed') return;

		const fragmentBounds = fragment.getBoundingClientRect();
		const widgetBounds = widget.getBoundingClientRect();
		const viewport = getDocumentViewportMetrics();
		const availableBottom = widgetBounds.top - viewport.gap;
		if (fragmentBounds.bottom > availableBottom) {
			window.scrollBy({ top: fragmentBounds.bottom - availableBottom });
		} else if (fragmentBounds.top < viewport.top) {
			window.scrollBy({ top: fragmentBounds.top - viewport.top });
		}
	}

	private findFragment(
		preferredFragmentKey: string | null | undefined,
		matchesTarget: (element: HTMLElement) => boolean
	): HTMLElement | undefined {
		const stage = this.documentStage();
		if (!stage) return undefined;
		const fragments = Array.from(
			stage.querySelectorAll<HTMLElement>('[data-clause-fragment-key]')
		);
		return (
			fragments.find(
				(fragment) =>
					matchesTarget(fragment) &&
					fragment.dataset.clauseFragmentKey === preferredFragmentKey
			) ?? fragments.find(matchesTarget)
		);
	}

	private targetElement(target: WidgetTarget): HTMLElement | undefined {
		return this.findClause(target.id, target.fragmentKey);
	}

	private updatePosition(target: WidgetTarget | null): void {
		const stage = this.documentStage();
		const fragment = target ? this.targetElement(target) : undefined;
		this.top =
			stage && fragment
				? fragment.getBoundingClientRect().top - stage.getBoundingClientRect().top
				: 0;
	}
}
