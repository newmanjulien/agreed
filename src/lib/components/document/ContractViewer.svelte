<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { getDocumentViewportMetrics } from '$lib/document/document-viewport';
	import { createPageMeasurement } from '$lib/document/pagination/measure';
	import { PAGE_FORMAT } from '$lib/document/pagination/page-format';
	import { paginateDocument } from '$lib/document/pagination/paginate';
	import type { PageLayout } from '$lib/document/pagination/types';
	import type { CompiledContract } from '$lib/document/contract-model';
	import { resolveContract } from '$lib/document/resolve-contract';
	import '$lib/styles/document.css';
	import DocumentPage from './DocumentPage.svelte';
	import ContractWorkspaceLayout from './ContractWorkspaceLayout.svelte';
	import LoadingPagination from './LoadingPagination.svelte';
	import MeasureSurface from './MeasureSurface.svelte';
	import ClauseBox from './ClauseBox.svelte';

	let { contract, documentStageElement = $bindable() }: {
		contract: CompiledContract;
		documentStageElement?: HTMLDivElement;
	} = $props();
	type PaginationStatus = 'loading' | 'ready' | 'error';
	let paginationStatus = $state<PaginationStatus>('loading');
	let pages = $state<PageLayout[]>([]);
	let activeConcessions = $state<Record<string, string>>({});
	let selectedClauseId = $state<string | null>(null);
	let selectedFragmentKey = $state<string | null>(null);
	let boxTop = $state(0);
	let measurementElement = $state<HTMLDivElement>();
	let clauseBoxElement = $state<HTMLElement>();
	let pageScale = $state(1);

	let displayWidth = $derived(PAGE_FORMAT.width * pageScale);
	let logicalStackHeight = $derived(pages.length * PAGE_FORMAT.height + Math.max(0, pages.length - 1) * PAGE_FORMAT.gap);
	let displayHeight = $derived(logicalStackHeight * pageScale);

	function updateScale() {
		pageScale = Math.min(1, Math.max(280, window.innerWidth - 30) / PAGE_FORMAT.width);
	}

	function selectedFragment(): HTMLElement | undefined {
		if (!selectedClauseId || !documentStageElement) return;
		const fragments = Array.from(documentStageElement.querySelectorAll<HTMLElement>('[data-clause-fragment-key]'));
		return fragments.find((fragment) => fragment.dataset.clauseFragmentKey === selectedFragmentKey)
			?? fragments.find((fragment) => fragment.dataset.clauseId === selectedClauseId);
	}

	async function positionBoxAfterRender() {
		await tick();
		const fragment = selectedFragment();
		if (!fragment || !documentStageElement) return;
		boxTop = fragment.getBoundingClientRect().top - documentStageElement.getBoundingClientRect().top;
		selectedFragmentKey = fragment.dataset.clauseFragmentKey ?? selectedFragmentKey;
		if (!clauseBoxElement || getComputedStyle(clauseBoxElement.parentElement!).position !== 'fixed') return;
		const bounds = fragment.getBoundingClientRect();
		const boxBounds = clauseBoxElement.getBoundingClientRect();
		const viewport = getDocumentViewportMetrics();
		const availableBottom = boxBounds.top - viewport.gap;
		if (bounds.bottom > availableBottom) window.scrollBy({ top: bounds.bottom - availableBottom });
		else if (bounds.top < viewport.top) window.scrollBy({ top: bounds.top - viewport.top });
	}

	function selectClause(clauseId: string, fragmentKey: string) {
		clearSelection();
		selectedClauseId = clauseId;
		selectedFragmentKey = fragmentKey;
	}

	function clearSelection(restoreFocus = false) {
		const focusTarget = restoreFocus ? selectedFragment() : undefined;
		selectedClauseId = null;
		selectedFragmentKey = null;
		if (focusTarget) void tick().then(() => focusTarget.focus({ preventScroll: true }));
	}

	$effect(() => {
		if (selectedClauseId) void positionBoxAfterRender();
	});

	async function paginate() {
		try {
			await tick();
			await document.fonts.ready;
			if (!measurementElement) throw new Error('The measurement surface is unavailable.');
			const redlineDocument = resolveContract(contract.document, contract.concessions, activeConcessions, 'redline');
			pages = paginateDocument(redlineDocument, createPageMeasurement(measurementElement));
			paginationStatus = 'ready';
			if (selectedClauseId) void positionBoxAfterRender();
		} catch (error) {
			console.error('Contract pagination failed.', error);
			paginationStatus = 'error';
		}
	}

	function toggleConcession(concessionId: string) {
		const targetId = contract.concessions[concessionId].targetProvisionId;
		if (activeConcessions[targetId] === concessionId) delete activeConcessions[targetId];
		else activeConcessions[targetId] = concessionId;
		void paginate();
	}

	onMount(() => {
		function handleResize() { updateScale(); void positionBoxAfterRender(); }
		function handlePointerDown(event: PointerEvent) {
			if (!selectedClauseId) return;
			const inside = event.composedPath().some((node) => node instanceof HTMLElement && (Boolean(node.dataset.clauseId) || node.hasAttribute('data-clause-box')));
			if (!inside) clearSelection();
		}
		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') clearSelection(true);
		}
		updateScale();
		void paginate();
		window.addEventListener('resize', handleResize);
		document.addEventListener('pointerdown', handlePointerDown);
		document.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('resize', handleResize);
			document.removeEventListener('pointerdown', handlePointerDown);
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<MeasureSurface bind:element={measurementElement} />
{#if paginationStatus === 'loading'}
	<LoadingPagination />
{:else if paginationStatus === 'error'}
	<div class="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center gap-1.5 text-center text-ink-secondary" role="alert">
		<strong>We couldn’t display this contract.</strong>
		<span class="text-ink-muted">Please refresh to try again.</span>
	</div>
{:else}
	<div class="viewer-root w-full" data-pagination-status="ready" data-page-count={pages.length}
		style:--contract-page-width={`${PAGE_FORMAT.width}px`}
		style:--contract-page-height={`${PAGE_FORMAT.height}px`}
		style:--contract-page-horizontal-padding={`${PAGE_FORMAT.horizontalPadding}px`}
		style:--contract-page-top-padding={`${PAGE_FORMAT.topPadding}px`}
		style:--contract-first-page-top-padding={`${PAGE_FORMAT.firstTopPadding}px`}
		style:--contract-page-bottom-padding={`${PAGE_FORMAT.bottomPadding}px`}
		style:--contract-content-width={`${PAGE_FORMAT.contentWidth}px`}
		style:--contract-page-gap={`${PAGE_FORMAT.gap}px`}>
		{#snippet documentContent()}
			<div class="page-viewport relative shrink-0" style:width={`${displayWidth}px`} style:height={`${displayHeight}px`}>
				<div class="page-stack absolute top-0 left-0 flex w-(--contract-page-width) origin-top-left flex-col gap-(--contract-page-gap)" style:transform={`scale(${pageScale})`}>
					{#each pages as page}
						<DocumentPage {page} totalPages={pages.length} {selectedClauseId} onClauseSelect={selectClause} />
					{/each}
				</div>
			</div>
		{/snippet}
		{#snippet clauseBoxContent()}
			{#if selectedClauseId}
				{#key selectedClauseId}
					<ClauseBox clauseId={selectedClauseId} definition={contract.clauseBoxes[selectedClauseId]}
						concessions={contract.concessions} {activeConcessions} onToggleConcession={toggleConcession}
						onDismiss={() => clearSelection(true)} bind:element={clauseBoxElement} />
				{/key}
			{/if}
		{/snippet}
		<ContractWorkspaceLayout hasClauseBox={selectedClauseId !== null} displayedPageWidth={displayWidth}
			documentHeight={displayHeight} {boxTop} bind:documentStageElement {documentContent} {clauseBoxContent} />
	</div>
{/if}
