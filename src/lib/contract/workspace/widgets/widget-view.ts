import type {
	ClauseRegistry,
	ChangesWidgetDefinition,
	FaqWidgetDefinition
} from '$lib/contract/model';
import type { ContractControlValues } from '$lib/contract/control-values';

interface ClauseWidgetViewBase {
	clauseId: string;
	title: string;
}

export type WidgetView =
	| (ClauseWidgetViewBase & {
			kind: 'changes';
			definition: ChangesWidgetDefinition;
			value: string;
		})
	| (ClauseWidgetViewBase & {
			kind: 'faq';
			definition: FaqWidgetDefinition;
		});

interface WidgetViewState {
	clauses: ClauseRegistry;
	controlValues: Readonly<ContractControlValues>;
	selectedClauseId: string | null;
}

export function buildWidgetView({
	clauses,
	controlValues,
	selectedClauseId
}: WidgetViewState): WidgetView | null {
	if (!selectedClauseId) return null;

	const clause = clauses[selectedClauseId];
	if (clause.widget.type === 'changes') {
		const control = clause.widget.control;
		return {
			kind: 'changes',
			clauseId: selectedClauseId,
			title: clause.title,
			definition: clause.widget,
			value: controlValues[selectedClauseId]?.[control.id] ?? control.defaultValue
		};
	}

	return {
		kind: 'faq',
		clauseId: selectedClauseId,
		title: clause.title,
		definition: clause.widget
	};
}
