<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		class: className,
		...rest
	}: HTMLAttributes<HTMLElement> & { children: Snippet } = $props();
</script>

<main
	class={['min-h-[calc(100dvh-var(--app-header-height))] bg-surface px-(--app-gutter)', className]}
	{...rest}
>
	{@render children()}
</main>
