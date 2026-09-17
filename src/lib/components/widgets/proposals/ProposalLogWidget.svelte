<script lang="ts">
	import type { ContractChangeResult } from '$lib/contract/change-result';
	import type { ContractProposal } from '$lib/contract/proposals';
	import WidgetFrame from '../WidgetFrame.svelte';
	import ProposalLogEntry from './ProposalLogEntry.svelte';

	let {
		proposal,
		onDismiss,
		onEdit,
		onDelete
	}: {
		proposal: ContractProposal;
		onDismiss: () => void;
		onEdit: (proposalId: string, text: string) => Promise<ContractChangeResult>;
		onDelete: (proposalId: string) => Promise<ContractChangeResult>;
	} = $props();
</script>

<WidgetFrame
	label="Proposed change log"
	{onDismiss}
	closeLabel="Close proposed change log"
>
	<p class="m-0 whitespace-pre-wrap text-[15px] leading-[1.5] text-ink-muted">
		{proposal.originalText}
	</p>
	<ProposalLogEntry {proposal} {onEdit} {onDelete} />
</WidgetFrame>
