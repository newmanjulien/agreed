<script lang="ts">
	import type { InlineToken } from '$lib/document/pagination/types';
	import { groupRevisionRuns } from '$lib/document/revision-runs';
	import RichText from './RichText.svelte';

	let { tokens }: { tokens: InlineToken[] } = $props();
	let runs = $derived(groupRevisionRuns(tokens));
</script>

{#each runs as run}
	{#if run.removed}
		<span
			class="contract-revision-removed"
			class:revision-bold={run.tokens[0].marks?.bold}
			class:revision-italic={run.tokens[0].marks?.italic}
			data-removed-text={run.tokens.map((token) => token.value).join('')}
		></span>
	{:else}
		<RichText nodes={run.tokens} />
	{/if}
{/each}
