<script lang="ts">
	import InlineContent from './InlineContent.svelte';
	import type { PageFragment } from '$lib/document/pagination/types';

	let {
		fragment,
		pageNumber,
		selectedClauseId,
		onClauseSelect
	}: {
		fragment: PageFragment;
		pageNumber: number;
		selectedClauseId: string | null;
		onClauseSelect: (clauseId: string, clauseFragmentKey: string) => void;
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
			{selectedClauseId}
			{onClauseSelect}
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
			{selectedClauseId}
			{onClauseSelect}
		/>
	</p>
{:else}
	<table class="contract-block contract-table" class:signature-table={fragment.variant === 'signature'} data-block-id={fragment.blockKey}>
		<thead><tr>{#each fragment.rows[0] as cell}<th scope="col">{cell}</th>{/each}</tr></thead>
		<tbody>
			{#each fragment.rows.slice(1) as row}
				<tr>{#each row as cell}<td>{cell}</td>{/each}</tr>
			{/each}
		</tbody>
	</table>
{/if}
