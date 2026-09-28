<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import SquareIconButton from '$lib/ui/SquareIconButton.svelte';

	let {
		title,
		onClose,
		placement = 'center',
		children,
		footer
	}: {
		title: string;
		onClose: () => void;
		placement?: 'center' | 'right';
		children?: Snippet;
		footer?: Snippet;
	} = $props();

	let dialogElement = $state<HTMLDialogElement>();
	const titleId = $props.id();

	onMount(() => {
		if (!dialogElement) throw new Error('Modal dialog failed to mount.');
		dialogElement.showModal();
		dialogElement.focus({ preventScroll: true });
	});

	function closeModal() {
		if (dialogElement?.open) dialogElement.close();
		onClose();
	}

	function handleCancel(event: Event) {
		event.preventDefault();
		closeModal();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === dialogElement) closeModal();
	}
</script>

<dialog
	bind:this={dialogElement}
	class={[
		'fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-4 text-ink outline-none max-[600px]:p-0',
		placement === 'right' ? 'backdrop:bg-transparent' : 'backdrop:bg-canvas/70'
	]}
	aria-labelledby={titleId}
	tabindex="-1"
	oncancel={handleCancel}
	onclick={handleBackdropClick}
>
	<div
		class={[
			'relative flex h-full min-h-0 w-full max-w-[456px] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[0_8px_24px_rgba(32,33,36,0.10)] max-[600px]:rounded-none max-[600px]:border-0',
			placement === 'right' ? 'ml-auto' : 'mx-auto'
		]}
	>
		<div class="absolute top-4 right-4 z-10">
			<SquareIconButton type="button" aria-label="Close modal" onclick={closeModal}>
				<XIcon aria-hidden="true" size={22} weight="regular" />
			</SquareIconButton>
		</div>

		<header class="min-w-0 px-4 py-4 pr-14">
			<h2 id={titleId} class="text-[17.5px] leading-tight font-medium text-ink">{title}</h2>
		</header>

		{#if children}
			<div class="min-h-0 flex-1 overflow-y-auto px-4" class:pb-4={!footer}>
				{@render children()}
			</div>
		{/if}

		{#if footer}
			<div class="shrink-0 px-4 pt-2 pb-4">
				{@render footer()}
			</div>
		{/if}
	</div>
</dialog>
