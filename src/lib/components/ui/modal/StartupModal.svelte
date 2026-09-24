<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowSquareOutIcon from 'phosphor-svelte/lib/ArrowSquareOutIcon';
	import FullHeightModalShell from './FullHeightModalShell.svelte';

	let { onClose }: { onClose: () => void } = $props();

	let hideGuide = $state(false);

	onMount(() => { hideGuide = localStorage.getItem('hide-agreed-guide') === 'true'; });

	function handleHideGuideChange() {
		localStorage.setItem('hide-agreed-guide', hideGuide ? 'true' : 'false');
	}
</script>

<FullHeightModalShell title="How Agreed works" {onClose}>
	<div class="flex min-h-full flex-col justify-between gap-6 pt-1">
		<div class="space-y-6">
			<p class="text-[15px] leading-[1.45] text-ink-muted">
				Agreed helps sales reps understand, negotiate and close sales contracts on your own.
			</p>

			<div>
				<ol class="startup-steps" role="list">
					<li class="startup-step">
						<span class="startup-step-number" aria-hidden="true">1</span>

						<div class="pb-7">
							<h3 class="text-[15px] leading-tight font-medium text-ink">
								Open a clause
							</h3>

							<p class="mt-1.5 text-[15px] leading-[1.45] text-ink-muted">
								<span class="clause-highlight bg-clause-editable-highlight">
									Green clauses have details.
								</span>
								Click to open up an explanation of the clause.
							</p>
						</div>
					</li>

					<li class="startup-step">
						<span class="startup-step-number" aria-hidden="true">2</span>

						<div class="pb-7">
							<h3 class="text-[15px] leading-tight font-medium text-ink">
								Understand the clause
							</h3>

							<p class="mt-1.5 text-[15px] leading-[1.45] text-ink-muted">
								All green clauses have a plain English explanation of what the clause means.
							</p>
						</div>
					</li>

					<li class="startup-step">
						<span class="startup-step-number" aria-hidden="true">3</span>

						<div>
							<h3 class="text-[15px] leading-tight font-medium text-ink">
								Negotiate the clause
							</h3>

							<p class="mt-1.5 text-[15px] leading-[1.45] text-ink-muted">
								Some clauses include information on how to negotiate the clause with buyers.
							</p>
						</div>
					</li>
				</ol>

				<label class="mt-6 flex cursor-pointer items-center gap-2.5 text-[15px] text-ink-muted">
					<input
						type="checkbox"
						bind:checked={hideGuide}
						onchange={handleHideGuideChange}
						class="peer sr-only"
					/>

					<span
						class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border border-line bg-surface transition-colors
							peer-checked:border-black peer-checked:bg-black
							peer-checked:[&>svg]:opacity-100"
						aria-hidden="true"
					>
						<svg
							class="h-3 w-3 opacity-0 transition-opacity"
							viewBox="0 0 12 12"
							fill="none"
						>
							<path
								d="M2.5 6.25L4.8 8.4L9.5 3.6"
								stroke="white"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>

					<span>Don't show this guide again</span>
				</label>
			</div>
		</div>
	</div>
</FullHeightModalShell>

<style>
	.startup-steps {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.startup-step {
		position: relative;
		display: grid;
		grid-template-columns: 2rem 1fr;
		column-gap: 0.75rem;
	}

	.startup-step-number {
		z-index: 1;
		display: flex;
		width: 2rem;
		height: 2rem;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--color-line);
		border-radius: 9999px;
		background: var(--color-canvas);
		color: var(--color-ink-muted);
		font-size: 0.875rem;
		line-height: 1;
	}

	.startup-step:not(:last-child)::after {
		position: absolute;
		top: 2rem;
		bottom: 0;
		left: calc(1rem - 0.5px);
		width: 1px;
		background: var(--color-line);
		content: '';
	}

	.clause-highlight {
		border-radius: 3px;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
	}

	.selection-highlight {
		background: var(--color-selection-highlight);
		color: inherit;
	}
</style>