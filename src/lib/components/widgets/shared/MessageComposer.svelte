<script lang="ts">
	import ComposerTextarea from './ComposerTextarea.svelte';
	import { canSubmitComposer } from './composer-state';

	let {
		text,
		title,
		placeholder,
		submitLabel,
		cancelLabel,
		enterBehavior,
		pending = false,
		errorMessage = '',
		onTextChange,
		onCancel,
		onSubmit
	}: {
		text: string;
		title: string;
		placeholder: string;
		submitLabel: string;
		cancelLabel?: string;
		enterBehavior: 'submit' | 'newline';
		pending?: boolean;
		errorMessage?: string;
		onTextChange: (text: string) => void;
		onCancel?: () => void;
		onSubmit: () => void;
	} = $props();

	let canSubmit = $derived(canSubmitComposer(text, pending));
</script>

<ComposerTextarea
	{text}
	{title}
	{placeholder}
	{enterBehavior}
	{pending}
	{errorMessage}
	{onTextChange}
	{onCancel}
	{onSubmit}
/>
<div class="mt-3 flex justify-end gap-2">
	{#if cancelLabel && onCancel}
		<button
			class="h-10 cursor-pointer rounded-control border border-transparent bg-transparent px-3.5 text-[15px] font-medium text-ink-muted hover:bg-hover-subtle hover:text-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-line-strong disabled:cursor-default disabled:text-disabled"
			type="button"
			disabled={pending}
			onclick={onCancel}
		>
			{cancelLabel}
		</button>
	{/if}
	<button
		class="h-10 cursor-pointer rounded-control border border-line bg-surface px-3.5 text-[15px] font-medium text-ink-secondary hover:bg-hover-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-line-strong disabled:cursor-default disabled:bg-canvas disabled:text-disabled"
		type="button"
		disabled={!canSubmit}
		onclick={onSubmit}
	>
		{submitLabel}
	</button>
</div>
