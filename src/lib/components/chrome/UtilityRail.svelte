<script lang="ts">
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import SquareIconButton from '$lib/components/ui/SquareIconButton.svelte';

	let { searchOpen, onSearchToggle, onOpenOnboarding }: {
		searchOpen: boolean;
		onSearchToggle: (trigger: HTMLButtonElement) => void;
		onOpenOnboarding: () => void;
	} = $props();
	let searchButton = $state<HTMLButtonElement>();
	const itemClass = 'flex flex-col items-center gap-1 text-[11px] leading-[1.2] text-ink-secondary';
</script>

<nav class="pointer-events-auto flex w-16 flex-col items-center max-[999px]:w-full max-[999px]:border-b max-[999px]:border-line max-[999px]:bg-surface/96 max-[999px]:px-3 max-[999px]:py-1" aria-label="Document tools">
	<div class="flex flex-col items-center gap-[18px] max-[999px]:flex-row max-[999px]:gap-4">
		<div class={itemClass}>
			<SquareIconButton bind:element={searchButton} type="button" aria-label="Search"
				aria-pressed={searchOpen} data-utility-trigger="search"
				onclick={() => searchButton && onSearchToggle(searchButton)}>
				<MagnifyingGlassIcon aria-hidden="true" size={22} weight="regular" />
			</SquareIconButton>
			<span aria-hidden="true">Search</span>
		</div>
		<div class={itemClass}>
			<SquareIconButton type="button" aria-label="How agreed works" onclick={onOpenOnboarding}>
				<InfoIcon aria-hidden="true" size={22} weight="regular" />
			</SquareIconButton>
			<span aria-hidden="true">Guide</span>
		</div>
	</div>
</nav>
