import type { ContractChangeFailureReason } from '$lib/contract/change-result';

type ChangeAction = 'control' | 'proposal' | 'proposal-edit' | 'proposal-delete';

const messages: Record<ChangeAction, Record<ContractChangeFailureReason, string>> = {
	control: {
		invalid: 'That option is no longer available.',
		unchanged: '',
		conflict: 'That change conflicts with another proposed change.',
		layout: 'That change could not be laid out. The previous value was kept.'
	},
	proposal: {
		invalid: 'The selected wording is no longer available.',
		unchanged: 'The proposed wording must differ from the current wording.',
		conflict: 'That wording overlaps another proposed change.',
		layout: 'That change could not be laid out. The previous wording was kept.'
	},
	'proposal-edit': {
		invalid: 'That proposed change is no longer available.',
		unchanged: 'The proposed wording must differ from the previous wording.',
		conflict: 'That edit conflicts with another proposed change.',
		layout: 'That edit could not be laid out. The proposed wording was kept.'
	},
	'proposal-delete': {
		invalid: 'That proposed change is no longer available.',
		unchanged: '',
		conflict: 'That change could not be removed because the contract changed.',
		layout: 'That change could not be removed from the current layout.'
	}
};

export function changeFailureMessage(
	action: ChangeAction,
	reason: ContractChangeFailureReason
): string {
	return messages[action][reason];
}
