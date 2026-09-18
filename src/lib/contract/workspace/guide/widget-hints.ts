import type { ClauseWidgetType } from '../../model.ts';

export type HintKey = `clause:${ClauseWidgetType}`;

export const HINT_COPY: Readonly<Record<HintKey, string>> = {
	'clause:faq':
		'Open a question to see a plain-language explanation of this clause and links to related terms.',
	'clause:changes': 'Choose an option to update this clause. The contract updates automatically.'
};

export function clauseHintKey(widgetType: ClauseWidgetType): HintKey {
	return `clause:${widgetType}`;
}

export function clauseHintOwnerId(clauseId: string): string {
	return `clause:${clauseId}`;
}
