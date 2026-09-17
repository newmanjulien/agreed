<script lang="ts">
	import InlineContent from './InlineContent.svelte';
	import type { ClauseRegistry } from '$lib/contract/model';
	import type { PageFragment } from '$lib/document/pagination/types';

	let {
		fragment,
		pageNumber,
		clauses,
		selectedClauseId,
		selectedProposalId,
		referencedClauseId,
		onClauseSelect,
		onProposalSelect
	}: {
		fragment: PageFragment;
		pageNumber: number;
		clauses: ClauseRegistry;
		selectedClauseId: string | null;
		selectedProposalId: string | null;
		referencedClauseId: string | null;
		onClauseSelect: (clauseId: string, clauseFragmentKey: string) => void;
		onProposalSelect: (proposalId: string, proposalFragmentKey: string) => void;
	} = $props();

	let blockFragmentKey = $derived(`page-${pageNumber}:${fragment.blockKey}`);
</script>

{#if fragment.type === 'heading'}
	<svelte:element
		this={`h${fragment.level}`}
		id={fragment.anchor}
		class="contract-block contract-heading"
		data-block-id={fragment.blockKey}
		tabindex="-1"
	>
		<InlineContent
			tokens={fragment.tokens}
			{blockFragmentKey}
			{clauses}
			{selectedClauseId}
			{selectedProposalId}
			{referencedClauseId}
			{onClauseSelect}
			{onProposalSelect}
		/>
	</svelte:element>
{:else if fragment.type === 'paragraph'}
	<p
		class="contract-block contract-paragraph"
		class:is-continuation={fragment.isContinuation}
		class:is-final={fragment.isFinal}
		data-block-id={fragment.blockKey}
	>
		<InlineContent
			tokens={fragment.tokens}
			{blockFragmentKey}
			{clauses}
			{selectedClauseId}
			{selectedProposalId}
			{referencedClauseId}
			{onClauseSelect}
			{onProposalSelect}
		/>
	</p>
{:else}
	<section class="contract-block contract-signatures" data-block-id={fragment.blockKey}>
		<h2>{fragment.title}</h2>
		<div class="signature-grid">
			{#each fragment.parties as party}
				<div class="signature-block">
					<h3>{party.name}</h3>
					{#each party.fields as field}
						<p>
							{field.label}:
							{#if field.kind === 'signature-line'}
								<span class="signature-line"></span>
							{:else}
								<span class:field-value={field.marks?.bold}>
									{#if field.marks?.italic}<em>{field.value}</em>{:else}{field.value}{/if}
								</span>
							{/if}
						</p>
					{/each}
				</div>
			{/each}
		</div>
	</section>
{/if}
