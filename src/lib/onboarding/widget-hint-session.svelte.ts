import type { ClauseWidgetType } from '../contract/model.ts';
import {
	ONBOARDING_HINT_COPY,
	REVIEW_HINT_OWNER_ID,
	clauseHintKey,
	clauseHintOwnerId,
	reviewHintKey,
	type OnboardingHintKey,
	type ReviewHintType
} from './widget-onboarding.ts';

interface ActiveHint {
	ownerId: string;
	key: OnboardingHintKey;
}

export class WidgetHintSession {
	activeHint = $state<ActiveHint | null>(null);
	completedHints = $state<Record<OnboardingHintKey, boolean>>({
		'clause:faq': false,
		'clause:changes': false,
		'review:comment': false,
		'review:proposal': false
	});

	sync(
		clause?: { id: string; widgetType: ClauseWidgetType },
		reviewAction?: ReviewHintType
	): void {
		if (clause) {
			this.open(clauseHintOwnerId(clause.id), clauseHintKey(clause.widgetType));
			return;
		}
		if (reviewAction) this.open(REVIEW_HINT_OWNER_ID, reviewHintKey(reviewAction));
	}

	clauseText(clauseId: string, widgetType: ClauseWidgetType): string | undefined {
		const key = clauseHintKey(widgetType);
		return this.isVisible(clauseHintOwnerId(clauseId), key)
			? ONBOARDING_HINT_COPY[key]
			: undefined;
	}

	reviewText(action?: ReviewHintType): string | undefined {
		if (!action) return undefined;
		const key = reviewHintKey(action);
		return this.isVisible(REVIEW_HINT_OWNER_ID, key)
			? ONBOARDING_HINT_COPY[key]
			: undefined;
	}

	closeClause(clauseId: string): void {
		this.close(clauseHintOwnerId(clauseId));
	}

	closeReview(): void {
		this.close(REVIEW_HINT_OWNER_ID);
	}

	private open(ownerId: string, key: OnboardingHintKey): void {
		if (this.activeHint?.ownerId === ownerId && this.activeHint.key === key) return;
		this.completeActive();

		if (!this.completedHints[key]) this.activeHint = { ownerId, key };
	}

	private close(ownerId: string): void {
		if (this.activeHint?.ownerId !== ownerId) return;
		this.completeActive();
	}

	private isVisible(ownerId: string, key: OnboardingHintKey): boolean {
		return this.activeHint?.ownerId === ownerId && this.activeHint.key === key;
	}

	private completeActive(): void {
		const activeHint = this.activeHint;
		if (!activeHint) return;

		this.completedHints[activeHint.key] = true;
		this.activeHint = null;
	}
}
