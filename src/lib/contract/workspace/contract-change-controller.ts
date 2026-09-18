import type {
	ContractSession,
	PreparedContractChange
} from '$lib/contract/session.svelte';
import type { CompiledContract } from '$lib/contract/model';
import type { ResolvedContractDocument } from '$lib/contract/resolve';
import {
	changeFailed,
	changeSucceeded,
	type ContractChangeResult
} from '$lib/contract/change-result';

export class ContractChangeController {
	constructor(
		private readonly contract: CompiledContract,
		private readonly session: ContractSession,
		private readonly layout: (document: ResolvedContractDocument) => Promise<boolean>
	) {}

	async updateControl(
		clauseId: string,
		controlId: string,
		value: string
	): Promise<ContractChangeResult> {
		const preparation = this.session.prepareControlChange(
			this.contract.document,
			this.contract.clauses,
			clauseId,
			controlId,
			value
		);
		return preparation.ok ? this.commit(preparation.value) : preparation;
	}

	private async commit(change: PreparedContractChange): Promise<ContractChangeResult> {
		if (!(await this.layout(change.document))) return changeFailed('layout');
		this.session.commit(change);
		return changeSucceeded(undefined);
	}
}
