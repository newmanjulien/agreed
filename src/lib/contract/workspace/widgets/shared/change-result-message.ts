import type { ContractChangeFailureReason } from '$lib/contract/change-result';

type ChangeAction = 'control';

const messages: Record<ChangeAction, Record<ContractChangeFailureReason, string>> = {
	control: {
		invalid: 'That option is no longer available.',
		unchanged: '',
		conflict: 'That change could not be applied.',
		layout: 'That change could not be laid out. The previous value was kept.'
	}
};

export function changeFailureMessage(
	action: ChangeAction,
	reason: ContractChangeFailureReason
): string {
	return messages[action][reason];
}
