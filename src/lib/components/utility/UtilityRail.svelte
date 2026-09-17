<script lang="ts">
	import DownloadSimpleIcon from 'phosphor-svelte/lib/DownloadSimpleIcon';
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import SquareIconButton from '$lib/components/ui/SquareIconButton.svelte';
	import type { UtilityPanelId } from './types';

	let {
		activePanel,
		onPanelToggle,
		onOpenOnboarding
	}: {
		activePanel: UtilityPanelId | null;
		onPanelToggle: (panel: UtilityPanelId, trigger: HTMLButtonElement) => void;
		onOpenOnboarding: () => void;
	} = $props();

	let searchButton = $state<HTMLButtonElement>();
	let downloadButton = $state<HTMLButtonElement>();
	const itemClass =
		'flex flex-col items-center gap-1 text-[11px] leading-[1.2] text-ink-secondary';
</script>

<nav
	class="pointer-events-auto flex w-16 flex-col items-center"
	aria-label="Document tools"
>
	<div class="flex flex-col items-center gap-[18px]">
		<div class={itemClass}>
			<SquareIconButton
				bind:element={searchButton}
				type="button"
				aria-label="Search"
				aria-pressed={activePanel === 'search'}
				data-utility-trigger="search"
				onclick={() => searchButton && onPanelToggle('search', searchButton)}
			>
				<MagnifyingGlassIcon aria-hidden="true" size={22} weight="regular" />
			</SquareIconButton>
			<span aria-hidden="true">Search</span>
		</div>

		<div class={itemClass}>
			<SquareIconButton
				bind:element={downloadButton}
				type="button"
				aria-label="Download"
				aria-pressed={activePanel === 'download'}
				data-utility-trigger="download"
				onclick={() => downloadButton && onPanelToggle('download', downloadButton)}
			>
				<DownloadSimpleIcon aria-hidden="true" size={22} weight="regular" />
			</SquareIconButton>
			<span aria-hidden="true">Download</span>
		</div>

		<div class={itemClass}>
			<SquareIconButton
				type="button"
				aria-label="How Agreed works"
				onclick={onOpenOnboarding}
			>
				<InfoIcon aria-hidden="true" size={22} weight="regular" />
			</SquareIconButton>
			<span aria-hidden="true">Guide</span>
		</div>
	</div>
</nav>
