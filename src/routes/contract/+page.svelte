<script lang="ts">
	import ContractApp from '$lib/components/contract/ContractApp.svelte';
	import ContractSourceError from '$lib/components/contract/ContractSourceError.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Contract | Agreed</title>
	<meta
		name="description"
		content="Review contract clauses, explore contextual guidance, and request changes."
	/>
</svelte:head>

{#if data.contractResult.ok}
	{#key data.contractResult.contract.document.id}
		<ContractApp contract={data.contractResult.contract} />
	{/key}
{:else}
	<ContractSourceError
		kind={data.contractResult.kind}
		issues={data.contractResult.issues}
	/>
{/if}
