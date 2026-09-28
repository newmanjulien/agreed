<script lang="ts">
	import type { ClauseRegistry } from '$lib/contract/model';
	import type { PageLayout } from '$lib/contract/document/pagination/types';
	import DocumentPage from './DocumentPage.svelte';

	let {
		pages,
		scale,
		width,
		height,
		clauses,
		selectedClauseId,
		referencedClauseId,
		onClauseSelect
	}: {
		pages: PageLayout[];
		scale: number;
		width: number;
		height: number;
		clauses: ClauseRegistry;
		selectedClauseId: string | null;
		referencedClauseId: string | null;
		onClauseSelect: (clauseId: string, fragmentKey: string) => void;
	} = $props();
</script>

<div class="page-viewport relative shrink-0" style:width={`${width}px`} style:height={`${height}px`}>
	<div
		class="page-stack absolute top-0 left-0 flex w-(--contract-page-width) origin-top-left flex-col gap-(--contract-page-gap)"
		style:transform={`scale(${scale})`}
	>
		{#each pages as page}
			<DocumentPage
				{page}
				totalPages={pages.length}
				{clauses}
				{selectedClauseId}
				{referencedClauseId}
				{onClauseSelect}
			/>
		{/each}
	</div>
</div>
