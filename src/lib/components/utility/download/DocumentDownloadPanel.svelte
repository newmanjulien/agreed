<script lang="ts">
	import { onMount } from 'svelte';
	import UtilityPanelSurface from '../UtilityPanelSurface.svelte';
	import type { DownloadFormat } from '../types';

	let {
		canPrint,
		isDownloading,
		errorMessage,
		onDownload
	}: {
		canPrint: boolean;
		isDownloading: boolean;
		errorMessage: string;
		onDownload: (format: DownloadFormat) => Promise<void>;
	} = $props();
	let firstOption = $state<HTMLButtonElement>();
	const optionClass =
		'cursor-pointer rounded-panel border-0 bg-canvas px-3 py-2.5 text-left text-[15px] leading-[1.3] text-ink hover:bg-hover-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent disabled:cursor-default disabled:text-disabled disabled:hover:bg-canvas';

	onMount(() => {
		firstOption?.focus();
	});
</script>

<UtilityPanelSurface
	title="Download"
	panelId="download"
>
	<div class="flex flex-col gap-2" aria-label="Download formats" aria-busy={isDownloading}>
		<button
			bind:this={firstOption}
			class={optionClass}
			type="button"
			disabled={isDownloading}
			onclick={() => void onDownload('word')}
		>
			Download Word
		</button>
		<button
			class={optionClass}
			type="button"
			disabled={isDownloading || !canPrint}
			onclick={() => void onDownload('pdf')}
		>
			Download PDF
		</button>
	</div>
	{#if errorMessage}
		<p class="mt-2 mb-0 text-sm leading-[1.4] text-danger" role="alert">
			{errorMessage}
		</p>
	{/if}
</UtilityPanelSurface>
