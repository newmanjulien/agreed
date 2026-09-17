import type {
	DiscussionComposerState,
	DiscussionReply,
	DiscussionTarget
} from './discussion-types.ts';
import { discussionTargetsEqual } from './discussion-types.ts';

export class DiscussionSession {
	composer = $state<DiscussionComposerState | null>(null);

	startReply(target: DiscussionTarget): void {
		this.composer = { mode: 'reply', target, text: '' };
	}

	startRootEdit(target: DiscussionTarget, message: { text: string }): void {
		this.composer = { mode: 'edit-root', target, text: message.text };
	}

	startReplyEdit(target: DiscussionTarget, reply: DiscussionReply): void {
		this.composer = {
			mode: 'edit-reply',
			target,
			replyId: reply.id,
			text: reply.text
		};
	}

	updateText(text: string): void {
		if (this.composer) this.composer.text = text;
	}

	cancel(): void {
		this.composer = null;
	}

	cancelTarget(target: DiscussionTarget): boolean {
		if (!this.composer || !discussionTargetsEqual(this.composer.target, target)) {
			return false;
		}
		this.composer = null;
		return true;
	}

	cancelReplyEdit(target: DiscussionTarget, replyId: string): boolean {
		const composer = this.composer;
		if (
			composer?.mode !== 'edit-reply' ||
			composer.replyId !== replyId ||
			!discussionTargetsEqual(composer.target, target)
		) {
			return false;
		}
		this.composer = null;
		return true;
	}

	isActive(target: DiscussionTarget): boolean {
		return Boolean(
			this.composer && discussionTargetsEqual(this.composer.target, target)
		);
	}
}
