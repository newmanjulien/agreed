import type {
	ClauseRegistry,
	ChangesWidgetDefinition,
	FaqWidgetDefinition
} from '$lib/contract/model';
import type { ContractControlValues } from '$lib/contract/control-values';
import type { ContractProposal } from '$lib/contract/proposals';
import type { ClauseProposalTarget } from '$lib/review/proposal-target';

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
		})
	| {
			kind: 'proposal-composer';
			target: ClauseProposalTarget;
		}
	| {
			kind: 'proposal-log';
			proposal: ContractProposal;
		}
	| {
			kind: 'annotations';
		};

interface WidgetViewState {
	clauses: ClauseRegistry;
	controlValues: Readonly<ContractControlValues>;
	selectedClauseId: string | null;
	selectedProposal?: ContractProposal;
	clauseProposalTarget?: ClauseProposalTarget;
	showAnnotations: boolean;
}

export function buildWidgetView({
	clauses,
	controlValues,
	selectedClauseId,
	selectedProposal,
	clauseProposalTarget,
	showAnnotations
}: WidgetViewState): WidgetView | null {
	if (clauseProposalTarget) {
		return { kind: 'proposal-composer', target: clauseProposalTarget };
	}

	if (selectedClauseId) {
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

	if (selectedProposal) return { kind: 'proposal-log', proposal: selectedProposal };
	return showAnnotations ? { kind: 'annotations' } : null;
}
