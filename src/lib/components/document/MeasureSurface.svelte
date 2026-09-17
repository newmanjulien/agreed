<script lang="ts">
	import { PAGE_FORMAT } from '$lib/document/pagination/page-format';

	let { element = $bindable() }: { element?: HTMLDivElement } = $props();
</script>

<div
	class="measurement-surface contract-document contract-flow"
	aria-hidden="true"
	inert
	data-print-exclude
	bind:this={element}
	style:--contract-content-width={`${PAGE_FORMAT.contentWidth}px`}
></div>
