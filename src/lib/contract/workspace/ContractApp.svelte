<script lang="ts">
	import { ContractSession } from '$lib/contract/session.svelte';
	import type { CompiledContract } from '$lib/contract/model';
	import { HintSession } from './guide/widget-hint-session.svelte';
	import type { TextAnchor } from '$lib/contract/document/anchors/types';
	import ContractSetupGuide from './guide/ContractSetupGuide.svelte';
	import ContractWorkspace from './ContractWorkspace.svelte';
	import MarkPage from './MarkPage.svelte';

	let { contract }: {
		contract: CompiledContract;
	} = $props();
	let guideVisible = $state(false);
	let mark = $state<{ kind: 'flexible' | 'fixed'; anchor: TextAnchor } | null>(null);
	const contractSession = new ContractSession();
	const widgetHints = new HintSession();
</script>

<div inert={mark !== null}>
	{#if guideVisible}
		<ContractSetupGuide onClose={() => (guideVisible = false)} />
	{/if}

	<main
		class="workspace block min-w-full pt-6 pb-12 max-[650px]:pt-3.5 max-[650px]:pb-8"
		aria-label="Contract document"
	>
		<ContractWorkspace
			{contract}
			session={contractSession}
			{widgetHints}
			onOpenGuide={() => (guideVisible = true)}
			onMark={(kind, anchor) => (mark = { kind, anchor })}
		/>
	</main>
</div>

{#if mark}
	<div
		class="fixed inset-x-0 top-[var(--app-header-height)] bottom-0 z-30 overflow-y-auto bg-canvas"
	>
		<MarkPage kind={mark.kind} onBack={() => (mark = null)} />
	</div>
{/if}
