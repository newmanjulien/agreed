<script lang="ts">
	import type { CommentSession } from '$lib/review/comment-session.svelte';
	import type { ProposalDraftSession } from '$lib/review/proposal-draft-session.svelte';
	import type { DiscussionSession } from '$lib/review/discussion-session.svelte';
	import ChangesWidget from './changes/ChangesWidget.svelte';
	import FaqWidget from './faq/FaqWidget.svelte';
	import ProposalLogWidget from './proposals/ProposalLogWidget.svelte';
	import ProposalComposerWidget from './proposals/ProposalComposerWidget.svelte';
	import AnnotationRail from './annotations/AnnotationRail.svelte';
	import WidgetHelpText from './shared/WidgetHelpText.svelte';
	import type { WidgetCommands } from './widget-commands';
	import type { WidgetView } from './widget-view';

	let {
		view,
		onboardingHint,
		comments,
		proposals,
		discussion,
		documentStageElement,
		commands,
		element = $bindable(),
		bottom = $bindable(0)
	}: {
		view: WidgetView;
		onboardingHint?: string;
		comments: CommentSession;
		proposals: ProposalDraftSession;
		discussion: DiscussionSession;
		documentStageElement?: HTMLElement;
		commands: WidgetCommands;
		element?: HTMLElement;
		bottom?: number;
	} = $props();

	function assertUnreachable(value: never): null {
		throw new Error(`Unhandled widget view: ${JSON.stringify(value)}`);
	}
</script>

{#if view.kind === 'changes'}
	{#key view.clauseId}
		<div class="widget-region" data-widget bind:this={element}>
			<ChangesWidget
				clauseId={view.clauseId}
				title={view.title}
				definition={view.definition}
				value={view.value}
				onDismiss={commands.dismiss}
				onChange={(value) =>
					commands.updateControl(view.clauseId, view.definition.control.id, value)}
				onCustomSelect={(optionValue) =>
					commands.startClauseProposal(view.clauseId, optionValue)}
			/>
			{#if onboardingHint}
				<WidgetHelpText text={onboardingHint} />
			{/if}
		</div>
	{/key}
{:else if view.kind === 'faq'}
	{#key view.clauseId}
		<div class="widget-region" data-widget bind:this={element}>
			<FaqWidget
				clauseId={view.clauseId}
				title={view.title}
				definition={view.definition}
				onDismiss={commands.dismiss}
				onClauseReference={commands.navigateToClause}
			/>
			{#if onboardingHint}
				<WidgetHelpText text={onboardingHint} />
			{/if}
		</div>
	{/key}

{:else if view.kind === 'proposal-composer'}
	{#key `${view.target.clauseId}:${view.target.optionValue}`}
		<div class="widget-region" data-widget bind:this={element}>
			<ProposalComposerWidget
				target={view.target}
				onDismiss={commands.cancelProposal}
				onSubmit={commands.submitProposal}
			/>
			{#if onboardingHint}
				<WidgetHelpText text={onboardingHint} />
			{/if}
		</div>
	{/key}
{:else if view.kind === 'proposal-log'}
	{#key view.proposal.id}
		<div class="widget-region" data-widget bind:this={element}>
			<ProposalLogWidget
				proposal={view.proposal}
				onDismiss={commands.dismiss}
				onEdit={commands.editProposal}
				onDelete={commands.deleteProposal}
			/>
		</div>
	{/key}

{:else if view.kind === 'annotations'}
	<AnnotationRail
		{comments}
		{proposals}
		{discussion}
		{documentStageElement}
		creationHint={onboardingHint}
		onCancelComment={commands.cancelCommentDraft}
		onSubmitComment={commands.submitCommentDraft}
		onCancelProposal={commands.cancelProposal}
		onSubmitProposal={commands.submitProposal}
		onDiscussionAction={commands.handleDiscussionAction}
		bind:bottom
	/>
{:else}
	{assertUnreachable(view)}
{/if}
