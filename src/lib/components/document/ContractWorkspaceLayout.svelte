<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		hasClauseBox,
		displayedPageWidth,
		documentHeight,
		boxTop,
		documentStageElement = $bindable(),
		documentContent,
		clauseBoxContent
	}: {
		hasClauseBox: boolean;
		displayedPageWidth: number;
		documentHeight: number;
		boxTop: number;
		documentStageElement?: HTMLDivElement;
		documentContent: Snippet;
		clauseBoxContent: Snippet;
	} = $props();
</script>

<div
	class="contract-workspace-layout"
	class:has-clause-box={hasClauseBox}
	style:--page-width={`${displayedPageWidth}px`}
	style:--page-half-width={`${displayedPageWidth / 2}px`}
	style:--box-top={`${boxTop}px`}
	style:min-height={`${documentHeight}px`}
>
	<div class="document-column" style:width={`${displayedPageWidth}px`}>
		<div
			class="document-stage"
			bind:this={documentStageElement}
			style:width={`${displayedPageWidth}px`}
			style:height={`${documentHeight}px`}
		>
			{@render documentContent()}
		</div>
	</div>

	{#if hasClauseBox}
		<div class="clause-box-anchor">
			{@render clauseBoxContent()}
		</div>
	{/if}
</div>

<style>
	.contract-workspace-layout {
		--rail-safe-gutter: 88px;
		--box-gap: 24px;
		--right-gutter: 24px;
		--box-min-width: 360px;
		--box-max-width: 480px;
		--box-width: clamp(
			var(--box-min-width),
			calc(
				100cqw - var(--rail-safe-gutter) - var(--page-width) - var(--box-gap) -
					var(--right-gutter)
			),
			var(--box-max-width)
		);
		--centered-page-left: calc(50cqw - var(--page-half-width));
		--right-anchored-page-left: calc(
			100cqw - var(--right-gutter) - var(--box-width) - var(--box-gap) -
				var(--page-width)
		);
		--page-left: min(var(--centered-page-left), var(--right-anchored-page-left));
		--page-shift: calc(
			var(--page-left) - var(--centered-page-left)
		);
		position: relative;
		width: 100%;
		container-type: inline-size;
	}

	.document-column {
		margin-inline: auto;
		transition: transform 180ms ease;
	}

	.document-stage {
		position: relative;
	}

	.clause-box-anchor {
		position: absolute;
		top: var(--box-top);
		right: var(--box-gap);
		z-index: 5;
		width: var(--box-width);
		animation: box-in 140ms ease both;
	}

	@container (width >= 1312px) {
		.has-clause-box .document-column {
			transform: translateX(var(--page-shift));
		}

		.has-clause-box .clause-box-anchor {
			right: auto;
			left: calc(var(--page-left) + var(--page-width) + var(--box-gap));
		}
	}

	@container (width < 1312px) {
		.has-clause-box .clause-box-anchor {
			position: fixed;
			top: auto;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 30;
			width: auto;
			animation-name: sheet-in;
		}
	}

	@keyframes box-in {
		from {
			opacity: 0;
			transform: translateY(3px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes sheet-in {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.document-column {
			transition: none;
		}

		.clause-box-anchor {
			animation: none;
		}
	}
</style>
