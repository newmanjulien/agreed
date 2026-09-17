<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { autosizeTextarea } from './textarea-autosize';
	import { canSubmitComposer } from './composer-state';

	let {
		id,
		text,
		title,
		placeholder,
		enterBehavior,
		pending = false,
		errorMessage = '',
		onTextChange,
		onCancel,
		onSubmit
	}: {
		id?: string;
		text: string;
		title: string;
		placeholder: string;
		enterBehavior: 'submit' | 'newline';
		pending?: boolean;
		errorMessage?: string;
		onTextChange: (text: string) => void;
		onCancel?: () => void;
		onSubmit: () => void;
	} = $props();

	let textareaElement = $state<HTMLTextAreaElement>();
	let canSubmit = $derived(canSubmitComposer(text, pending));

	function handleInput(event: Event & { currentTarget: HTMLTextAreaElement }) {
		onTextChange(event.currentTarget.value);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && onCancel) {
			event.preventDefault();
			event.stopPropagation();
			onCancel();
			return;
		}

		const shouldSubmit =
			event.key === 'Enter' &&
			!event.isComposing &&
			(enterBehavior === 'submit' ? !event.shiftKey : event.metaKey || event.ctrlKey);

		if (shouldSubmit) {
			event.preventDefault();
			if (canSubmit) onSubmit();
		}
	}

	onMount(() => {
		let cancelled = false;
		let focusFrame: number | undefined;
		void tick().then(() => {
			if (cancelled) return;
			focusFrame = requestAnimationFrame(() => {
				if (!cancelled) textareaElement?.focus({ preventScroll: true });
			});
		});

		return () => {
			cancelled = true;
			if (focusFrame !== undefined) cancelAnimationFrame(focusFrame);
		};
	});
</script>

<textarea
	{id}
	class="block min-h-10 w-full resize-none appearance-none overflow-y-hidden rounded-field border border-line/[58%] bg-surface px-3 py-2 text-[15px] leading-[1.45] text-ink shadow-none placeholder:text-ink-muted focus:border-accent focus:outline-2 focus:outline-offset-1 focus:outline-accent/18 disabled:cursor-wait"
	rows="1"
	value={text}
	use:autosizeTextarea={{ value: text, maxHeight: 160 }}
	{placeholder}
	aria-label={title}
	disabled={pending}
	bind:this={textareaElement}
	oninput={handleInput}
	onkeydown={handleKeydown}
></textarea>

{#if errorMessage}
	<p class="mt-2 mb-0 text-xs leading-[1.35] text-danger" role="alert">{errorMessage}</p>
{/if}
