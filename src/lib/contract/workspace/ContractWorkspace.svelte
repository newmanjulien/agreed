<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import type { ContractSession } from '$lib/contract/session.svelte';
	import { ContractChangeController } from './contract-change-controller';
	import type { ContractChangeResult } from '$lib/contract/change-result';
	import type { HintSession } from './guide/widget-hint-session.svelte';
	import { ClauseReferenceController } from '$lib/contract/document/clause-reference-controller.svelte';
	import { PAGE_FORMAT } from '$lib/contract/document/pagination/page-format';
	import { PaginationController } from '$lib/contract/document/pagination/pagination-controller.svelte';
	import type { CompiledContract } from '$lib/contract/model';
	import type { ContractDocument } from '$lib/contract/types';
	import type { TextAnchor } from '$lib/contract/document/anchors/types';
	import '$lib/contract/document/document.css';
	import DocumentCanvas from '$lib/contract/document/canvas/DocumentCanvas.svelte';
	import ContractWorkspaceLayout from './ContractWorkspaceLayout.svelte';
	import MeasureSurface from '$lib/contract/document/canvas/MeasureSurface.svelte';
	import DocumentSelectionToolbar from './DocumentSelectionToolbar.svelte';
	import WorkspaceChrome from './WorkspaceChrome.svelte';
	import WidgetHost from './widgets/WidgetHost.svelte';
	import { WidgetPositioner } from './widgets/widget-positioner.svelte';
	import type { WidgetCommands } from './widgets/widget-commands';
	import { buildWidgetView } from './widgets/widget-view';
	import { WorkspaceInteractionController } from './workspace-interaction-controller.svelte';
	import { connectInteractionDismissal } from './workspace-event-bridge';

	let {
		contract,
		session,
		widgetHints,
		onOpenGuide,
		onMark
	}: {
		contract: CompiledContract;
		session: ContractSession;
		widgetHints: HintSession;
		onOpenGuide: () => void;
		onMark: (kind: 'flexible' | 'fixed', anchor: TextAnchor) => void;
	} = $props();
	const HINT_MIN_WIDTH = 1312;
	let pageScale = $state(1);
	let documentStageElement = $state<HTMLDivElement>();
	let workspaceElement = $state<HTMLDivElement>();
	let hintsEnabled = $state(false);
	let mounted = $state(false);
	const widgetPositioner = new WidgetPositioner(() => documentStageElement);
	const clauseReferences = new ClauseReferenceController((clauseId) =>
		widgetPositioner.findClause(clauseId)
	);
	const interactions = new WorkspaceInteractionController({
		clearClauseReference: () => clauseReferences.clear(),
		onClauseClosed: (clauseId) => widgetHints.closeClause(clauseId),
		onWidgetClosed: () => widgetPositioner.reset(),
		restoreWidgetFocus: (target) => widgetPositioner.restoreFocus(target)
	});

	const pagination = new PaginationController(() => void positionOverlaysAfterRender());
	let paginationStatus = $derived(pagination.status);
	let pages = $derived(pagination.pages);
	let referencedClauseId = $derived(clauseReferences.clauseId);
	let displayWidth = $derived(PAGE_FORMAT.width * pageScale);
	let logicalStackHeight = $derived(
		pages.length * PAGE_FORMAT.height + Math.max(0, pages.length - 1) * PAGE_FORMAT.gap
	);
	let displayHeight = $derived(logicalStackHeight * pageScale);
	let currentControlValues = $derived(session.currentControlValues(contract.clauses));
	let selectedClauseId = $derived(interactions.clauseId);
	let widgetView = $derived(
		buildWidgetView({
			clauses: contract.clauses,
			controlValues: currentControlValues,
			selectedClauseId
		})
	);
	let hint = $derived.by(() => {
		if (!hintsEnabled || !selectedClauseId) return undefined;
		return widgetHints.clauseText(
			selectedClauseId,
			contract.clauses[selectedClauseId].widget.type
		);
	});
	let widgetPlacement: 'panel' | 'rail' | null = $derived(widgetView ? 'panel' : null);

	function documentHasClause(document: ContractDocument, clauseId: string): boolean {
		return document.blocks.some(
			(block) =>
				block.type === 'paragraph' &&
				block.content.some((node) => node.type === 'clause' && node.id === clauseId)
		);
	}

	function updateScale() {
		const workspaceWidth = workspaceElement?.clientWidth ?? window.innerWidth;
		hintsEnabled = workspaceWidth >= HINT_MIN_WIDTH;
		const availableWidth = Math.max(280, workspaceWidth - 30);
		pageScale = Math.min(1, availableWidth / PAGE_FORMAT.width);
	}

	async function positionOverlaysAfterRender() {
		await widgetPositioner.positionAfterRender(interactions.widgetTarget);
	}

	function selectClause(clauseId: string, fragmentKey: string) {
		interactions.openWidget({ kind: 'clause', id: clauseId, fragmentKey });
	}

	function startMark(kind: 'flexible' | 'fixed', anchor: TextAnchor) {
		clearSelection();
		clauseReferences.clear();
		onMark(kind, anchor);
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
		const canShowHints = hintsEnabled;
		const clauseId = selectedClauseId;
		if (!mounted || !canShowHints) return;

		untrack(() => {
			widgetHints.sync(
				clauseId
					? { id: clauseId, widgetType: contract.clauses[clauseId].widget.type }
					: undefined
			);
		});
	});

	$effect(() => {
		const clauseId = selectedClauseId;
		if (!mounted) return;
		untrack(() => {
			updateScale();
			if (clauseId) void positionOverlaysAfterRender();
		});
	});

	$effect(() => {
		const currentContract = contract.document;
		const currentClauses = contract.clauses;
		const currentSession = session;
		if (!mounted) return;

		untrack(() => {
			if (selectedClauseId && !documentHasClause(currentContract, selectedClauseId)) {
				clearSelection();
			}
			if (referencedClauseId && !documentHasClause(currentContract, referencedClauseId)) {
				clauseReferences.clear();
			}
			void pagination.apply(currentSession.snapshot(currentContract, currentClauses), true);
		});
	});

	let changeController = $derived.by(
		() =>
			new ContractChangeController(contract, session, (document) =>
				pagination.apply(document, false)
			)
	);

	async function updateClauseControlValue(
		clauseId: string,
		controlId: string,
		value: string
	): Promise<ContractChangeResult> {
		return changeController.updateControl(clauseId, controlId, value);
	}

	const widgetCommands: WidgetCommands = {
		dismiss: () => clearActiveWidget(true),
		updateControl: updateClauseControlValue,
		navigateToClause: (clauseId) => void clauseReferences.navigate(clauseId, clearSelection)
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
		};
	});
</script>

<WorkspaceChrome searchTarget={documentStageElement} {onOpenGuide} />
<MeasureSurface bind:element={pagination.measurementElement} />

{#if paginationStatus === 'loading'}
	<div
		class="grid min-h-[calc(100vh-100px)] place-items-center"
		data-testid="pagination-loading"
		role="status"
		aria-live="polite"
	>
		<span
			class="size-6 animate-spin rounded-full border-2 border-line border-t-muted [animation-duration:700ms] motion-reduce:[animation-duration:1400ms]"
			aria-hidden="true"
		></span>
		<span class="sr-only">Laying out contract pages</span>
	</div>
{:else if paginationStatus === 'error'}
	<div
		class="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center gap-1.5 text-center text-muted"
		role="alert"
	>
		<strong>We couldn’t display this contract.</strong>
		<span class="text-muted">Please refresh to try again.</span>
	</div>
{:else}
	<div
		class="viewer-root w-full"
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
				{referencedClauseId}
				onClauseSelect={selectClause}
			/>
		{/snippet}

		{#snippet widgetContent()}
			{#if widgetView}
				<WidgetHost
					view={widgetView}
					{hint}
					commands={widgetCommands}
					bind:element={widgetPositioner.element}
				/>
			{/if}
		{/snippet}

		<ContractWorkspaceLayout
			{widgetPlacement}
			bind:element={workspaceElement}
			displayedPageWidth={displayWidth}
			documentHeight={displayHeight}
			workspaceHeight={displayHeight}
			widgetTop={widgetPositioner.top}
			bind:documentStageElement
			{documentContent}
			{widgetContent}
		/>

		<DocumentSelectionToolbar container={documentStageElement} onMark={startMark} />
	</div>
{/if}
