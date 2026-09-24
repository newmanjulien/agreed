<script lang="ts">
	import BlockFragment from './BlockFragment.svelte';
	import type { PageLayout } from '$lib/document/pagination/types';

	let {
		page,
		totalPages,
		selectedClauseId,
		onClauseSelect
	}: {
		page: PageLayout;
		totalPages: number;
		selectedClauseId: string | null;
		onClauseSelect: (clauseId: string, clauseFragmentKey: string) => void;
	} = $props();
</script>

<article
	class="document-page"
	class:first-page={page.number === 1}
	aria-label={`Page ${page.number} of ${totalPages}`}
>
	<div class="document-page__content contract-document contract-flow">
		{#each page.fragments as fragment}
			<BlockFragment
				{fragment}
				pageNumber={page.number}
				{selectedClauseId}
				{onClauseSelect}
			/>
		{/each}
	</div>
	<div class="document-page__number" aria-hidden="true">
		{page.number}
	</div>
</article>
