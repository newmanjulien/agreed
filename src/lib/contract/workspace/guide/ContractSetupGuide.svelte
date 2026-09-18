<script lang="ts">
	import FullHeightModalShell from '$lib/ui/modal/FullHeightModalShell.svelte';
	import InfoBar from '$lib/ui/InfoBar.svelte';

	let { onClose }: { onClose: () => void } = $props();

	const stepClass =
		"relative grid grid-cols-[2rem_1fr] gap-x-3 not-last:after:absolute not-last:after:top-8 not-last:after:bottom-0 not-last:after:left-[calc(1rem-0.5px)] not-last:after:w-px not-last:after:bg-line not-last:after:content-['']";
	const stepNumberClass =
		'z-1 flex size-8 items-center justify-center rounded-full border border-line bg-canvas text-[13.5px] leading-none text-muted';
	const clauseHighlightClass = 'rounded-[3px] box-decoration-clone';
</script>

<FullHeightModalShell title="How to set up your contract" {onClose}>
	<div class="space-y-6 pt-1">
		<p class="text-[14.5px] leading-[1.45] text-muted">
			Define the rules and guidance reps should follow when handling buyer-requested changes.
		</p>

		<ol class="m-0 list-none p-0" role="list">
			<li class={stepClass}>
				<span class={stepNumberClass} aria-hidden="true">1</span>

				<div class="pb-7">
					<h3 class="text-[14.5px] leading-tight font-medium text-ink">
						Highlight clauses
					</h3>

					<p class="mt-1.5 text-[14.5px] leading-[1.45] text-muted">
						Set detailed rules and instructions for each clause by
						<span class="bg-selection">selecting the text.</span>
					</p>
				</div>
			</li>

			<li class={stepClass}>
				<span class={stepNumberClass} aria-hidden="true">2</span>

				<div class="pb-7">
					<h3 class="text-[14.5px] leading-tight font-medium text-ink">
						Mark what’s flexible
					</h3>

					<p class="mt-1.5 text-[14.5px] leading-[1.45] text-muted">
						<span class={[clauseHighlightClass, 'bg-clause-editable']}>
							Green clauses are flexible.
						</span>
						Define which alternatives reps can offer or accept.
					</p>
				</div>
			</li>

			<li class={stepClass}>
				<span class={stepNumberClass} aria-hidden="true">3</span>

				<div>
					<h3 class="text-[14.5px] leading-tight font-medium text-ink">
						Mark what’s fixed
					</h3>

					<p class="mt-1.5 text-[14.5px] leading-[1.45] text-muted">
						<span class={[clauseHighlightClass, 'bg-clause']}>
							Grey clauses are not flexible.
						</span>
						Give reps practical guidance for handling buyer objections.
					</p>
				</div>
			</li>
		</ol>
	</div>

	{#snippet footer()}
		<InfoBar>Contract editing disabled while the guide is open.</InfoBar>
	{/snippet}
</FullHeightModalShell>
