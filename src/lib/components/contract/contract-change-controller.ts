import type {
	ContractSession,
	PreparedContractChange
} from '$lib/contract/session.svelte';
import type { CompiledContract } from '$lib/contract/model';
import type { ResolvedContractDocument } from '$lib/contract/resolve';
import type { ProposalTarget } from '$lib/review/proposal-target';
import { sourceRangeForAnchor } from '$lib/document/anchors/proposal-source-range';
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
		return preparation.ok
			? this.commit(preparation.value, undefined)
			: preparation;
	}

	async proposeChange(
		target: ProposalTarget,
		text: string
	): Promise<ContractChangeResult<string>> {
		const preparation =
			target.kind === 'clause'
				? this.session.prepareClauseProposal(
						this.contract.document,
						this.contract.clauses,
						target.clauseId,
						target.optionValue,
						text
					)
				: this.prepareTextProposal(target, text);
		return preparation.ok
			? this.commit(preparation.value, preparation.value.proposalId)
			: preparation;
	}

	async editProposal(
		proposalId: string,
		text: string
	): Promise<ContractChangeResult> {
		const preparation = this.session.prepareProposalEdit(
			this.contract.document,
			this.contract.clauses,
			proposalId,
			text
		);
		return preparation.ok
			? this.commit(preparation.value, undefined)
			: preparation;
	}

	async deleteProposal(proposalId: string): Promise<ContractChangeResult> {
		const preparation = this.session.prepareProposalDeletion(
			this.contract.document,
			this.contract.clauses,
			proposalId
		);
		return preparation.ok
			? this.commit(preparation.value, undefined)
			: preparation;
	}

	private prepareTextProposal(
		target: Extract<ProposalTarget, { kind: 'text' }>,
		text: string
	) {
		const document = this.session.snapshot(
			this.contract.document,
			this.contract.clauses
		);
		const range = sourceRangeForAnchor(document, target.anchor);
		return range
			? this.session.prepareTextProposal(
					this.contract.document,
					this.contract.clauses,
					range,
					text
				)
			: changeFailed('invalid');
	}

	private async commit<Value>(
		change: PreparedContractChange,
		value: Value
	): Promise<ContractChangeResult<Value>> {
		if (!(await this.layout(change.document))) return changeFailed('layout');
		this.session.commit(change);
		return changeSucceeded(value);
	}
}
