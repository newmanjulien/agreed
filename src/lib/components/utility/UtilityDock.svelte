<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { DocumentSearchSession } from '$lib/document/search/search-session.svelte';
	import UtilityRail from './UtilityRail.svelte';
	import DocumentSearchPanel from './search/DocumentSearchPanel.svelte';
	import DocumentDownloadPanel from './download/DocumentDownloadPanel.svelte';
	import type { DownloadFormat, UtilityPanelId } from './types';

	let {
		searchTarget,
		canPrint,
		onDownloadWord,
		onPrintContract,
		onOpenOnboarding
	}: {
		searchTarget?: HTMLDivElement;
		canPrint: boolean;
		onDownloadWord: () => Promise<void>;
		onPrintContract: () => Promise<void>;
		onOpenOnboarding: () => void;
	} = $props();
	const UTILITY_CHROME_NARROW_QUERY = '(max-width: 999px)';
	const searchSession = new DocumentSearchSession();
	let activePanel = $state<UtilityPanelId | null>(null);
	let activeTrigger: HTMLButtonElement | undefined;
	let isDownloading = $state(false);
	let downloadError = $state('');

	function togglePanel(panel: UtilityPanelId, trigger: HTMLButtonElement) {
		if (activePanel === panel) {
			closePanel();
			return;
		}

		if (activePanel === 'search') searchSession.clear();
		activePanel = panel;
		activeTrigger = trigger;
	}

	function closePanel(restoreFocus = true) {
		if (!activePanel) return;
		const trigger = activeTrigger;
		if (activePanel === 'search') searchSession.clear();
		activePanel = null;
		activeTrigger = undefined;

		if (restoreFocus && trigger) {
			void tick().then(() => trigger.focus({ preventScroll: true }));
		}
	}

	function openOnboarding() {
		closePanel(false);
		onOpenOnboarding();
	}

	async function downloadContract(format: DownloadFormat) {
		if (isDownloading) return;
		isDownloading = true;
		downloadError = '';

		try {
			if (format === 'word') await onDownloadWord();
			else await onPrintContract();
			if (activePanel === 'download') closePanel();
		} catch (error) {
			console.error(`${format === 'word' ? 'Word' : 'PDF'} export failed.`, error);
			downloadError =
				format === 'word'
					? 'Couldn’t create the Word document.'
					: 'Couldn’t prepare the contract for printing.';
		} finally {
			isDownloading = false;
		}
	}

	function handleOutsidePointerDown(event: PointerEvent) {
		if (!activePanel) return;
		const isInsideUtilityUi = event.composedPath().some(
			(node) =>
				node instanceof HTMLElement &&
				(node.hasAttribute('data-utility-panel') ||
					node.hasAttribute('data-utility-trigger'))
		);

		if (!isInsideUtilityUi) closePanel(false);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!activePanel || event.key !== 'Escape') return;
		event.preventDefault();
		closePanel();
	}

	$effect(() => {
		searchSession.setTarget(searchTarget);
	});

	onMount(() => {
		const narrowViewport = window.matchMedia(UTILITY_CHROME_NARROW_QUERY);
		const handleViewportChange = () => {
			if (narrowViewport.matches) closePanel(false);
		};

		narrowViewport.addEventListener('change', handleViewportChange);
		document.addEventListener('pointerdown', handleOutsidePointerDown);
		document.addEventListener('keydown', handleKeydown);
		return () => {
			narrowViewport.removeEventListener('change', handleViewportChange);
			document.removeEventListener('pointerdown', handleOutsidePointerDown);
			document.removeEventListener('keydown', handleKeydown);
			searchSession.destroy();
		};
	});
</script>

<div
	class="pointer-events-none fixed top-[calc(var(--app-header-height)+20px)] bottom-2 left-2 z-15 hidden w-[454px] grid-cols-[64px_minmax(0,1fr)] items-start gap-3 min-[1000px]:grid"
	data-print-exclude
>
	<UtilityRail {activePanel} onPanelToggle={togglePanel} onOpenOnboarding={openOnboarding} />

	{#if activePanel === 'search'}
		<DocumentSearchPanel session={searchSession} />
	{:else if activePanel === 'download'}
		<DocumentDownloadPanel
			{canPrint}
			{isDownloading}
			errorMessage={downloadError}
			onDownload={downloadContract}
		/>
	{/if}
</div>
