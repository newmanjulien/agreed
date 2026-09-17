import type { ClauseWidgetType } from '../contract/model.ts';

export type ReviewHintType = 'comment' | 'proposal';

export type OnboardingHintKey =
	| `clause:${ClauseWidgetType}`
	| `review:${ReviewHintType}`;

export const REVIEW_HINT_OWNER_ID = 'review:draft';

export const ONBOARDING_HINT_COPY: Readonly<Record<OnboardingHintKey, string>> = {
	'clause:faq':
		'Open a question to see a plain-language explanation of this clause and links to related terms.',
	'clause:changes': 'Choose an option to update this clause. The contract updates automatically.',
	'review:comment': 'Write your comment and submit it to attach it to the selected text.',
	'review:proposal':
		'Write the proposal text and submit it to update the selected wording.'
};

export function clauseHintKey(widgetType: ClauseWidgetType): OnboardingHintKey {
	return `clause:${widgetType}`;
}

export function clauseHintOwnerId(clauseId: string): string {
	return `clause:${clauseId}`;
}

export function reviewHintKey(action: ReviewHintType): OnboardingHintKey {
	return `review:${action}`;
}
