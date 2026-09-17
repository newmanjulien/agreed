import type { ProposalTarget } from '$lib/review/proposal-target';
import type { ContractChangeResult } from '$lib/contract/change-result';
import type {
	DiscussionTarget,
	DiscussionThreadAction
} from '$lib/review/discussion-types';

export interface WidgetCommands {
	dismiss: () => void;
	updateControl: (
		clauseId: string,
		controlId: string,
		value: string
	) => Promise<ContractChangeResult>;
	startClauseProposal: (clauseId: string, optionValue: string) => void;
	submitProposal: (target: ProposalTarget, text: string) => Promise<ContractChangeResult>;
	cancelProposal: () => void;
	navigateToClause: (clauseId: string) => void;
	editProposal: (proposalId: string, text: string) => Promise<ContractChangeResult>;
	deleteProposal: (proposalId: string) => Promise<ContractChangeResult>;
	cancelCommentDraft: () => void;
	submitCommentDraft: () => void;
	handleDiscussionAction: (
		target: DiscussionTarget,
		action: DiscussionThreadAction
	) => void;
}
