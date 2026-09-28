<script lang="ts">
	import ChangesWidget from './changes/ChangesWidget.svelte';
	import FaqWidget from './faq/FaqWidget.svelte';
	import type { WidgetCommands } from './widget-commands';
	import type { WidgetView } from './widget-view';

	let {
		view,
		hint,
		commands,
		element = $bindable()
	}: {
		view: WidgetView;
		hint?: string;
		commands: WidgetCommands;
		element?: HTMLElement;
	} = $props();

	function assertUnreachable(value: never): null {
		throw new Error(`Unhandled widget view: ${JSON.stringify(value)}`);
	}
</script>

{#snippet helpText()}
	{#if hint}
		<p class="mt-[10px] mb-0 pb-[14px] text-[13.5px] leading-[1.45] text-muted" role="note">
			{hint}
		</p>
	{/if}
{/snippet}

{#if view.kind === 'changes'}
	{#key view.clauseId}
		<div class="widget-region" data-widget bind:this={element}>
			<ChangesWidget
				clauseId={view.clauseId}
				title={view.title}
				definition={view.definition}
				value={view.value}
				onDismiss={commands.dismiss}
				onChange={(value) =>
					commands.updateControl(view.clauseId, view.definition.control.id, value)}
			/>
			{@render helpText()}
		</div>
	{/key}
{:else if view.kind === 'faq'}
	{#key view.clauseId}
		<div class="widget-region" data-widget bind:this={element}>
			<FaqWidget
				clauseId={view.clauseId}
				title={view.title}
				definition={view.definition}
				onDismiss={commands.dismiss}
				onClauseReference={commands.navigateToClause}
			/>
			{@render helpText()}
		</div>
	{/key}
{:else}
	{assertUnreachable(view)}
{/if}
