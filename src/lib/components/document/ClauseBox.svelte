<script lang="ts">
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import SquareIconButton from '$lib/components/ui/SquareIconButton.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import RichText from './RichText.svelte';
	import { toParagraphs, type ClauseBoxDefinition, type ConcessionRegistry } from '$lib/document/contract-model';

	let { clauseId, definition, concessions, activeConcessions, onToggleConcession, onDismiss, element = $bindable() }: {
		clauseId: string;
		definition: ClauseBoxDefinition;
		concessions: ConcessionRegistry;
		activeConcessions: Readonly<Record<string, string>>;
		onToggleConcession: (concessionId: string) => void;
		onDismiss: () => void;
		element?: HTMLElement;
	} = $props();

	type Section = 'negotiation' | 'preferredConcessions';
	let openSection = $state<Section | null>(null);
	const hasContent = $derived(Boolean(definition.negotiation || definition.preferredConcessions || definition.footerNote));

	function toggleSection(section: Section) {
		openSection = openSection === section ? null : section;
	}

	function handleConcessionKeydown(event: KeyboardEvent, concessionId: string) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		if (event.repeat) return;
		onToggleConcession(concessionId);
	}
</script>

<aside class="clause-box w-full rounded-box border border-line bg-surface p-3.5 text-ink shadow-none"
	class:has-content={hasContent}
	bind:this={element} data-clause-box>
	<header class="clause-box-header">
		<div class="clause-box-intro min-w-0 text-[15px] leading-[1.45] text-ink-muted">
			{#each toParagraphs(definition.intro) as paragraph}
				<p class="m-0">{paragraph}</p>
			{/each}
		</div>
		<div class="clause-box-close">
			<SquareIconButton type="button" aria-label="Close clause box" onclick={onDismiss}>
				<XIcon aria-hidden="true" size={22} weight="regular" />
			</SquareIconButton>
		</div>
	</header>

	{#if hasContent}
		<div class="clause-box-body flex flex-col gap-2">
			{#if definition.negotiation}
				{@const answerId = `clause-box-${clauseId}-negotiation`}
				<div>
					<div class="flex w-full items-center gap-2 rounded-panel bg-canvas px-3.5 py-3 text-[15px] leading-[1.3] text-ink hover:bg-hover-subtle">
						<button
							class="min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-left text-inherit focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
							type="button"
							aria-expanded={openSection === 'negotiation'}
							aria-controls={answerId}
							onclick={() => toggleSection('negotiation')}
						>How to negotiate</button>
					</div>
					<div id={answerId} class="mt-2 mb-1 flex flex-col gap-3 px-1 text-[15px] leading-[1.45] text-ink-subtle"
						hidden={openSection !== 'negotiation'}>
						{#each toParagraphs(definition.negotiation.body) as paragraph}
							<p class="m-0">{paragraph}</p>
						{/each}
					</div>
				</div>
			{/if}

			{#if definition.preferredConcessions}
				{@const preferred = definition.preferredConcessions}
				{@const answerId = `clause-box-${clauseId}-preferred-concessions`}
				<div>
					<div class="flex w-full items-center gap-2 rounded-panel bg-canvas px-3.5 py-3 text-[15px] leading-[1.3] text-ink hover:bg-hover-subtle">
						<button
							class="min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-left text-inherit focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
							type="button"
							aria-expanded={openSection === 'preferredConcessions'}
							aria-controls={answerId}
							onclick={() => toggleSection('preferredConcessions')}
						>Preferred {preferred.concessionIds.length === 1 ? 'concession' : 'concessions'}</button>
						{#if preferred.showInfoTooltip}
							<Tooltip text="It’s important to negotiate this clause">
								<InfoIcon aria-hidden="true" size={18} weight="regular" />
							</Tooltip>
						{/if}
					</div>
					<div id={answerId} class="mt-2 mb-1 flex flex-col gap-3 px-1 text-[15px] leading-[1.45] text-ink-subtle"
						hidden={openSection !== 'preferredConcessions'}>
						{#each preferred.concessionIds as concessionId, index (concessionId)}
							{@const concession = concessions[concessionId]}
							{@const applied = activeConcessions[concession.targetProvisionId] === concessionId}
							{@const actionText = applied ? 'Remove concession' : 'Apply concession'}
							{@const textId = `${answerId}-text-${concessionId}`}
							<p class="m-0"><span id={textId}><RichText nodes={concession.paragraph} /></span>{' '}<span
								role="button"
								tabindex="0"
								aria-label={preferred.concessionIds.length > 1 ? `${actionText} ${index + 1} of ${preferred.concessionIds.length}` : undefined}
								aria-describedby={preferred.concessionIds.length > 1 ? textId : undefined}
								class="cursor-pointer whitespace-normal hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
								class:text-danger={applied}
								class:text-accent={!applied}
								onclick={() => onToggleConcession(concessionId)}
								onkeydown={(event) => handleConcessionKeydown(event, concessionId)}
							>{actionText}</span></p>
						{/each}
					</div>
				</div>
			{/if}

			{#if definition.footerNote}
				<p class="m-0 px-1 text-[13px] leading-[1.4] text-ink-subtle/75">{definition.footerNote}</p>
			{/if}
		</div>
	{/if}
</aside>

<style>
	.has-content .clause-box-header { margin-bottom: 12px; }
	.clause-box-intro { display: flex; flex-direction: column; gap: 12px; }
	.clause-box-close { display: none; }
	@container (width < 1312px) {
		.clause-box {
			display: grid;
			max-height: min(65dvh, 560px);
			grid-template-rows: auto minmax(0, 1fr);
			padding: 0;
			overflow: hidden;
			border-width: 1px 0 0;
			border-radius: var(--radius-box) var(--radius-box) 0 0;
		}
		.clause-box:not(.has-content) { grid-template-rows: auto; }
		.clause-box-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 24px;
			margin-bottom: 0;
			padding: 12px 14px;
		}
		.clause-box-intro { flex: 1; }
		.clause-box-close { display: block; flex: none; }
		.clause-box-body {
			overflow-y: auto;
			overscroll-behavior: contain;
			padding: 0 14px calc(14px + env(safe-area-inset-bottom));
		}
	}
</style>
