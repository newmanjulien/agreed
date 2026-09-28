import type {
	ClauseWidgetTarget,
	WidgetTarget
} from './widgets/widget-positioner.svelte';

export type WorkspaceInteraction = { kind: 'clause'; target: ClauseWidgetTarget } | null;

interface WorkspaceInteractionHooks {
	clearClauseReference: () => void;
	onClauseClosed: (clauseId: string) => void;
	onWidgetClosed: () => void;
	restoreWidgetFocus: (target: WidgetTarget) => void;
}

export class WorkspaceInteractionController {
	active = $state<WorkspaceInteraction>(null);

	constructor(private readonly hooks: WorkspaceInteractionHooks) {}

	get widgetTarget(): WidgetTarget | null {
		return this.active?.kind === 'clause' ? this.active.target : null;
	}

	get clauseId(): string | null {
		return this.widgetTarget?.id ?? null;
	}

	openWidget(target: WidgetTarget): void {
		this.#clearActiveInteraction();
		this.hooks.clearClauseReference();
		this.active = { kind: 'clause', target };
	}

	closeWidget(restoreFocus = false): void {
		if (this.active?.kind !== 'clause') return;
		const target = this.active.target;
		this.hooks.onClauseClosed(target.id);
		this.active = null;
		this.hooks.onWidgetClosed();
		if (restoreFocus) this.hooks.restoreWidgetFocus(target);
	}

	dismissForOutsideClick(isInteractiveTarget: boolean): void {
		if (this.active && !isInteractiveTarget) this.closeWidget();
	}

	cancelActive(restoreFocus = false): boolean {
		if (!this.active) return false;
		this.closeWidget(restoreFocus);
		this.hooks.clearClauseReference();
		return true;
	}

	#clearActiveInteraction(): void {
		const active = this.active;
		if (!active) return;
		this.hooks.onClauseClosed(active.target.id);
		this.active = null;
		this.hooks.onWidgetClosed();
	}
}
