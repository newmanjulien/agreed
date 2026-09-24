<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { DocumentSearchSession } from '$lib/document/search/search-session.svelte';
	import UtilityRail from './UtilityRail.svelte';
	import DocumentSearchPanel from '$lib/components/search/DocumentSearchPanel.svelte';

	let { searchTarget, onOpenOnboarding }: {
		searchTarget?: HTMLDivElement;
		onOpenOnboarding: () => void;
	} = $props();
	const searchSession = new DocumentSearchSession();
	let searchOpen = $state(false);
	let searchButton: HTMLButtonElement | undefined;

	function closeSearch(restoreFocus = true) {
		if (!searchOpen) return;
		searchOpen = false;
		searchSession.clear();
		if (restoreFocus) void tick().then(() => searchButton?.focus({ preventScroll: true }));
	}

	function toggleSearch(trigger: HTMLButtonElement) {
		if (searchOpen) { closeSearch(); return; }
		searchButton = trigger;
		searchOpen = true;
	}

	function openGuide() {
		closeSearch(false);
		onOpenOnboarding();
	}

	function handleOutsidePointerDown(event: PointerEvent) {
		if (!searchOpen) return;
		const inside = event.composedPath().some((node) =>
			node instanceof HTMLElement &&
			(node.hasAttribute('data-utility-panel') || node.hasAttribute('data-utility-trigger'))
		);
		if (!inside) closeSearch(false);
	}

	function focusSearchInput() {
		void tick().then(() =>
			document.querySelector<HTMLInputElement>('[data-search-input]')?.focus({ preventScroll: true })
		);
	}

	function handleKeydown(event: KeyboardEvent) {
		const isFindShortcut =
			(event.metaKey || event.ctrlKey) &&
			!event.altKey &&
			!event.shiftKey &&
			event.key.toLowerCase() === 'f';

		if (isFindShortcut) {
			event.preventDefault();
			if (!searchOpen) {
				searchButton =
					document.querySelector<HTMLButtonElement>('[data-utility-trigger="search"]') ??
					searchButton;
				searchOpen = true;
			}
			focusSearchInput();
			return;
		}

		if (!searchOpen || event.key !== 'Escape') return;
		event.preventDefault();
		closeSearch();
	}

	$effect(() => searchSession.setTarget(searchTarget));

	onMount(() => {
		document.addEventListener('pointerdown', handleOutsidePointerDown);
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('pointerdown', handleOutsidePointerDown);
			document.removeEventListener('keydown', handleKeydown);
			searchSession.destroy();
		};
	});
</script>

<header class="sticky top-0 z-20 flex h-[var(--app-header-height)] items-center border-b border-line bg-surface/96 px-[18px] backdrop-blur-[12px] max-[650px]:px-3">
	<p class="m-0 truncate text-sm text-ink-secondary">Understand, negotiate and close contracts (beta)</p>
</header>

<div class="pointer-events-none fixed top-[calc(var(--app-header-height)+20px)] bottom-2 left-2 z-15 grid w-[454px] grid-cols-[64px_minmax(0,1fr)] items-start gap-3 max-[999px]:top-[var(--app-header-height)] max-[999px]:right-0 max-[999px]:bottom-auto max-[999px]:left-0 max-[999px]:w-full max-[999px]:grid-cols-1 max-[999px]:gap-0">
	<UtilityRail {searchOpen} onSearchToggle={toggleSearch} onOpenOnboarding={openGuide} />
	{#if searchOpen}
		<div class="max-[999px]:p-2"><DocumentSearchPanel session={searchSession} /></div>
	{/if}
</div>
