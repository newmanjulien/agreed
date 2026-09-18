<script lang="ts">
	import { onMount, tick } from 'svelte';
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import SquareIconButton from '$lib/ui/SquareIconButton.svelte';
	import { DocumentSearchSession } from '$lib/contract/document/search/search-session.svelte';
	import DocumentSearchPanel from './DocumentSearchPanel.svelte';

	let {
		searchTarget,
		onOpenGuide
	}: {
		searchTarget?: HTMLDivElement;
		onOpenGuide: () => void;
	} = $props();

	const NARROW_QUERY = '(max-width: 999px)';
	const searchSession = new DocumentSearchSession();
	let searchOpen = $state(false);
	let searchButton = $state<HTMLButtonElement>();
	let root = $state<HTMLDivElement>();
	const itemClass =
		'flex flex-col items-center gap-1 text-[10.5px] leading-[1.2] text-muted';

	function toggleSearch() {
		if (searchOpen) closeSearch();
		else searchOpen = true;
	}

	function closeSearch(restoreFocus = true) {
		if (!searchOpen) return;
		searchSession.clear();
		searchOpen = false;
		if (restoreFocus) {
			void tick().then(() => searchButton?.focus({ preventScroll: true }));
		}
	}

	function openGuide() {
		closeSearch(false);
		onOpenGuide();
	}

	function handleOutsidePointerDown(event: PointerEvent) {
		if (!searchOpen || !root) return;
		const target = event.target;
		if (target instanceof Node && root.contains(target)) return;
		closeSearch(false);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!searchOpen || event.key !== 'Escape') return;
		event.preventDefault();
		closeSearch();
	}

	$effect(() => {
		searchSession.setTarget(searchTarget);
	});

	onMount(() => {
		const narrowViewport = window.matchMedia(NARROW_QUERY);
		const closeIfNarrow = () => {
			if (narrowViewport.matches) closeSearch(false);
		};

		narrowViewport.addEventListener('change', closeIfNarrow);
		document.addEventListener('pointerdown', handleOutsidePointerDown);
		document.addEventListener('keydown', handleKeydown);
		return () => {
			narrowViewport.removeEventListener('change', closeIfNarrow);
			document.removeEventListener('pointerdown', handleOutsidePointerDown);
			document.removeEventListener('keydown', handleKeydown);
			searchSession.destroy();
		};
	});
</script>

<div
	bind:this={root}
	class="pointer-events-none fixed top-[calc(var(--app-header-height)+20px)] bottom-2 left-2 z-15 hidden w-[454px] grid-cols-[64px_minmax(0,1fr)] items-start gap-3 min-[1000px]:grid"
>
	<nav class="pointer-events-auto flex w-16 flex-col items-center" aria-label="Search and guide">
		<div class="flex flex-col items-center gap-[18px]">
			<div class={itemClass}>
				<SquareIconButton
					bind:element={searchButton}
					type="button"
					aria-label="Search"
					aria-pressed={searchOpen}
					onclick={toggleSearch}
				>
					<MagnifyingGlassIcon aria-hidden="true" size={22} weight="regular" />
				</SquareIconButton>
				<span aria-hidden="true">Search</span>
			</div>

			<div class={itemClass}>
				<SquareIconButton type="button" aria-label="How Agreed works" onclick={openGuide}>
					<InfoIcon aria-hidden="true" size={22} weight="regular" />
				</SquareIconButton>
				<span aria-hidden="true">Guide</span>
			</div>
		</div>
	</nav>

	{#if searchOpen}
		<DocumentSearchPanel session={searchSession} />
	{/if}
</div>
