<script lang="ts">
	import type { Snippet } from 'svelte';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import SquareIconButton from '$lib/components/ui/SquareIconButton.svelte';

	let {
		label,
		intro,
		introId,
		onDismiss,
		closeLabel = 'Close widget',
		children
	}: {
		label: string;
		intro?: string;
		introId?: string;
		onDismiss: () => void;
		closeLabel?: string;
		children: Snippet;
	} = $props();
</script>

<aside
	class="widget-frame w-full rounded-widget border border-line bg-surface p-3.5 text-ink shadow-none"
	aria-label={label}
>
	<header class="widget-frame-header" class:has-intro={intro !== undefined}>
		{#if intro !== undefined}
			<p id={introId} class="m-0 min-w-0 text-[15px] leading-[1.45] text-ink-muted">{intro}</p>
		{/if}
		<div class="widget-frame-close">
			<SquareIconButton type="button" aria-label={closeLabel} onclick={onDismiss}>
				<XIcon aria-hidden="true" size={22} weight="regular" />
			</SquareIconButton>
		</div>
	</header>

	<div class="widget-frame-body">
		{@render children()}
	</div>
</aside>

<style>
	.widget-frame-header {
		margin-bottom: 12px;
	}

	.widget-frame-header:not(.has-intro) {
		display: none;
		margin-bottom: 0;
	}

	.widget-frame-close {
		display: none;
	}
</style>
