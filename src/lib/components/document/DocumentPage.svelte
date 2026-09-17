<script lang="ts">
	import BlockFragment from './BlockFragment.svelte';
	import type { ClauseRegistry } from '$lib/contract/model';
	import type { PageLayout } from '$lib/document/pagination/types';

	let {
		page,
		totalPages,
		clauses,
		selectedClauseId,
		selectedProposalId,
		referencedClauseId,
		onClauseSelect,
		onProposalSelect
	}: {
		page: PageLayout;
		totalPages: number;
		clauses: ClauseRegistry;
		selectedClauseId: string | null;
		selectedProposalId: string | null;
		referencedClauseId: string | null;
		onClauseSelect: (clauseId: string, clauseFragmentKey: string) => void;
		onProposalSelect: (proposalId: string, proposalFragmentKey: string) => void;
	} = $props();
</script>

<article
	class="document-page"
	class:first-page={page.number === 1}
	data-print-page
	aria-label={`Page ${page.number} of ${totalPages}`}
>
	<div class="document-page__content contract-document contract-flow">
		{#each page.fragments as fragment}
			<BlockFragment
				{fragment}
				pageNumber={page.number}
				{clauses}
				{selectedClauseId}
				{selectedProposalId}
				{referencedClauseId}
				{onClauseSelect}
				{onProposalSelect}
			/>
		{/each}
	</div>
	<div class="document-page__number" data-print-exclude aria-hidden="true">
		{page.number}
	</div>
</article>
