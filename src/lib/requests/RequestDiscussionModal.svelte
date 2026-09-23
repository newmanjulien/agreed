<script lang="ts">
	import FullHeightModalShell from '$lib/ui/modal/FullHeightModalShell.svelte';
	import type { DiscussionGuide, DiscussionItem } from './types';

	type Section = 'questions' | 'context';

	let { guide, onClose }: { guide: DiscussionGuide; onClose: () => void } = $props();
	let openItemBySection = $state<Record<Section, string | null>>({
		questions: null,
		context: null
	});
	const panelIdPrefix = $props.id();

	function toggleItem(section: Section, itemId: string) {
		openItemBySection[section] = openItemBySection[section] === itemId ? null : itemId;
	}
</script>

{#snippet guideSection(section: Section, title: string, items: ReadonlyArray<DiscussionItem>)}
	{@const titleId = `${panelIdPrefix}-${section}-title`}
	<section aria-labelledby={titleId}>
		<h3 id={titleId} class="mb-3 text-[14.5px] font-medium text-ink">{title}</h3>
		<div class="flex flex-col gap-2">
			{#each items as item (item.id)}
				{@const answerId = `${panelIdPrefix}-${section}-${item.id}`}
				<div>
					<button
						class="w-full cursor-pointer rounded-xl border-0 bg-canvas px-3.5 py-3 text-left text-[14.5px] leading-[1.3] text-ink hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
						type="button"
						aria-expanded={openItemBySection[section] === item.id}
						aria-controls={answerId}
						onclick={() => toggleItem(section, item.id)}
					>
						{item.prompt}
					</button>
					<div
						id={answerId}
						class="mt-2 mb-1 px-1 text-[14.5px] leading-[1.45] text-muted"
						hidden={openItemBySection[section] !== item.id}
					>
						<p class="m-0">{item.answer}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/snippet}

<FullHeightModalShell title="How to discuss with buyers" placement="right" {onClose}>
	<div class="flex flex-col gap-6 pt-1">
		<p class="m-0 text-[14.5px] leading-[1.45] text-muted">
			{guide.explanation}
		</p>

		{@render guideSection('questions', 'Questions to ask buyers', guide.questions)}
		{@render guideSection('context', 'Context', guide.context)}
	</div>
</FullHeightModalShell>
