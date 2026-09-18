<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import ProcessingActivity from './ProcessingActivity.svelte';
	import RequestsShell from './RequestsShell.svelte';

	onMount(() => {
		void preloadData(resolve('/review'));
	});

	function handleFinished() {
		void goto(resolve('/review'));
	}
</script>

<RequestsShell class="grid place-items-center" role="status" aria-busy="true">
	<span class="sr-only">Reviewing your uploaded changes.</span>
	<ProcessingActivity onFinished={handleFinished} />
</RequestsShell>
