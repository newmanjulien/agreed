<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import type { ContractSession } from '$lib/contract/session.svelte';
	import { ContractChangeController } from './contract-change-controller';
	import {
		changeSucceeded,
		type ContractChangeResult
	} from '$lib/contract/change-result';
	import type { CommentSession } from '$lib/review/comment-session.svelte';
	import type { ProposalDraftSession } from '$lib/review/proposal-draft-session.svelte';
	import { DiscussionController } from '$lib/review/discussion-controller';
	import type { TextAnchor } from '$lib/document/anchors/types';
	import type { ProposalTarget } from '$lib/review/proposal-target';
	import type { DiscussionSession } from '$lib/review/discussion-session.svelte';
	import type { WidgetHintSession } from '$lib/onboarding/widget-hint-session.svelte';
	import { ClauseReferenceController } from '$lib/document/clause-reference-controller.svelte';
	import { PAGE_FORMAT } from '$lib/document/pagination/page-format';
	import { PaginationController } from '$lib/document/pagination/pagination-controller.svelte';
	import type { CompiledContract } from '$lib/contract/model';
	import type { ContractDocument } from '$lib/contract/types';
	import '$lib/styles/document.css';
	import DocumentCanvas from '$lib/components/document/DocumentCanvas.svelte';
	import ContractWorkspaceLayout from './ContractWorkspaceLayout.svelte';
	import LoadingDocument from '$lib/components/document/LoadingDocument.svelte';
	import MeasureSurface from '$lib/components/document/MeasureSurface.svelte';
	import DocumentSelectionToolbar from '$lib/components/document/DocumentSelectionToolbar.svelte';
	import WidgetHost from '$lib/components/widgets/WidgetHost.svelte';
	import { WidgetPositioner } from '$lib/components/widgets/widget-positioner.svelte';
	import type { WidgetCommands } from '$lib/components/widgets/widget-commands';
	import { buildWidgetView } from '$lib/components/widgets/widget-view';
	import { WorkspaceInteractionController } from './workspace-interaction-controller.svelte';
	import {
		connectDocumentEventBridge,
		connectInteractionDismissal
	} from './workspace-event-bridge';

	let {
		contract,
		session,
		comments,
		proposals,
		discussion,
		widgetHints,
		documentStageElement = $bindable(),
		onPaginationReadyChange
	}: {
		contract: CompiledContract;
		session: ContractSession;
		comments: CommentSession;
		proposals: ProposalDraftSession;
		discussion: DiscussionSession;
		widgetHints: WidgetHintSession;
		documentStageElement?: HTMLDivElement;
		onPaginationReadyChange: (isReady: boolean) => void;
	} = $props();
	const ANNOTATION_RAIL_MIN_WIDTH = 1000;
	const ONBOARDING_HINT_MIN_WIDTH = 1312;
	let pageScale = $state(1);
	let workspaceElement = $state<HTMLDivElement>();
	let onboardingHintsEnabled = $state(false);
	let mounted = $state(false);
	const widgetPositioner = new WidgetPositioner(() => documentStageElement);
	const clauseReferences = new ClauseReferenceController((clauseId) =>
		widgetPositioner.findClause(clauseId)
	);
	const interactions = new WorkspaceInteractionController(
		() => ({ comments, proposals, discussion }),
		{
			clearClauseReference: () => clauseReferences.clear(),
			onClauseClosed: (clauseId) => widgetHints.closeClause(clauseId),
			onReviewDraftClosed: () => widgetHints.closeReview(),
			onWidgetClosed: () => widgetPositioner.reset(),
			restoreWidgetFocus: (target) => widgetPositioner.restoreFocus(target)
		}
	);

	const pagination = new PaginationController(
		(isReady) => onPaginationReadyChange(isReady),
		() => void positionOverlaysAfterRender()
	);
	let paginationStatus = $derived(pagination.status);
	let pages = $derived(pagination.pages);
	let referencedClauseId = $derived(clauseReferences.clauseId);
	let displayWidth = $derived(PAGE_FORMAT.width * pageScale);
	let logicalStackHeight = $derived(
		pages.length * PAGE_FORMAT.height + Math.max(0, pages.length - 1) * PAGE_FORMAT.gap
	);
	let displayHeight = $derived(logicalStackHeight * pageScale);
	let workspaceHeight = $derived(Math.max(displayHeight, widgetPositioner.railBottom));
	let currentControlValues = $derived(session.currentControlValues(contract.clauses));
	let selectedClauseId = $derived(interactions.clauseId);
	let selectedProposalId = $derived(interactions.proposalId);
	let selectedProposal = $derived(
		selectedProposalId ? session.proposal(selectedProposalId) : undefined
	);
	let hasAnnotationRail = $derived(
		selectedClauseId === null &&
			selectedProposalId === null &&
			(comments.draftRanges.length > 0 ||
				comments.resolvedComments.length > 0 ||
				(proposals.target?.kind === 'text' && proposals.ranges.length > 0))
	);
	let widgetView = $derived(
		buildWidgetView({
			clauses: contract.clauses,
			controlValues: currentControlValues,
			selectedClauseId,
			selectedProposal,
			clauseProposalTarget:
				proposals.target?.kind === 'clause' ? proposals.target : undefined,
			showAnnotations: hasAnnotationRail
		})
	);
	let onboardingHint = $derived.by(() => {
		if (!onboardingHintsEnabled) return undefined;
		if (proposals.target) return widgetHints.reviewText('proposal');
		if (selectedClauseId) {
			return widgetHints.clauseText(
				selectedClauseId,
				contract.clauses[selectedClauseId].widget.type
			);
		}
		return widgetView?.kind === 'annotations'
			? widgetHints.reviewText(comments.draft ? 'comment' : undefined)
			: undefined;
	});
	let widgetPlacement: 'panel' | 'rail' | null = $derived(
		widgetView?.kind === 'annotations' ? 'rail' : widgetView ? 'panel' : null
	);

	function documentHasClause(document: ContractDocument, clauseId: string): boolean {
		return document.blocks.some(
			(block) =>
				block.type === 'paragraph' &&
				block.content.some((node) => node.type === 'clause' && node.id === clauseId)
		);
	}

	function updateScale() {
		const workspaceWidth = workspaceElement?.clientWidth ?? window.innerWidth;
		onboardingHintsEnabled = workspaceWidth >= ONBOARDING_HINT_MIN_WIDTH;
		const widgetWidth =
			hasAnnotationRail && workspaceWidth >= ANNOTATION_RAIL_MIN_WIDTH ? 456 : 30;
		const availableWidth = Math.max(280, workspaceWidth - widgetWidth);
		pageScale = Math.min(1, availableWidth / PAGE_FORMAT.width);
	}

	async function positionOverlaysAfterRender() {
		await widgetPositioner.positionAfterRender(interactions.widgetTarget, () => {
			comments.refresh();
			proposals.refresh();
		});
	}

	function selectClause(clauseId: string, fragmentKey: string) {
		interactions.openWidget({ kind: 'clause', id: clauseId, fragmentKey });
	}

	function openProposalLog(proposalId: string, fragmentKey: string | null = null) {
		interactions.openWidget({ kind: 'proposal-log', id: proposalId, fragmentKey });
	}

	function closeProposalLog(restoreFocus = false) {
		if (interactions.active?.kind === 'proposal-log') interactions.closeWidget(restoreFocus);
	}

	function startComment(anchor: TextAnchor) {
		interactions.startComment(anchor);
	}

	function startTextProposal(anchor: TextAnchor) {
		interactions.startProposal({ kind: 'text', anchor });
	}

	function dismissCommentDraft() {
		interactions.cancelCommentDraft();
	}

	function submitCommentDraft() {
		if (!comments.commitDraft()) return;
		interactions.finishCommentDraft();
	}

	function dismissProposalDraft() {
		interactions.cancelProposalDraft();
	}

	function clearActiveWidget(restoreFocus = false) {
		interactions.closeWidget(restoreFocus);
	}

	function clearSelection(restoreFocus = false) {
		if (interactions.active?.kind === 'clause') clearActiveWidget(restoreFocus);
	}

	$effect(() => {
		const element = widgetPositioner.element;
		if (!element || typeof ResizeObserver === 'undefined') return;

		const observer = new ResizeObserver(() =>
			widgetPositioner.ensureTargetVisible(interactions.widgetTarget)
		);
		observer.observe(element);

		return () => observer.disconnect();
	});

	$effect(() => {
		const element = workspaceElement;
		if (!element || typeof ResizeObserver === 'undefined') return;

		const observer = new ResizeObserver(() => {
			updateScale();
			void positionOverlaysAfterRender();
		});
		observer.observe(element);
		untrack(updateScale);

		return () => observer.disconnect();
	});

	$effect(() => {
		const target = documentStageElement;
		untrack(() => {
			comments.setTarget(target);
			proposals.setDocumentElement(target);
		});
		if (!target) return;

		return connectDocumentEventBridge({
			target,
			comments,
			onCommentActivate: (commentId) => discussionController.activate({ id: commentId })
		});
	});

	$effect(() => {
		const hintsEnabled = onboardingHintsEnabled;
		const proposalTarget = proposals.target;
		const clauseId = proposalTarget ? null : selectedClauseId;
		const hintType = proposalTarget ? 'proposal' : comments.draft ? 'comment' : null;
		if (!mounted || !hintsEnabled) return;

		untrack(() => {
			widgetHints.sync(
				clauseId
					? { id: clauseId, widgetType: contract.clauses[clauseId].widget.type }
					: undefined,
				hintType ?? undefined
			);
		});
	});

	$effect(() => {
		const clauseId = selectedClauseId;
		const proposalId = selectedProposalId;
		const annotationRailVisible = hasAnnotationRail;
		if (!mounted) return;
		untrack(() => {
			updateScale();
			if (clauseId || proposalId || annotationRailVisible) void positionOverlaysAfterRender();
		});
	});

	$effect(() => {
		const proposalId = selectedProposalId;
		const proposal = selectedProposal;
		if (!proposalId || proposal) return;
		untrack(() => closeProposalLog());
	});

	$effect(() => {
		const currentContract = contract.document;
		const currentClauses = contract.clauses;
		const currentSession = session;
		if (!mounted) return;

		untrack(() => {
			if (selectedClauseId && !documentHasClause(currentContract, selectedClauseId)) clearSelection();
			if (referencedClauseId && !documentHasClause(currentContract, referencedClauseId)) {
				clauseReferences.clear();
			}
			void pagination.apply(
				currentSession.snapshot(currentContract, currentClauses),
				true
			);
		});
	});

	let changeController = $derived.by(
		() =>
			new ContractChangeController(
				contract,
				session,
				(document) => pagination.apply(document, false)
			)
	);
	let discussionController = $derived.by(
		() =>
			new DiscussionController(comments, discussion, {
				activate: (target, startComposer) =>
					interactions.startDiscussion(target, startComposer),
				onClosed: (target) => interactions.discussionClosed(target)
			})
	);

	async function updateClauseControlValue(
		clauseId: string,
		controlId: string,
		value: string
	): Promise<ContractChangeResult> {
		return changeController.updateControl(clauseId, controlId, value);
	}

	function startClauseProposal(clauseId: string, optionValue: string): void {
		widgetHints.closeClause(clauseId);
		interactions.startProposal({ kind: 'clause', clauseId, optionValue });
	}

	async function submitProposal(
		target: ProposalTarget,
		text: string
	): Promise<ContractChangeResult> {
		const result = await changeController.proposeChange(target, text);
		if (!result.ok) return result;
		interactions.cancelProposalDraft();
		openProposalLog(result.value);
		return changeSucceeded(undefined);
	}

	async function editProposal(
		proposalId: string,
		text: string
	): Promise<ContractChangeResult> {
		return changeController.editProposal(proposalId, text);
	}

	async function deleteProposal(proposalId: string): Promise<ContractChangeResult> {
		const result = await changeController.deleteProposal(proposalId);
		if (!result.ok) return result;
		if (selectedProposalId === proposalId) closeProposalLog();
		return result;
	}

	const widgetCommands: WidgetCommands = {
		dismiss: () => clearActiveWidget(true),
		updateControl: updateClauseControlValue,
		startClauseProposal,
		submitProposal,
		cancelProposal: dismissProposalDraft,
		navigateToClause: (clauseId) => void clauseReferences.navigate(clauseId, clearSelection),
		editProposal,
		deleteProposal,
		cancelCommentDraft: dismissCommentDraft,
		submitCommentDraft,
		handleDiscussionAction: (target, action) =>
			discussionController.handleAction(target, action)
	};

	onMount(() => {
		updateScale();
		const disconnectInteractionDismissal = connectInteractionDismissal(interactions);
		mounted = true;

		return () => {
			mounted = false;
			pagination.destroy();
			clauseReferences.destroy();
			disconnectInteractionDismissal();
			discussion.cancel();
			comments.destroy();
			proposals.destroy();
		};
	});
</script>

<MeasureSurface bind:element={pagination.measurementElement} />

{#if paginationStatus === 'loading'}
	<LoadingDocument />
{:else if paginationStatus === 'error'}
	<div
		class="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center gap-1.5 text-center text-ink-secondary"
		role="alert"
	>
		<strong>We couldn’t display this contract.</strong>
		<span class="text-ink-muted">Please refresh to try again.</span>
	</div>
{:else}
	<div
		class="viewer-root w-full"
		data-pagination-status="ready"
		data-page-count={pages.length}
		style:--contract-page-width={`${PAGE_FORMAT.width}px`}
		style:--contract-page-height={`${PAGE_FORMAT.height}px`}
		style:--contract-page-horizontal-padding={`${PAGE_FORMAT.horizontalPadding}px`}
		style:--contract-page-top-padding={`${PAGE_FORMAT.topPadding}px`}
		style:--contract-first-page-top-padding={`${PAGE_FORMAT.firstTopPadding}px`}
		style:--contract-page-bottom-padding={`${PAGE_FORMAT.bottomPadding}px`}
		style:--contract-content-width={`${PAGE_FORMAT.contentWidth}px`}
		style:--contract-page-gap={`${PAGE_FORMAT.gap}px`}
	>
		{#snippet documentContent()}
			<DocumentCanvas
				{pages}
				scale={pageScale}
				width={displayWidth}
				height={displayHeight}
				clauses={contract.clauses}
				{selectedClauseId}
				{selectedProposalId}
				{referencedClauseId}
				onClauseSelect={selectClause}
				onProposalSelect={openProposalLog}
			/>
		{/snippet}

		{#snippet widgetContent()}
			{#if widgetView}
				<WidgetHost
					view={widgetView}
					{onboardingHint}
					{comments}
					{proposals}
					{discussion}
					{documentStageElement}
					commands={widgetCommands}
					bind:element={widgetPositioner.element}
					bind:bottom={widgetPositioner.railBottom}
				/>
			{/if}
		{/snippet}

		<ContractWorkspaceLayout
			{widgetPlacement}
			bind:element={workspaceElement}
			displayedPageWidth={displayWidth}
			documentHeight={displayHeight}
			{workspaceHeight}
			widgetTop={widgetPositioner.top}
			bind:documentStageElement
			{documentContent}
			{widgetContent}
		/>

		<DocumentSelectionToolbar
			container={documentStageElement}
			onComment={startComment}
			onProposal={startTextProposal}
		/>
	</div>
{/if}
