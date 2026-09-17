<script lang="ts">
	import type { InlineToken } from '$lib/document/pagination/types';
	import type { ClauseRegistry } from '$lib/contract/model';
	import type { RevisionState } from '$lib/contract/resolve';
	import ClauseReferenceMarker from './ClauseReferenceMarker.svelte';

	interface InlineSegment {
		clauseId?: string;
		proposalId?: string;
		revisionState?: RevisionState;
		clauseFragmentKey?: string;
		proposalFragmentKey?: string;
		isClauseStart?: boolean;
		tokens: InlineToken[];
	}

	let {
		tokens,
		blockFragmentKey,
		clauses,
		selectedClauseId,
		selectedProposalId,
		referencedClauseId,
		onClauseSelect,
		onProposalSelect
	}: {
		tokens: InlineToken[];
		blockFragmentKey: string;
		clauses: ClauseRegistry;
		selectedClauseId: string | null;
		selectedProposalId: string | null;
		referencedClauseId: string | null;
		onClauseSelect: (clauseId: string, clauseFragmentKey: string) => void;
		onProposalSelect: (proposalId: string, proposalFragmentKey: string) => void;
	} = $props();

	function segmentTokens(items: InlineToken[], keyBase: string): InlineSegment[] {
		const segments: InlineSegment[] = [];

		for (const token of items) {
			const previous = segments.at(-1);
			if (
				previous &&
				previous.clauseId === token.clauseId &&
				previous.proposalId === token.proposalId &&
				previous.revisionState === token.revisionState
			) {
				previous.tokens.push(token);
				continue;
			}

			const segmentIndex = segments.length;
			segments.push({
				...(token.clauseId
					? {
							clauseId: token.clauseId,
							clauseFragmentKey: `${keyBase}:clause-${segmentIndex}`,
							isClauseStart: token.isClauseStart
						}
					: {}),
				...(token.revisionState ? { revisionState: token.revisionState } : {}),
				...(token.proposalId
					? {
							proposalId: token.proposalId,
							proposalFragmentKey: `${keyBase}:proposal-${segmentIndex}`
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

	function selectProposal(proposalId: string, proposalFragmentKey: string) {
		const selection = window.getSelection();
		if (selection && !selection.isCollapsed) return;
		onProposalSelect(proposalId, proposalFragmentKey);
	}

	function handleProposalKeydown(
		event: KeyboardEvent,
		proposalId: string,
		proposalFragmentKey: string
	) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		onProposalSelect(proposalId, proposalFragmentKey);
	}

	function clauseHighlightTone(clauseId: string) {
		const clause = clauses[clauseId];
		if (!clause) throw new Error(`Missing definition for clause "${clauseId}".`);
		return clause.highlightTone;
	}

	let segments = $derived(segmentTokens(tokens, blockFragmentKey));
</script>

{#snippet renderTokens(groupTokens: InlineToken[])}
	{#each groupTokens as token}
		{#if token.marks?.bold && token.marks?.italic}
			<strong><em>{token.value}</em></strong>
		{:else if token.marks?.bold}
			<strong>{token.value}</strong>
		{:else if token.marks?.italic}
			<em>{token.value}</em>
		{:else}{token.value}{/if}
	{/each}
{/snippet}

{#each segments as segment}
	{#if segment.proposalId && segment.proposalFragmentKey}
		<span
			class="contract-proposal"
			role="button"
			tabindex="0"
			aria-pressed={selectedProposalId === segment.proposalId}
			data-proposal-id={segment.proposalId}
			data-proposal-fragment-key={segment.proposalFragmentKey}
			data-revision-state={segment.revisionState}
			onclick={() =>
				selectProposal(segment.proposalId!, segment.proposalFragmentKey!)}
			onkeydown={(event) =>
				handleProposalKeydown(
					event,
					segment.proposalId!,
					segment.proposalFragmentKey!
				)}
		>
			{@render renderTokens(segment.tokens)}
		</span>
	{:else if segment.clauseId && segment.clauseFragmentKey}
		<span
			class="contract-clause"
			class:is-clause-reference-target={referencedClauseId === segment.clauseId}
			id={segment.isClauseStart ? `clause-${segment.clauseId}` : undefined}
			role="button"
			tabindex="0"
			aria-pressed={selectedClauseId === segment.clauseId}
			data-clause-id={segment.clauseId}
			data-clause-highlight-tone={clauseHighlightTone(segment.clauseId)}
			data-clause-fragment-key={segment.clauseFragmentKey}
			data-revision-state={segment.revisionState}
			onclick={() => handleClick(segment.clauseId!, segment.clauseFragmentKey!)}
			onkeydown={(event) =>
				handleKeydown(event, segment.clauseId!, segment.clauseFragmentKey!)}
		>
			{#if referencedClauseId === segment.clauseId}
				<ClauseReferenceMarker />
			{/if}
			{@render renderTokens(segment.tokens)}
		</span>
	{:else}
		{@render renderTokens(segment.tokens)}
	{/if}
{/each}
