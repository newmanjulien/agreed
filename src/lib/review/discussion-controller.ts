import type { DiscussionSession } from './discussion-session.svelte.ts';
import type {
	DiscussionTarget,
	DiscussionThreadAction
} from './discussion-types.ts';
import type { CommentSession } from './comment-session.svelte.ts';
import type { CommentEditResult } from './comment-types.ts';

interface DiscussionControllerHooks {
	activate: (target: DiscussionTarget, startComposer: () => void) => void;
	onClosed: (target: DiscussionTarget) => void;
}

export class DiscussionController {
	constructor(
		private readonly comments: CommentSession,
		private readonly discussion: DiscussionSession,
		private readonly hooks: DiscussionControllerHooks
	) {}

	activate(target: DiscussionTarget): void {
		this.hooks.activate(target, () => this.discussion.startReply(target));
	}

	handleAction(target: DiscussionTarget, action: DiscussionThreadAction): void {
		switch (action.type) {
			case 'activate':
				this.activate(target);
				break;
			case 'edit-root':
				this.editRoot(target);
				break;
			case 'delete-root':
				this.deleteRoot(target);
				break;
			case 'edit-reply':
				this.hooks.activate(target, () =>
					this.discussion.startReplyEdit(target, action.reply)
				);
				break;
			case 'delete-reply':
				this.deleteReply(target, action.replyId);
				break;
			case 'text-change':
				this.discussion.updateText(action.text);
				break;
			case 'cancel':
				this.discussion.cancel();
				this.hooks.onClosed(target);
				break;
			case 'submit':
				this.submit();
				break;
		}
	}

	private editRoot(target: DiscussionTarget): void {
		const message = this.comments.comments.find((comment) => comment.id === target.id);
		if (message) {
			this.hooks.activate(target, () => this.discussion.startRootEdit(target, message));
		}
	}

	private deleteReply(target: DiscussionTarget, replyId: string): void {
		if (!this.comments.deleteReply(target.id, replyId)) return;
		if (this.discussion.cancelReplyEdit(target, replyId)) this.hooks.onClosed(target);
	}

	private deleteRoot(target: DiscussionTarget): void {
		if (!this.comments.deleteComment(target.id)) return;
		this.discussion.cancelTarget(target);
		this.hooks.onClosed(target);
	}

	private submit(): void {
		const composer = this.discussion.composer;
		const text = composer?.text.trim();
		if (!composer || !text) return;

		let result: CommentEditResult;
		switch (composer.mode) {
			case 'reply':
				result = this.comments.addReply(composer.target.id, text)
					? 'changed'
					: 'invalid';
				break;
			case 'edit-root':
				result = this.comments.editComment(composer.target.id, text);
				break;
			case 'edit-reply':
				result = this.comments.editReply(
					composer.target.id,
					composer.replyId,
					text
				);
				break;
		}

		if (result === 'invalid') return;
		this.discussion.cancelTarget(composer.target);
		this.hooks.onClosed(composer.target);
	}
}
