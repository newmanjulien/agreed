<script lang="ts">
	import type { Snippet } from 'svelte';
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';

	let {
		label,
		children
	}: {
		label?: string;
		children?: Snippet;
	} = $props();
</script>

<aside
	class="flex w-full items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-[14px] leading-[1.45] text-muted"
	role="note"
>
	<span class="shrink-0 text-muted" aria-hidden="true">
		<InfoIcon size={20} weight="regular" />
	</span>

	<p class="min-w-0">
		{#if label}
			<span class="font-semibold">{label}</span>
		{/if}
		{#if children}
			<span class={label ? 'ml-1' : undefined}>
				{@render children()}
			</span>
		{/if}
	</p>
</aside>
