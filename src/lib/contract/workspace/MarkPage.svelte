<script lang="ts">
	let {
		kind,
		onBack
	}: {
		kind: 'flexible' | 'fixed';
		onBack: () => void;
	} = $props();

	const titles = {
		flexible: 'Mark flexible',
		fixed: 'Mark fixed'
	} as const;
</script>

<svelte:head>
	<title>{titles[kind]} | Agreed</title>
</svelte:head>

<main class="px-(--app-gutter) pt-6 pb-12" aria-label={titles[kind]}>
	<div class="mx-auto w-full max-w-[720px]">
		<button
			type="button"
			class="inline-flex items-center text-[14px] leading-none text-muted transition-colors hover:text-ink"
			onclick={onBack}
		>
			Back
		</button>
	</div>
</main>
