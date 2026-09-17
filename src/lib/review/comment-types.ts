import type { TextAnchor } from '../document/anchors/types.ts';
import type { DiscussionMessage } from './discussion-types.ts';

export interface DocumentComment extends DiscussionMessage {
	anchor: TextAnchor;
}

export interface CommentDraft {
	anchor: TextAnchor;
	text: string;
}

export type CommentEditResult = 'changed' | 'unchanged' | 'invalid';
