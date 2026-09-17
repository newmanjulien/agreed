<script lang="ts">
	import FullHeightModalShell from '$lib/components/ui/modal/FullHeightModalShell.svelte';

	let { onClose }: { onClose: () => void } = $props();
</script>

<FullHeightModalShell title="How Agreed works" {onClose}>
	<div class="space-y-6 pt-1">
		<p class="text-[15px] leading-[1.45] text-ink-muted">
			Agreed helps you partner more easily. It's a contract that explains itself and lets you make safe edits.
		</p>

		<ol class="startup-steps" role="list">
			<li class="startup-step">
				<span class="startup-step-number" aria-hidden="true">1</span>

				<div class="pb-7">
					<h3 class="text-[15px] leading-tight font-medium text-ink">
						Choose what works for you
					</h3>

					<p class="mt-1.5 text-[15px] leading-[1.45] text-ink-muted">
						<span class="clause-highlight bg-clause-editable-highlight">
							Green clauses have options.
						</span>
						Click to select from one of the alternatives.
					</p>
				</div>
			</li>

			<li class="startup-step">
				<span class="startup-step-number" aria-hidden="true">2</span>

				<div class="pb-7">
					<h3 class="text-[15px] leading-tight font-medium text-ink">
						Understand what is already settled
					</h3>

					<p class="mt-1.5 text-[15px] leading-[1.45] text-ink-muted">
						<span class="clause-highlight bg-clause-informational-highlight">
							Grey clauses are not flexible.
						</span>
						Click to see a plain-language explanation of why the clauses are important.
					</p>
				</div>
			</li>

			<li class="startup-step">
				<span class="startup-step-number" aria-hidden="true">3</span>

				<div>
					<h3 class="text-[15px] leading-tight font-medium text-ink">
						Suggest a different approach
					</h3>

					<p class="mt-1.5 text-[15px] leading-[1.45] text-ink-muted">
						For any other wording, propose an alternative by
						<span class="selection-highlight">selecting the text.</span>
					</p>
				</div>
			</li>
		</ol>
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
