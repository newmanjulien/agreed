<script lang="ts">
	import type { FaqWidgetDefinition } from '$lib/contract/model';
	import WidgetFrame from '../WidgetFrame.svelte';

	let {
		clauseId,
		title,
		definition,
		onDismiss,
		onClauseReference
	}: {
		clauseId: string;
		title: string;
		definition: FaqWidgetDefinition;
		onDismiss: () => void;
		onClauseReference: (clauseId: string) => void;
	} = $props();

	let widgetId = $derived(`clause-widget-${clauseId}`);
	let openItemId = $state<string | null>(null);

	function toggleItem(itemId: string) {
		openItemId = openItemId === itemId ? null : itemId;
	}

	function navigateToClause(event: MouseEvent, clauseId: string) {
		event.preventDefault();
		onClauseReference(clauseId);
	}

	function clauseHref(clauseId: string): string {
		return `#clause-${clauseId}`;
	}
</script>

<WidgetFrame label={title} intro={definition.intro} {onDismiss}>
	<div class="flex flex-col gap-2">
		{#each definition.items as item}
			{@const answerId = `${widgetId}-answer-${item.id}`}
			<div>
				<button
					class="w-full cursor-pointer rounded-xl border-0 bg-canvas px-3.5 py-3 text-left text-[14.5px] leading-[1.3] text-ink hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
					type="button"
					aria-expanded={openItemId === item.id}
					aria-controls={answerId}
					onclick={() => toggleItem(item.id)}
				>
					{item.question}
				</button>

				<div
					id={answerId}
					class="mt-2 mb-1 flex flex-col gap-3 px-1 text-[14.5px] leading-[1.45] text-muted"
					hidden={openItemId !== item.id}
				>
					{#each item.answer as paragraph}
						<p class="m-0">
							{#each paragraph.parts as part}
								{#if part.type === 'clause-reference'}
									<a
										href={clauseHref(part.clauseId)}
										class="font-medium text-accent underline-offset-2 hover:underline focus-visible:rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
										onclick={(event) => navigateToClause(event, part.clauseId)}
									>
										{part.text}
									</a>
								{:else}
									{part.text}
								{/if}
							{/each}
						</p>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</WidgetFrame>
