let fallbackMessageId = 0;

export interface DiscussionReply {
	id: string;
	text: string;
}

export interface DiscussionRoot {
	text: string;
	replies: DiscussionReply[];
}

export interface DiscussionMessage extends DiscussionRoot {
	id: string;
}

export interface DiscussionTarget {
	id: string;
}

interface DiscussionComposerBase {
	target: DiscussionTarget;
	text: string;
}

export type DiscussionComposerState =
	| (DiscussionComposerBase & { mode: 'reply' })
	| (DiscussionComposerBase & { mode: 'edit-root' })
	| (DiscussionComposerBase & { mode: 'edit-reply'; replyId: string });

export type DiscussionThreadAction =
	| { type: 'activate' }
	| { type: 'edit-root' }
	| { type: 'delete-root' }
	| { type: 'edit-reply'; reply: DiscussionReply }
	| { type: 'delete-reply'; replyId: string }
	| { type: 'text-change'; text: string }
	| { type: 'cancel' }
	| { type: 'submit' };

export function discussionTargetsEqual(
	left: DiscussionTarget,
	right: DiscussionTarget
): boolean {
	return left.id === right.id;
}

export function createDiscussionMessageId(prefix: string): string {
	return globalThis.crypto?.randomUUID?.() ?? `${prefix}-${++fallbackMessageId}`;
}
