<script lang="ts">
	import type {
		DiscussionComposerState,
		DiscussionRoot,
		DiscussionTarget,
		DiscussionThreadAction
	} from '$lib/review/discussion-types';
	import MessageByline from '../shared/MessageByline.svelte';
	import MessageComposer from '../shared/MessageComposer.svelte';
	import ReplyComposer from './ReplyComposer.svelte';
	import WidgetActionsMenu from '../shared/WidgetActionsMenu.svelte';

	let { root, target, composer, onAction }: {
		root: DiscussionRoot;
		target: DiscussionTarget;
		composer: DiscussionComposerState | null;
		onAction: (action: DiscussionThreadAction) => void;
	} = $props();

	let replyFieldId = $derived(`discussion-reply-${encodeURIComponent(target.id)}`);
	function activate() {
		onAction({ type: 'activate' });
	}
</script>

<div
	class="comment-thread-widget w-full overflow-visible rounded-widget border border-line bg-surface text-ink shadow-none"
	class:is-active={composer !== null}
	data-widget
>
	<div class="discussion-segment relative">
		{#if composer?.mode === 'edit-root'}
			<div class="discussion-segment-surface p-3.5">
				<div class="mb-2.5">
					<MessageByline />
				</div>
				<MessageComposer
					text={composer.text}
					title="Edit message"
					placeholder="Write a message…"
					submitLabel="Update"
					cancelLabel="Cancel"
					enterBehavior="newline"
					onTextChange={(text) => onAction({ type: 'text-change', text })}
					onCancel={() => onAction({ type: 'cancel' })}
					onSubmit={() => onAction({ type: 'submit' })}
				/>
			</div>
		{:else}
			<button
				class="discussion-segment-surface w-full cursor-pointer appearance-none border-0 bg-transparent p-3.5 pr-11 text-left text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
				type="button"
				aria-controls={replyFieldId}
				aria-expanded={composer?.mode === 'reply'}
				onclick={activate}
			>
				<span class="sr-only">Show reply field. </span>
				<MessageByline />
				<p class="discussion-message-text mt-2.5 mb-0 whitespace-pre-wrap text-[15px] leading-[1.5] text-ink-secondary">
					{root.text}
				</p>
			</button>
			<WidgetActionsMenu
				label="Message"
				rootClass="comment-action-menu absolute top-2 right-2 z-10"
				onEdit={() => onAction({ type: 'edit-root' })}
				onDelete={() => onAction({ type: 'delete-root' })}
			/>
		{/if}
	</div>

	{#each root.replies as reply (reply.id)}
		<div class="discussion-segment relative">
			{#if composer?.mode === 'edit-reply' && composer.replyId === reply.id}
				<div class="discussion-segment-surface p-3.5 pl-5">
					<div class="mb-2.5">
						<MessageByline />
					</div>
					<MessageComposer
						text={composer.text}
						title="Edit reply"
						placeholder="Write a reply…"
						submitLabel="Update"
						cancelLabel="Cancel"
						enterBehavior="newline"
						onTextChange={(text) => onAction({ type: 'text-change', text })}
						onCancel={() => onAction({ type: 'cancel' })}
						onSubmit={() => onAction({ type: 'submit' })}
					/>
				</div>
			{:else}
				<button
					class="discussion-segment-surface w-full cursor-pointer appearance-none border-0 bg-transparent p-3.5 pr-11 pl-5 text-left text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
					type="button"
					aria-controls={replyFieldId}
					aria-expanded={composer?.mode === 'reply'}
					onclick={activate}
				>
					<span class="sr-only">Show reply field. </span>
					<MessageByline />
					<p class="discussion-message-text mt-2.5 mb-0 whitespace-pre-wrap text-[15px] leading-[1.5] text-ink-secondary">
						{reply.text}
					</p>
				</button>
				<WidgetActionsMenu
					label="Reply"
					rootClass="comment-action-menu absolute top-2 right-2 z-10"
					onEdit={() => onAction({ type: 'edit-reply', reply })}
					onDelete={() => onAction({ type: 'delete-reply', replyId: reply.id })}
				/>
			{/if}
		</div>
	{/each}

	{#if composer?.mode === 'reply'}
		<div class="discussion-segment">
			<div class="discussion-segment-surface p-3.5">
				<ReplyComposer
					id={replyFieldId}
					text={composer.text}
					onTextChange={(text) => onAction({ type: 'text-change', text })}
					onCancel={() => onAction({ type: 'cancel' })}
					onSubmit={() => onAction({ type: 'submit' })}
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.discussion-segment {
		border-radius: 0;
	}

	.discussion-segment:first-child {
		border-top-left-radius: inherit;
		border-top-right-radius: inherit;
	}

	.discussion-segment:last-child {
		border-bottom-right-radius: inherit;
		border-bottom-left-radius: inherit;
	}

	.discussion-segment-surface {
		border-radius: inherit;
	}

	.discussion-message-text {
		overflow-wrap: anywhere;
	}

	:global(.comment-action-menu) {
		opacity: 0;
		pointer-events: none;
		transition: opacity 120ms ease;
	}

	.comment-thread-widget:hover :global(.comment-action-menu),
	.comment-thread-widget:focus-within :global(.comment-action-menu),
	.comment-thread-widget.is-active :global(.comment-action-menu) {
		opacity: 1;
		pointer-events: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.comment-action-menu) {
			transition: none;
		}
	}
</style>
