import type { ClauseWidgetType } from '../../model.ts';
import {
	HINT_COPY,
	clauseHintKey,
	clauseHintOwnerId,
	type HintKey
} from './widget-hints.ts';

interface ActiveHint {
	ownerId: string;
	key: HintKey;
}

export class HintSession {
	activeHint = $state<ActiveHint | null>(null);
	completedHints = $state<Record<HintKey, boolean>>({
		'clause:faq': false,
		'clause:changes': false
	});

	sync(clause?: { id: string; widgetType: ClauseWidgetType }): void {
		if (clause) this.open(clauseHintOwnerId(clause.id), clauseHintKey(clause.widgetType));
	}

	clauseText(clauseId: string, widgetType: ClauseWidgetType): string | undefined {
		const key = clauseHintKey(widgetType);
		return this.isVisible(clauseHintOwnerId(clauseId), key)
			? HINT_COPY[key]
			: undefined;
	}

	closeClause(clauseId: string): void {
		this.close(clauseHintOwnerId(clauseId));
	}

	private open(ownerId: string, key: HintKey): void {
		if (this.activeHint?.ownerId === ownerId && this.activeHint.key === key) return;
		this.completeActive();

		if (!this.completedHints[key]) this.activeHint = { ownerId, key };
	}

	private close(ownerId: string): void {
		if (this.activeHint?.ownerId !== ownerId) return;
		this.completeActive();
	}

	private isVisible(ownerId: string, key: HintKey): boolean {
		return this.activeHint?.ownerId === ownerId && this.activeHint.key === key;
	}

	private completeActive(): void {
		const activeHint = this.activeHint;
		if (!activeHint) return;

		this.completedHints[activeHint.key] = true;
		this.activeHint = null;
	}
}
