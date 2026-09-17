<script lang="ts">
	import '../app.css';
	import '$lib/styles/print.css';
	import AppHeader from '$lib/components/chrome/AppHeader.svelte';

	let { children } = $props();
</script>

<AppHeader />
{@render children()}
