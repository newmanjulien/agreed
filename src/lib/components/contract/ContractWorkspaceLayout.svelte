<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		widgetPlacement,
		displayedPageWidth,
		documentHeight,
		workspaceHeight,
		widgetTop,
		element = $bindable(),
		documentStageElement = $bindable(),
		documentContent,
		widgetContent
	}: {
		widgetPlacement: 'panel' | 'rail' | null;
		displayedPageWidth: number;
		documentHeight: number;
		workspaceHeight: number;
		widgetTop: number;
		element?: HTMLDivElement;
		documentStageElement?: HTMLDivElement;
		documentContent: Snippet;
		widgetContent: Snippet;
	} = $props();
</script>

<div
	class="contract-workspace-layout"
	bind:this={element}
	class:has-widget-panel={widgetPlacement === 'panel'}
	class:has-widget-rail={widgetPlacement === 'rail'}
	style:--page-width={`${displayedPageWidth}px`}
	style:--page-half-width={`${displayedPageWidth / 2}px`}
	style:--widget-top={`${widgetTop}px`}
	style:min-height={`${workspaceHeight}px`}
>
	<div class="document-column" style:width={`${displayedPageWidth}px`}>
		<div
			class="document-stage"
			data-print-document
			bind:this={documentStageElement}
			style:width={`${displayedPageWidth}px`}
			style:height={`${documentHeight}px`}
		>
			{@render documentContent()}
		</div>
	</div>

	{#if widgetPlacement}
		<div class="widget-layer" data-print-exclude>
			{@render widgetContent()}
		</div>
	{/if}
</div>

<style>
	.contract-workspace-layout {
		--rail-safe-gutter: 88px;
		--panel-gap: 24px;
		--right-gutter: 24px;
		--panel-min-width: 360px;
		--panel-max-width: 480px;
		--panel-width: clamp(
			var(--panel-min-width),
			calc(
				100cqw - var(--rail-safe-gutter) - var(--page-width) - var(--panel-gap) -
					var(--right-gutter)
			),
			var(--panel-max-width)
		);
		--centered-page-left: calc(50cqw - var(--page-half-width));
		--right-anchored-page-left: calc(
			100cqw - var(--right-gutter) - var(--panel-width) - var(--panel-gap) -
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

	.widget-layer {
		position: absolute;
		top: var(--widget-top);
		right: var(--panel-gap);
		z-index: 5;
		width: var(--panel-width);
		animation: panel-in 140ms ease both;
	}

	.has-widget-rail {
		--panel-min-width: 320px;
	}

	.has-widget-rail .widget-layer :global(.widget-frame) {
		padding: 10px;
	}

	@container (width >= 1000px) {
		.has-widget-rail .document-column {
			transform: translateX(var(--page-shift));
		}

		.has-widget-rail .widget-layer {
			right: auto;
			left: calc(var(--page-left) + var(--page-width) + var(--panel-gap));
		}
	}

	@container (width >= 1312px) {
		.has-widget-panel .document-column {
			transform: translateX(var(--page-shift));
		}

		.has-widget-panel .widget-layer {
			right: auto;
			left: calc(var(--page-left) + var(--page-width) + var(--panel-gap));
		}
	}

	@container (width < 1000px) {
		.has-widget-rail .widget-layer {
			position: fixed;
			top: auto;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 30;
			width: auto;
			animation-name: sheet-in;
		}

		.has-widget-rail .widget-layer :global(.widget-frame) {
			display: grid;
			max-height: min(65dvh, 560px);
			grid-template-rows: auto minmax(0, 1fr);
			padding: 0;
			overflow: hidden;
			border-width: 1px 0 0;
			border-radius: var(--radius-widget) var(--radius-widget) 0 0;
		}

		.has-widget-rail .widget-layer :global(.widget-frame-header) {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 24px;
			margin-bottom: 0;
			padding: 12px 14px;
		}

		.has-widget-rail .widget-layer :global(.widget-frame-header:not(.has-intro)) {
			justify-content: flex-end;
			gap: 0;
			padding: 8px 12px 0;
		}

		.has-widget-rail .widget-layer :global(.widget-frame-close) {
			display: block;
			flex: none;
		}

		.has-widget-rail .widget-layer :global(.widget-frame-body) {
			overflow-y: auto;
			overscroll-behavior: contain;
			padding: 0 14px calc(14px + env(safe-area-inset-bottom));
		}
	}

	@container (width < 1312px) {
		.has-widget-panel .widget-layer {
			position: fixed;
			top: auto;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 30;
			width: auto;
			animation-name: sheet-in;
		}

		.has-widget-panel .widget-layer :global(.widget-frame) {
			display: grid;
			max-height: min(65dvh, 560px);
			grid-template-rows: auto minmax(0, 1fr);
			padding: 0;
			overflow: hidden;
			border-width: 1px 0 0;
			border-radius: var(--radius-widget) var(--radius-widget) 0 0;
		}

		.has-widget-panel .widget-layer :global(.widget-frame-header) {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 24px;
			margin-bottom: 0;
			padding: 12px 14px;
		}

		.has-widget-panel .widget-layer :global(.widget-frame-close) {
			display: block;
			flex: none;
		}

		.has-widget-panel .widget-layer :global(.widget-frame-body) {
			overflow-y: auto;
			overscroll-behavior: contain;
			padding: 0 14px calc(14px + env(safe-area-inset-bottom));
		}
	}

	@keyframes panel-in {
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

		.widget-layer {
			animation: none;
		}
	}
</style>
