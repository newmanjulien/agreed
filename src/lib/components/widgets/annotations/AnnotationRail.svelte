<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import type { CommentSession } from '$lib/review/comment-session.svelte';
	import type { DocumentComment, CommentDraft } from '$lib/review/comment-types';
	import type { ProposalDraftSession } from '$lib/review/proposal-draft-session.svelte';
	import type { ProposalTarget, TextProposalTarget } from '$lib/review/proposal-target';
	import type { ContractChangeResult } from '$lib/contract/change-result';
	import type { DiscussionSession } from '$lib/review/discussion-session.svelte';
	import type {
		DiscussionTarget,
		DiscussionThreadAction
	} from '$lib/review/discussion-types';
	import { getDocumentViewportMetrics } from '$lib/document/document-viewport';
	import CommentComposerWidget from '../comments/CommentComposerWidget.svelte';
	import {
		packAnnotationRail,
		type AnnotationRailLayoutItem
	} from './annotation-rail-layout';
	import CommentThreadWidget from '../comments/CommentThreadWidget.svelte';
	import WidgetHelpText from '../shared/WidgetHelpText.svelte';
	import ProposalComposerWidget from '../proposals/ProposalComposerWidget.svelte';

	type StoredCommentCard = {
		type: 'stored-comment';
		id: string;
		comment: DocumentComment;
		ranges: Range[];
		order: number;
	};
	type CommentComposerCard = {
		type: 'comment-composer';
		id: string;
		draft: CommentDraft;
		ranges: Range[];
		order: number;
	};
	type ProposalComposerCard = {
		type: 'proposal-composer';
		id: string;
		target: TextProposalTarget;
		ranges: Range[];
		order: number;
	};
	type RailCard = StoredCommentCard | CommentComposerCard | ProposalComposerCard;
	type AnchorMeasurement = {
		top: number;
		center: number;
	};
	type MeasuredAnnotationCard = AnnotationRailLayoutItem & {
		targetTop: number;
	};

	const COMMENT_COMPOSER_CARD_ID = 'comment-draft-composer';
	const PROPOSAL_COMPOSER_CARD_ID_PREFIX = 'proposal-draft-composer';

	let {
		comments,
		proposals,
		discussion,
		documentStageElement,
		creationHint,
		onCancelComment,
		onSubmitComment,
		onCancelProposal,
		onSubmitProposal,
		onDiscussionAction,
		bottom = $bindable(0)
	}: {
		comments: CommentSession;
		proposals: ProposalDraftSession;
		discussion: DiscussionSession;
		documentStageElement?: HTMLElement;
		creationHint?: string;
		onCancelComment: () => void;
		onSubmitComment: () => void;
		onCancelProposal: () => void;
		onSubmitProposal: (target: ProposalTarget, text: string) => Promise<ContractChangeResult>;
		onDiscussionAction: (target: DiscussionTarget, action: DiscussionThreadAction) => void;
		bottom?: number;
	} = $props();

	let railElement = $state<HTMLDivElement>();
	let placements = $state<Record<string, number>>({});
	let previouslyPlacedCardIds = $state<Set<string>>(new Set());
	let proposalComposerCardId = $derived(
		`${PROPOSAL_COMPOSER_CARD_ID_PREFIX}-${proposals.draftId}`
	);
	let cards = $derived.by<RailCard[]>(() => {
		const commentDraft = comments.draft;
		const proposalTarget = proposals.target;
		return [
			...comments.resolvedComments.map(({ comment, ranges }, order) => ({
				type: 'stored-comment' as const,
				id: comment.id,
				comment,
				ranges,
				order
			})),
			...(commentDraft && comments.draftRanges.length > 0
				? [
						{
							type: 'comment-composer' as const,
							id: COMMENT_COMPOSER_CARD_ID,
							ranges: comments.draftRanges,
							order: comments.comments.length,
							draft: commentDraft
						}
					]
				: []),
			...(proposalTarget?.kind === 'text' && proposals.ranges.length > 0
				? [
						{
							type: 'proposal-composer' as const,
							id: proposalComposerCardId,
							target: proposalTarget,
							ranges: proposals.ranges,
							order: comments.comments.length
						}
					]
				: [])
		];
	});
	let activeCardId = $derived.by(() => {
		if (proposals.target?.kind === 'text') return proposalComposerCardId;
		if (comments.draft) return COMMENT_COMPOSER_CARD_ID;
		const target = discussion.composer?.target;
		if (!target) return null;
		return target.id;
	});

	function measureFirstAnchor(ranges: Range[]): AnchorMeasurement | undefined {
		for (const range of ranges) {
			const rectangles = Array.from(range.getClientRects()).filter(
				(rectangle) => rectangle.width > 0 || rectangle.height > 0
			);
			if (rectangles.length === 0) continue;
			const top = Math.min(...rectangles.map((rectangle) => rectangle.top));
			const bottom = Math.max(...rectangles.map((rectangle) => rectangle.bottom));
			return { top, center: (top + bottom) / 2 };
		}
	}

	function isDesktopRail() {
		const anchor = railElement?.parentElement;
		return Boolean(anchor && getComputedStyle(anchor).position === 'absolute');
	}

	function updateLayout() {
		if (!documentStageElement || !railElement || !isDesktopRail()) {
			placements = {};
			previouslyPlacedCardIds = new Set();
			bottom = 0;
			return;
		}

		const stageTop = documentStageElement.getBoundingClientRect().top;
		const cardElements = new Map(
			Array.from(railElement.querySelectorAll<HTMLElement>('[data-annotation-card-id]')).map(
				(element) => [element.dataset.annotationCardId!, element]
			)
		);
		const measuredCards = cards
			.map((card) => {
				const anchor = measureFirstAnchor(card.ranges);
				const element = cardElements.get(card.id);
				if (!anchor || !element) return null;
				const height = element.getBoundingClientRect().height;
				return {
					id: card.id,
					anchorTop: anchor.top - stageTop,
					height,
					order: card.order,
					targetTop: anchor.center - stageTop - height / 2
				};
			})
			.filter((card): card is MeasuredAnnotationCard => card !== null);
		const activeCard = measuredCards.find((card) => card.id === activeCardId);

		const layout = packAnnotationRail(
			measuredCards,
			activeCard ? { id: activeCard.id, targetTop: activeCard.targetTop } : null
		);
		previouslyPlacedCardIds = new Set(Object.keys(placements));
		placements = layout.placements;
		bottom = layout.bottom;
	}

	function handleStoredDiscussionAction(
		target: DiscussionTarget,
		action: DiscussionThreadAction,
		card: RailCard
	) {
		onDiscussionAction(target, action);
		if (action.type === 'activate') void scrollAnchorIntoView(card.ranges);
	}

	function discussionTarget(card: StoredCommentCard): DiscussionTarget {
		return { id: card.id };
	}

	async function scrollAnchorIntoView(ranges: Range[]) {
		await tick();

		if (isDesktopRail()) return;

		const anchor = measureFirstAnchor(ranges);
		const sheetTop = railElement?.getBoundingClientRect().top ?? window.innerHeight;
		if (!anchor) return;

		const viewport = getDocumentViewportMetrics();
		const availableBottom = Math.max(viewport.top, sheetTop - viewport.gap);
		const visibleCenter = (viewport.top + availableBottom) / 2;
		window.scrollBy({
			top: anchor.center - visibleCenter,
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'auto'
				: 'smooth'
		});
	}

	$effect(() => {
		const currentCards = cards;
		const rail = railElement;
		if (!rail || currentCards.length === 0 || typeof ResizeObserver === 'undefined') {
			placements = {};
			previouslyPlacedCardIds = new Set();
			bottom = 0;
			return;
		}

		let cancelled = false;
		let observer: ResizeObserver | undefined;
		void tick().then(() => {
			if (cancelled) return;
			observer = new ResizeObserver(updateLayout);
			observer.observe(rail);
			for (const card of rail.querySelectorAll<HTMLElement>('[data-annotation-card-id]')) {
				observer.observe(card);
			}
			updateLayout();
		});

		return () => {
			cancelled = true;
			observer?.disconnect();
		};
	});

	$effect(() => {
		const currentActiveCardId = activeCardId;
		if (!railElement) return;
		let cancelled = false;
		void tick().then(() => {
			if (!cancelled && currentActiveCardId === activeCardId) updateLayout();
		});
		return () => {
			cancelled = true;
		};
	});

	onMount(() => {
		window.addEventListener('resize', updateLayout);
		return () => window.removeEventListener('resize', updateLayout);
	});

	onDestroy(() => {
		bottom = 0;
	});
</script>

{#snippet commentEditor(draft: CommentDraft)}
	<div data-widget>
		<CommentComposerWidget
			text={draft.text}
			onTextChange={(text) => comments.updateDraftText(text)}
			onCancel={onCancelComment}
			onSubmit={onSubmitComment}
		/>
		{#if creationHint}
			<WidgetHelpText text={creationHint} />
		{/if}
	</div>
{/snippet}

{#snippet proposalEditor(target: ProposalTarget)}
	<div data-widget>
		<ProposalComposerWidget
			{target}
			onDismiss={onCancelProposal}
			onSubmit={onSubmitProposal}
		/>
		{#if creationHint}
			<WidgetHelpText text={creationHint} />
		{/if}
	</div>
{/snippet}

<div class="annotation-rail" bind:this={railElement}>
	{#each cards as card (card.id)}
		<div
			class="annotation-card"
			class:is-mobile-visible={card.type !== 'stored-comment' ||
				card.id === activeCardId}
			class:is-positioned={placements[card.id] !== undefined}
			class:was-positioned={previouslyPlacedCardIds.has(card.id)}
			data-annotation-card-id={card.id}
			style:transform={`translateY(${placements[card.id] ?? 0}px)`}
		>
			{#if card.type === 'comment-composer'}
				{@render commentEditor(card.draft)}
			{:else if card.type === 'proposal-composer'}
				{@render proposalEditor(card.target)}
			{:else}
				{@const target = discussionTarget(card)}
				<CommentThreadWidget
					root={card.comment}
					{target}
					composer={discussion.isActive(target) ? discussion.composer : null}
					onAction={(action) => handleStoredDiscussionAction(target, action, card)}
				/>
			{/if}
		</div>
	{/each}
</div>

<style>
	.annotation-rail {
		position: relative;
		width: 100%;
	}

	.annotation-card {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		visibility: hidden;
	}

	.annotation-card.is-positioned {
		visibility: visible;
	}

	.annotation-card:has(:global([aria-haspopup='menu'][aria-expanded='true'])) {
		z-index: 1;
	}

	.annotation-card.was-positioned {
		transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	@container (width < 1000px) {
		.annotation-card {
			display: none;
			position: relative;
			transform: none !important;
			visibility: visible;
		}

		.annotation-card.is-mobile-visible {
			display: block;
		}

		.annotation-card :global(.comment-thread-widget) {
			padding-bottom: env(safe-area-inset-bottom);
			border-width: 1px 0 0;
			border-radius: var(--radius-widget) var(--radius-widget) 0 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.annotation-card.was-positioned {
			transition: none;
		}
	}
</style>
