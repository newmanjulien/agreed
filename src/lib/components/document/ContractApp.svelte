<script lang="ts">
	import { onMount } from 'svelte';
	import AppChrome from '$lib/components/chrome/AppChrome.svelte';
	import type { CompiledContract } from '$lib/document/contract-model';
	import StartupModal from '$lib/components/ui/modal/StartupModal.svelte';
	import ContractViewer from './ContractViewer.svelte';

	let { contract }: { contract: CompiledContract } = $props();
	let documentStageElement = $state<HTMLDivElement>();
	let startupModalVisible = $state(false);
	onMount(() => {
		startupModalVisible = localStorage.getItem('hide-agreed-guide') !== 'true';
	});
</script>

<AppChrome searchTarget={documentStageElement} onOpenOnboarding={() => startupModalVisible = true} />
{#if startupModalVisible}
	<StartupModal onClose={() => startupModalVisible = false} />
{/if}
<main class="workspace block min-w-full pt-6 pb-12 max-[650px]:pt-3.5 max-[650px]:pb-8" aria-label="Contract document">
	<ContractViewer {contract} bind:documentStageElement />
</main>
