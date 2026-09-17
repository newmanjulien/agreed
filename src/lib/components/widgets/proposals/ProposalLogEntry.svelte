<script lang="ts">
	import type { ContractChangeResult } from '$lib/contract/change-result';
	import {
		normalizeProposalText,
		type ContractProposal
	} from '$lib/contract/proposals';
	import MessageComposer from '../shared/MessageComposer.svelte';
	import ParticipantAvatar from '../shared/ParticipantAvatar.svelte';
	import WidgetActionsMenu from '../shared/WidgetActionsMenu.svelte';
	import { changeFailureMessage } from '../shared/change-result-message';

	let {
		proposal,
		onEdit,
		onDelete
	}: {
		proposal: ContractProposal;
		onEdit: (proposalId: string, text: string) => Promise<ContractChangeResult>;
		onDelete: (proposalId: string) => Promise<ContractChangeResult>;
	} = $props();

	let editing = $state(false);
	let editText = $state('');
	let pending = $state(false);
	let errorMessage = $state('');

	function startEditing() {
		editText = proposal.text;
		errorMessage = '';
		editing = true;
	}

	function cancelEditing() {
		editing = false;
		editText = '';
		errorMessage = '';
	}

	async function applyEdit() {
		if (pending || !editText.trim()) return;
		if (normalizeProposalText(editText) === proposal.text) {
			cancelEditing();
			return;
		}
		pending = true;
		errorMessage = '';
		try {
			const result = await onEdit(proposal.id, editText);
			if (result.ok) cancelEditing();
			else errorMessage = changeFailureMessage('proposal-edit', result.reason);
		} catch (error) {
			console.error('Proposed wording edit failed.', error);
			errorMessage = 'That edit could not be applied. The proposed wording was kept.';
		} finally {
			pending = false;
		}
	}

	async function deleteProposal() {
		if (pending) return;
		pending = true;
		errorMessage = '';
		try {
			const result = await onDelete(proposal.id);
			if (!result.ok) errorMessage = changeFailureMessage('proposal-delete', result.reason);
		} catch (error) {
			console.error('Proposed change deletion failed.', error);
			errorMessage = 'That change could not be deleted. Please try again.';
		} finally {
			pending = false;
		}
	}
</script>

<div class="relative mt-4 flex items-start gap-2" aria-busy={pending}>
	<ParticipantAvatar />
	<div class="min-w-0 flex-1">
		{#if editing}
			<MessageComposer
				text={editText}
				title="Edit proposed wording"
				placeholder="Write the proposed wording…"
				submitLabel="Update"
				cancelLabel="Cancel"
				enterBehavior="submit"
				{pending}
				{errorMessage}
				onTextChange={(text) => {
					editText = text;
					errorMessage = '';
				}}
				onCancel={cancelEditing}
				onSubmit={() => void applyEdit()}
			/>
		{:else}
			<div class="flex min-h-8 items-center pr-9">
				<p class="m-0 whitespace-pre-wrap text-[15px] leading-[1.5] text-ink">
					{proposal.text}
				</p>
			</div>
			{#if errorMessage}
				<p class="mt-2 mb-0 text-xs leading-[1.35] text-danger" role="alert">{errorMessage}</p>
			{/if}
		{/if}
	</div>

	{#if !editing}
		<WidgetActionsMenu
			label="Proposed change"
			rootClass="absolute -top-1 right-0 z-10"
			editDisabled={pending}
			deleteDisabled={pending}
			onEdit={startEditing}
			onDelete={() => void deleteProposal()}
		/>
	{/if}
</div>
