<script lang="ts">
	import FullHeightModalShell from '$lib/components/ui/modal/FullHeightModalShell.svelte';

	let { onClose }: { onClose: () => void } = $props();
</script>

<FullHeightModalShell title="How to use Agreed" {onClose}>
	<div class="space-y-6 pt-1">
		<p class="text-[15px] leading-[1.45] text-ink-muted">
			We’ll help you negotiate contract changes and keep the deal moving. Start by uploading what the buyer sent.
		</p>

		<ol class="upload-steps" role="list">
			<li class="upload-step">
				<span class="upload-step-number" aria-hidden="true">1</span>

				<div class="pb-7">
					<h3 class="text-[15px] leading-tight font-medium text-ink">
						Upload the buyer’s changes
					</h3>

					<p class="mt-1.5 text-[15px] leading-[1.45] text-ink-muted">
						Upload a screenshot, recording, or redlined contract showing the changes they requested.
					</p>
				</div>
			</li>

			<li class="upload-step">
				<span class="upload-step-number" aria-hidden="true">2</span>

				<div class="pb-7">
					<h3 class="text-[15px] leading-tight font-medium text-ink">
						Get a recommended response
					</h3>

					<p class="mt-1.5 text-[15px] leading-[1.45] text-ink-muted">
						See what you can accept, what needs approval, and how to respond to changes we can’t accept.
					</p>
				</div>
			</li>

			<li class="upload-step">
				<span class="upload-step-number" aria-hidden="true">3</span>

				<div>
					<h3 class="text-[15px] leading-tight font-medium text-ink">
						Escalate with one click
					</h3>

					<p class="mt-1.5 text-[15px] leading-[1.45] text-ink-muted">
						Get the right people involved, keep things moving, and close the deal faster.
					</p>
				</div>
			</li>
		</ol>
	</div>
</FullHeightModalShell>

<style>
	.upload-steps {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.upload-step {
		position: relative;
		display: grid;
		grid-template-columns: 2rem 1fr;
		column-gap: 0.75rem;
	}

	.upload-step-number {
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

	.upload-step:not(:last-child)::after {
		position: absolute;
		top: 2rem;
		bottom: 0;
		left: calc(1rem - 0.5px);
		width: 1px;
		background: var(--color-line);
		content: '';
	}
</style>