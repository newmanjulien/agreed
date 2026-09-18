<script lang="ts">
	import '../app.css';
	import AppHeader from '$lib/chrome/AppHeader.svelte';

	let { children } = $props();
</script>

<AppHeader />
{@render children()}
