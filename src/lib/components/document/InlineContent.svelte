<script lang="ts">
	import type { InlineToken } from '$lib/document/pagination/types';
	import RevisionText from './RevisionText.svelte';

	interface InlineSegment {
		clauseId?: string;
		clauseFragmentKey?: string;
		tokens: InlineToken[];
	}

	let {
		tokens,
		blockFragmentKey,
		selectedClauseId,
		onClauseSelect
	}: {
		tokens: InlineToken[];
		blockFragmentKey: string;
		selectedClauseId: string | null;
		onClauseSelect: (clauseId: string, clauseFragmentKey: string) => void;
	} = $props();

	function segmentTokensByClause(items: InlineToken[], keyBase: string): InlineSegment[] {
		const segments: InlineSegment[] = [];

		for (const token of items) {
			const previous = segments.at(-1);
			if (previous && previous.clauseId === token.clauseId) {
				previous.tokens.push(token);
				continue;
			}

			const segmentIndex = segments.length;
			segments.push({
				...(token.clauseId
					? {
							clauseId: token.clauseId,
							clauseFragmentKey: `${keyBase}:clause-${segmentIndex}`
						}
					: {}),
				tokens: [token]
			});
		}

		return segments;
	}

	function handleKeydown(event: KeyboardEvent, clauseId: string, clauseFragmentKey: string) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		onClauseSelect(clauseId, clauseFragmentKey);
	}

	function handleClick(clauseId: string, clauseFragmentKey: string) {
		const selection = window.getSelection();
		if (selection && !selection.isCollapsed) return;
		onClauseSelect(clauseId, clauseFragmentKey);
	}

	let segments = $derived(segmentTokensByClause(tokens, blockFragmentKey));
</script>

{#each segments as segment}
	{#if segment.clauseId && segment.clauseFragmentKey}
		<span
			class="contract-clause"
			role="button"
			tabindex="0"
			aria-pressed={selectedClauseId === segment.clauseId}
			data-clause-id={segment.clauseId}
			data-clause-fragment-key={segment.clauseFragmentKey}
			onclick={() => handleClick(segment.clauseId!, segment.clauseFragmentKey!)}
			onkeydown={(event) =>
				handleKeydown(event, segment.clauseId!, segment.clauseFragmentKey!)}
		>
			<RevisionText tokens={segment.tokens} />
		</span>
	{:else}
		<RevisionText tokens={segment.tokens} />
	{/if}
{/each}
