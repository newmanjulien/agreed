<script lang="ts">
	import type { ContractSourceIssue } from '$lib/contract/source-result';

	let {
		kind,
		issues
	}: {
		kind: 'source' | 'internal';
		issues: readonly ContractSourceIssue[];
	} = $props();
	const issueLimit = 20;
	let visibleIssues = $derived(issues.slice(0, issueLimit));
	let hiddenIssueCount = $derived(Math.max(0, issues.length - issueLimit));
</script>

<main
	class="flex min-h-screen items-center justify-center bg-canvas px-5 py-12 text-ink"
	aria-label="Contract source error"
>
	<section class="w-full max-w-[680px] rounded-panel border border-line bg-surface p-6" role="alert">
		<h1 class="m-0 text-xl font-semibold">
			{kind === 'internal' ? 'We couldn’t prepare this contract' : 'The contract needs attention'}
		</h1>
		<p class="mt-2 mb-0 text-sm leading-[1.5] text-ink-muted">
			{kind === 'internal'
				? 'Check the development server for the underlying error.'
				: 'Correct the contract source and reload the application.'}
		</p>
		<ul class="mt-5 mb-0 space-y-2 pl-5 text-sm leading-[1.5]">
			{#each visibleIssues as issue}
				<li>
					<span class="font-medium">
						{issue.line && issue.column
							? `Line ${issue.line}, column ${issue.column}:`
							: 'Document:'}
					</span>
					{issue.message}
				</li>
			{/each}
			{#if hiddenIssueCount}
				<li>{hiddenIssueCount} additional issue{hiddenIssueCount === 1 ? '' : 's'} not shown.</li>
			{/if}
		</ul>
	</section>
</main>
