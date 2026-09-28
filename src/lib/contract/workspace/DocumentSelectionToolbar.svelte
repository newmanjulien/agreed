<script lang="ts">
	import { onMount } from 'svelte';
	import ThumbsUpIcon from 'phosphor-svelte/lib/ThumbsUpIcon';
	import TextTSlashIcon from 'phosphor-svelte/lib/TextTSlashIcon';
	import SquareIconButton from '$lib/ui/SquareIconButton.svelte';
	import { createTextAnchor } from '$lib/contract/document/anchors/text-anchor';
	import type { TextAnchor } from '$lib/contract/document/anchors/types';

	let {
		container,
		onMark
	}: {
		container?: HTMLElement;
		onMark: (kind: 'flexible' | 'fixed', anchor: TextAnchor) => void;
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
	const flexibleTooltipId = `${componentId}-flexible-tooltip`;
	const fixedTooltipId = `${componentId}-fixed-tooltip`;

	let position = $state<SelectionPosition | null>(null);
	let anchor = $state<TextAnchor | null>(null);
	let animationFrameId: number | null = null;
	let selectionPointerId: number | null = null;

	function tooltipClass(align: 'start' | 'end', placement: SelectionPosition['placement']) {
		return [
			'pointer-events-none invisible absolute w-max max-w-[min(180px,calc(100vw-24px))] rounded-2xl bg-ink px-2.5 py-2 text-[11.5px] leading-[1.4] whitespace-nowrap text-surface opacity-0 transition-opacity duration-100 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 motion-reduce:transition-none',
			placement === 'above' ? 'bottom-[calc(100%+7px)]' : 'top-[calc(100%+7px)]',
			align === 'start' ? 'left-0' : 'right-0'
		];
	}

	function clearActions() {
		position = null;
		anchor = null;
	}

	function touchesHighlightedText(selectionContainer: HTMLElement, range: Range): boolean {
		return Array.from(
			selectionContainer.querySelectorAll<HTMLElement>('.contract-clause')
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
			!selection.toString().trim() ||
			touchesHighlightedText(selectionContainer, range)
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

	function chooseAction(kind: 'flexible' | 'fixed') {
		if (!anchor) return;

		const selected = anchor;
		clearActions();
		window.getSelection()?.removeAllRanges();
		onMark(kind, selected);
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
		class={[
			'fixed z-60 box-border flex h-[31px] w-[58px] -translate-x-1/2 items-center rounded-xl border border-line bg-surface p-0.5 shadow-none',
			position.placement === 'above' && '-translate-y-full'
		]}
		style:left={`${position.left}px`}
		style:top={`${position.top}px`}
		role="group"
		aria-label="Text selection actions"
		onpointerdown={preserveSelection}
	>
		<div class="group relative flex [&_button]:h-[25px]! [&_button]:w-[26px]!">
			<SquareIconButton
				type="button"
				disabled
				aria-label="Mark flexible"
				aria-describedby={flexibleTooltipId}
				onclick={() => chooseAction('flexible')}
			>
				<ThumbsUpIcon aria-hidden="true" size={20} weight="regular" />
			</SquareIconButton>

			<span id={flexibleTooltipId} class={tooltipClass('start', position.placement)} role="tooltip">
				Mark flexible
			</span>
		</div>

		<div class="group relative flex [&_button]:h-[25px]! [&_button]:w-[26px]!">
			<SquareIconButton
				type="button"
				disabled
				aria-label="Mark fixed"
				aria-describedby={fixedTooltipId}
				onclick={() => chooseAction('fixed')}
			>
				<TextTSlashIcon aria-hidden="true" size={20} weight="regular" />
			</SquareIconButton>

			<span id={fixedTooltipId} class={tooltipClass('end', position.placement)} role="tooltip">
				Mark fixed
			</span>
		</div>
	</div>
{/if}
