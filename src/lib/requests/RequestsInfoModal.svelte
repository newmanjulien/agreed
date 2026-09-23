<script lang="ts">
	import FullHeightModalShell from '$lib/ui/modal/FullHeightModalShell.svelte';

	let { onClose }: { onClose: () => void } = $props();

	const stepClass =
		"relative grid grid-cols-[2rem_1fr] gap-x-3 not-last:after:absolute not-last:after:top-8 not-last:after:bottom-0 not-last:after:left-[calc(1rem-0.5px)] not-last:after:w-px not-last:after:bg-line not-last:after:content-['']";
	const stepNumberClass =
		'z-1 flex size-8 items-center justify-center rounded-full border border-line bg-canvas text-[13.5px] leading-none text-muted';
</script>

<FullHeightModalShell title="How reviewing works" {onClose}>
	<div class="space-y-6 pt-1">
		<p class="text-[14.5px] leading-[1.45] text-muted">
			Each change is grouped by what you can do with it. You have 10 points
			to accept changes.
		</p>

		<ol class="m-0 list-none p-0" role="list">
			<li class={stepClass}>
				<span class={stepNumberClass} aria-hidden="true">1</span>

				<div class="pb-7">
					<h3 class="text-[14.5px] leading-tight font-medium text-ink">
						You have 10 points
					</h3>

					<p class="mt-1.5 text-[14.5px] leading-[1.45] text-muted">
						This is your budget. Each accepted change spends some of it.
					</p>
				</div>
			</li>

			<li class={stepClass}>
				<span class={stepNumberClass} aria-hidden="true">2</span>

				<div class="pb-7">
					<h3 class="text-[14.5px] leading-tight font-medium text-ink">
						Spend points to accept changes
					</h3>

					<p class="mt-1.5 text-[14.5px] leading-[1.45] text-muted">
						Spend them on requests that fit the contract rules. Accept buttons
						show how many it costs.
					</p>
				</div>
			</li>

			<li class={stepClass}>
				<span class={stepNumberClass} aria-hidden="true">3</span>

				<div>
					<h3 class="text-[14.5px] leading-tight font-medium text-ink">
						Some changes you can’t accept
					</h3>

					<p class="mt-1.5 text-[14.5px] leading-[1.45] text-muted">
						You need approval for some changes, and
						<span class="text-danger">some can’t be accepted at all.</span>
					</p>
				</div>
			</li>
		</ol>

		<label class="mt-6 flex items-center gap-2 text-[14px] text-ink">
		<span class="relative flex size-4 items-center justify-center">
			<input
				type="checkbox"
				class="peer size-4 appearance-none rounded-sm border border-line checked:bg-muted"
			/>

			<span
				class="pointer-events-none absolute hidden text-[11px] leading-none text-white peer-checked:block"
			>
				✓
			</span>
		</span>

		<span>Don't show guide</span>
	</label>
	</div>
</FullHeightModalShell>
