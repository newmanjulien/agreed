<script lang="ts">
	import ContractApp from '$lib/components/document/ContractApp.svelte';
	import { contract } from '$lib/content/contract/contract';
</script>

<svelte:head>
	<title>Agreed</title>
	<meta
		name="description"
		content="Let sales reps understand, negotiate and close contracts on their own."
	/>
</svelte:head>

<ContractApp {contract} />
