<script lang="ts">
	import type { ProposalTarget } from '$lib/review/proposal-target';
	import type { ContractChangeResult } from '$lib/contract/change-result';
	import WidgetFrame from '../WidgetFrame.svelte';
	import MessageByline from '../shared/MessageByline.svelte';
	import MessageComposer from '../shared/MessageComposer.svelte';
	import { changeFailureMessage } from '../shared/change-result-message';

	let {
		target,
		onDismiss,
		onSubmit
	}: {
		target: ProposalTarget;
		onDismiss: () => void;
		onSubmit: (target: ProposalTarget, text: string) => Promise<ContractChangeResult>;
	} = $props();

	let text = $state('');
	let pending = $state(false);
	let errorMessage = $state('');

	async function submit(): Promise<void> {
		if (pending || !text.trim()) return;
		pending = true;
		errorMessage = '';
		try {
			const result = await onSubmit(target, text);
			if (!result.ok) {
				errorMessage = changeFailureMessage('proposal', result.reason);
			}
		} catch (error) {
			console.error('Proposal submission failed.', error);
			errorMessage = 'That change could not be applied. The previous wording was kept.';
		} finally {
			pending = false;
		}
	}
</script>

<WidgetFrame label="Propose change" {onDismiss} closeLabel="Cancel proposed change">
	<div class="mb-2.5">
		<MessageByline />
	</div>
	<MessageComposer
		{text}
		title="Propose change"
		placeholder="Write the proposed wording or change…"
		submitLabel="Propose change"
		enterBehavior="submit"
		{pending}
		{errorMessage}
		onTextChange={(nextText) => {
			text = nextText;
			errorMessage = '';
		}}
		onSubmit={() => void submit()}
	/>
</WidgetFrame>
