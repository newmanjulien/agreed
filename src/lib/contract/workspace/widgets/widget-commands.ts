import type { ContractChangeResult } from '$lib/contract/change-result';

export interface WidgetCommands {
	dismiss: () => void;
	updateControl: (
		clauseId: string,
		controlId: string,
		value: string
	) => Promise<ContractChangeResult>;
	navigateToClause: (clauseId: string) => void;
}
