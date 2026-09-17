<script lang="ts">
	import type { Snippet } from 'svelte';

	interface UtilityPanelSurfaceProps {
		title: string;
		panelId: string;
		children: Snippet;
	}

	let { title, panelId, children }: UtilityPanelSurfaceProps = $props();
</script>

<section
	class="pointer-events-auto w-full rounded-widget border border-line bg-surface p-2.5 text-ink shadow-none"
	aria-label={title}
	data-utility-panel={panelId}
>
	{@render children()}
</section>
