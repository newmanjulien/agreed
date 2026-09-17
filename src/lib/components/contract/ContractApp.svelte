<script lang="ts">
	import UtilityDock from '$lib/components/utility/UtilityDock.svelte';
	import { ContractSession } from '$lib/contract/session.svelte';
	import { CommentSession } from '$lib/review/comment-session.svelte';
	import { ProposalDraftSession } from '$lib/review/proposal-draft-session.svelte';
	import { DiscussionSession } from '$lib/review/discussion-session.svelte';
	import type { CompiledContract } from '$lib/contract/model';
	import { WidgetHintSession } from '$lib/onboarding/widget-hint-session.svelte';
	import OnboardingGuide from '$lib/components/onboarding/OnboardingGuide.svelte';
	import ContractWorkspace from './ContractWorkspace.svelte';

	let { contract }: {
		contract: CompiledContract;
	} = $props();
	let documentStageElement = $state<HTMLDivElement>();
	let isPaginationReady = $state(false);
	let guideVisible = $state(false);
	const contractSession = new ContractSession();
	const commentSession = new CommentSession();
	const proposalDraftSession = new ProposalDraftSession();
	const discussionSession = new DiscussionSession();
	const widgetHints = new WidgetHintSession();

	async function downloadWord() {
		const snapshot = contractSession.snapshot(contract.document, contract.clauses);
		const { downloadContractDocx } = await import(
			'$lib/document/export/docx/download-contract-docx'
		);
		await downloadContractDocx(snapshot);
	}

	async function openPrintDialog() {
		const { printContract } = await import('$lib/document/export/print/print-contract');
		await printContract(documentStageElement, contract.document.id);
	}
</script>

<UtilityDock
	searchTarget={documentStageElement}
	canPrint={isPaginationReady}
	onDownloadWord={downloadWord}
	onPrintContract={openPrintDialog}
	onOpenOnboarding={() => (guideVisible = true)}
/>

{#if guideVisible}
	<OnboardingGuide onClose={() => (guideVisible = false)} />
{/if}

<main
	class="workspace block min-w-full pt-6 pb-12 max-[650px]:pt-3.5 max-[650px]:pb-8"
	aria-label="Contract document"
>
	<ContractWorkspace
		{contract}
		session={contractSession}
		comments={commentSession}
		proposals={proposalDraftSession}
		discussion={discussionSession}
		{widgetHints}
		bind:documentStageElement
		onPaginationReadyChange={(isReady) => (isPaginationReady = isReady)}
	/>
</main>
