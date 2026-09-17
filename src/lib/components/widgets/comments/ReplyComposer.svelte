<script lang="ts">
	import ComposerTextarea from '../shared/ComposerTextarea.svelte';
	import { canSubmitComposer } from '../shared/composer-state';

	let {
		id,
		text,
		onTextChange,
		onCancel,
		onSubmit
	}: {
		id: string;
		text: string;
		onTextChange: (text: string) => void;
		onCancel: () => void;
		onSubmit: () => void;
	} = $props();

	let rootElement = $state<HTMLDivElement>();
	let hasFocus = $state(false);
	let canSubmit = $derived(canSubmitComposer(text));

	function handleFocusIn() {
		hasFocus = true;
	}

	function handleFocusOut(event: FocusEvent) {
		if (!rootElement?.contains(event.relatedTarget as Node | null)) hasFocus = false;
	}
</script>

<div bind:this={rootElement} onfocusin={handleFocusIn} onfocusout={handleFocusOut}>
	<ComposerTextarea
		{id}
		{text}
		title="Write a reply"
		placeholder="Reply…"
		enterBehavior="submit"
		{onTextChange}
		{onCancel}
		{onSubmit}
	/>
	{#if hasFocus}
		<div class="mt-3 flex justify-end">
			<button
				class="h-10 cursor-pointer rounded-control border border-line bg-surface px-3.5 text-[15px] font-medium text-ink-secondary hover:bg-hover-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-line-strong disabled:cursor-default disabled:bg-canvas disabled:text-disabled"
				type="button"
				disabled={!canSubmit}
				onclick={onSubmit}
			>
				Reply
			</button>
		</div>
	{/if}
</div>
