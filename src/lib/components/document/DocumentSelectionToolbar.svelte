<script lang="ts">
	import { onMount } from 'svelte';
	import ChatCenteredTextIcon from 'phosphor-svelte/lib/ChatCenteredTextIcon';
	import EraserIcon from 'phosphor-svelte/lib/EraserIcon';
	import SquareIconButton from '$lib/components/ui/SquareIconButton.svelte';
	import { createTextAnchor } from '$lib/document/anchors/text-anchor';
	import type { TextAnchor } from '$lib/document/anchors/types';

	let {
		container,
		onComment,
		onProposal
	}: {
		container?: HTMLElement;
		onComment: (anchor: TextAnchor) => void;
		onProposal: (anchor: TextAnchor) => void;
	} = $props();

	type SelectionPosition = {
		left: number;
		top: number;
		placement: 'above' | 'below';
	};

	const TOOLBAR_WIDTH = 58;
	const TOOLBAR_HEIGHT = 31;
	const VIEWPORT_PADDING = 8;
	const SELECTION_GAP = 10;

	const componentId = $props.id();
	const commentTooltipId = `${componentId}-comment-tooltip`;
	const proposalTooltipId = `${componentId}-proposal-tooltip`;

	let position = $state<SelectionPosition | null>(null);
	let anchor = $state<TextAnchor | null>(null);
	let canProposeChange = $state(false);
	let animationFrameId: number | null = null;
	let selectionPointerId: number | null = null;

	function clearActions() {
		position = null;
		anchor = null;
		canProposeChange = false;
	}

	function touchesHighlightedText(container: HTMLElement, range: Range): boolean {
		return Array.from(
			container.querySelectorAll<HTMLElement>('.contract-clause, .contract-proposal')
		).some((element) => range.intersectsNode(element));
	}

	function cancelPositionUpdate() {
		if (animationFrameId === null) return;

		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;
	}

	function updatePosition() {
		animationFrameId = null;

		if (selectionPointerId !== null) return;

		const selection = window.getSelection();
		const selectionContainer = container;

		if (
			!selection ||
			!selectionContainer ||
			selection.isCollapsed ||
			selection.rangeCount === 0
		) {
			clearActions();
			return;
		}

		const range = selection.getRangeAt(0);

		if (
			!selectionContainer.contains(range.startContainer) ||
			!selectionContainer.contains(range.endContainer) ||
			!selection.toString().trim()
		) {
			clearActions();
			return;
		}

		const nextAnchor = createTextAnchor(selectionContainer, range);

		if (!nextAnchor) {
			clearActions();
			return;
		}

		const rectangles = Array.from(range.getClientRects()).filter(
			(rectangle) => rectangle.width > 0 && rectangle.height > 0
		);

		if (rectangles.length === 0) {
			clearActions();
			return;
		}

		const firstRectangle = rectangles[0];
		const lastRectangle = rectangles.at(-1)!;
		const horizontalBoundary = TOOLBAR_WIDTH / 2 + VIEWPORT_PADDING;

		const left = Math.min(
			window.innerWidth - horizontalBoundary,
			Math.max(
				horizontalBoundary,
				lastRectangle.left + lastRectangle.width / 2
			)
		);

		const fitsBelow =
			lastRectangle.bottom +
				SELECTION_GAP +
				TOOLBAR_HEIGHT +
				VIEWPORT_PADDING <=
			window.innerHeight;

		position = {
			left,
			top: fitsBelow
				? lastRectangle.bottom + SELECTION_GAP
				: firstRectangle.top - SELECTION_GAP,
			placement: fitsBelow ? 'below' : 'above'
		};

		anchor = nextAnchor;
		canProposeChange =
			nextAnchor.segments.length === 1 && !touchesHighlightedText(selectionContainer, range);
	}

	function schedulePositionUpdate() {
		if (selectionPointerId !== null || animationFrameId !== null) return;

		animationFrameId = requestAnimationFrame(updatePosition);
	}

	function handlePointerDown(event: PointerEvent) {
		const selectionContainer = container;

		if (
			!event.isPrimary ||
			event.button !== 0 ||
			!selectionContainer ||
			!(event.target instanceof Node) ||
			!selectionContainer.contains(event.target)
		) {
			return;
		}

		selectionPointerId = event.pointerId;
		cancelPositionUpdate();
		clearActions();
	}

	function handlePointerUp(event: PointerEvent) {
		if (event.pointerId !== selectionPointerId) return;

		selectionPointerId = null;
		schedulePositionUpdate();
	}

	function handlePointerCancel(event: PointerEvent) {
		if (event.pointerId !== selectionPointerId) return;

		selectionPointerId = null;
		cancelPositionUpdate();
		clearActions();
	}

	function handleWindowBlur() {
		selectionPointerId = null;
		cancelPositionUpdate();
		clearActions();
	}

	function preserveSelection(event: PointerEvent) {
		event.preventDefault();
	}

	function chooseAction(kind: 'comment' | 'proposal') {
		if (!anchor || (kind === 'proposal' && !canProposeChange)) return;

		if (kind === 'comment') onComment(anchor);
		else onProposal(anchor);
		clearActions();
		window.getSelection()?.removeAllRanges();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' || !position) return;

		clearActions();
		window.getSelection()?.removeAllRanges();
	}

	onMount(() => {
		window.addEventListener('resize', schedulePositionUpdate);
		window.addEventListener('scroll', schedulePositionUpdate, true);
		window.addEventListener('blur', handleWindowBlur);
		document.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('pointercancel', handlePointerCancel);
		document.addEventListener('selectionchange', schedulePositionUpdate);
		document.addEventListener('keydown', handleKeydown);

		return () => {
			cancelPositionUpdate();

			window.removeEventListener('resize', schedulePositionUpdate);
			window.removeEventListener('scroll', schedulePositionUpdate, true);
			window.removeEventListener('blur', handleWindowBlur);
			document.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('pointerup', handlePointerUp);
			window.removeEventListener('pointercancel', handlePointerCancel);
			document.removeEventListener('selectionchange', schedulePositionUpdate);
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if position}
	<div
		class="text-selection-actions"
		class:is-above={position.placement === 'above'}
		style:left={`${position.left}px`}
		style:top={`${position.top}px`}
		style:--toolbar-width={`${TOOLBAR_WIDTH}px`}
		style:--toolbar-height={`${TOOLBAR_HEIGHT}px`}
		role="group"
		aria-label="Text selection actions"
		data-print-exclude
	>
		<div class="selection-action">
			<SquareIconButton
				type="button"
				aria-label="Add comment"
				aria-describedby={commentTooltipId}
				onpointerdown={preserveSelection}
				onclick={() => chooseAction('comment')}
			>
				<ChatCenteredTextIcon aria-hidden="true" size={20} weight="regular" />
			</SquareIconButton>

			<span id={commentTooltipId} role="tooltip">Add comment</span>
		</div>

		<div class="selection-action">
			<SquareIconButton
				type="button"
				aria-label="Propose change"
				aria-describedby={proposalTooltipId}
				disabled={!canProposeChange}
				onpointerdown={preserveSelection}
				onclick={() => chooseAction('proposal')}
			>
				<EraserIcon aria-hidden="true" size={20} weight="regular" />
			</SquareIconButton>

			<span id={proposalTooltipId} role="tooltip">
				{canProposeChange
					? 'Propose change'
					: 'Changes are unavailable for highlighted or multi-block text'}
			</span>
		</div>
	</div>
{/if}

<style>
	.text-selection-actions {
		position: fixed;
		z-index: 60;
		display: flex;
		box-sizing: border-box;
		width: var(--toolbar-width);
		height: var(--toolbar-height);
		align-items: center;
		padding: 2px;
		border: 1px solid var(--color-line);
		border-radius: var(--radius-popover);
		background: var(--color-surface);
		box-shadow: none;
		transform: translateX(-50%);
	}

	.text-selection-actions.is-above {
		transform: translate(-50%, -100%);
	}

	.selection-action {
		position: relative;
		display: flex;
	}

	.selection-action :global(button) {
		width: 26px;
		height: 25px;
	}

	.selection-action span {
		position: absolute;
		top: calc(100% + 7px);
		left: 50%;
		width: max-content;
		max-width: min(180px, calc(100vw - 24px));
		padding: 8px 10px;
		border-radius: var(--radius-control);
		background: var(--color-ink-secondary);
		color: var(--color-surface);
		font-size: 12px;
		line-height: 1.4;
		opacity: 0;
		pointer-events: none;
		transform: translateX(-50%);
		transition: opacity 100ms ease;
		visibility: hidden;
		white-space: nowrap;
	}

	.is-above .selection-action span {
		top: auto;
		bottom: calc(100% + 7px);
	}

	.selection-action:first-child span {
		left: 0;
		transform: none;
	}

	.selection-action:last-child span {
		right: 0;
		left: auto;
		transform: none;
	}

	.selection-action:hover span,
	.selection-action:focus-within span {
		opacity: 1;
		visibility: visible;
	}

	@media (prefers-reduced-motion: reduce) {
		.selection-action span {
			transition: none;
		}
	}
</style>
