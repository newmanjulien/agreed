import { clearCustomHighlights, setCustomHighlight } from '../document/highlights/custom-highlights.ts';
import { resolveTextAnchor } from '../document/anchors/text-anchor.ts';
import type { TextAnchor } from '../document/anchors/types.ts';
import type {
	CommentDraft,
	CommentEditResult,
	DocumentComment
} from './comment-types.ts';
import { createDiscussionMessageId } from './discussion-types.ts';

const COMMENT_HIGHLIGHT = 'agreed-review-comment';
const COMMENT_HOVER_HIGHLIGHT = 'agreed-review-comment-hover';

interface ResolvedComment {
	comment: DocumentComment;
	ranges: Range[];
}

function rangeContainsPoint(range: Range, clientX: number, clientY: number): boolean {
	return Array.from(range.getClientRects()).some(
		(rectangle) =>
			clientX >= rectangle.left &&
			clientX <= rectangle.right &&
			clientY >= rectangle.top &&
			clientY <= rectangle.bottom
	);
}

function anchorLength(anchor: TextAnchor): number {
	return anchor.segments.reduce(
		(length, segment) => length + segment.end - segment.start,
		0
	);
}

export class CommentSession {
	comments = $state<DocumentComment[]>([]);
	draft = $state<CommentDraft | null>(null);
	resolvedComments = $state<ResolvedComment[]>([]);
	draftRanges = $state<Range[]>([]);

	#target: HTMLElement | undefined;
	#observer: MutationObserver | undefined;
	#refreshQueued = false;
	#hoveredCommentId: string | undefined;

	setTarget(target: HTMLElement | undefined): void {
		if (target === this.#target) return;

		this.#observer?.disconnect();
		this.#observer = undefined;
		this.#target = target;
		this.#hoveredCommentId = undefined;
		this.refresh();

		if (!target || typeof MutationObserver === 'undefined') return;
		this.#observer = new MutationObserver(() => this.#scheduleRefresh());
		this.#observer.observe(target, {
			childList: true,
			characterData: true,
			subtree: true
		});
	}

	startDraft(anchor: TextAnchor): void {
		this.draft = { anchor, text: '' };
		this.refresh();
	}

	updateDraftText(text: string): void {
		if (this.draft) this.draft.text = text;
	}

	cancelDraft(): boolean {
		if (!this.draft) return false;
		this.draft = null;
		this.draftRanges = [];
		this.#renderHighlights();
		return true;
	}

	commitDraft(): boolean {
		const draft = this.draft;
		const text = draft?.text.trim();
		if (!draft || !text) return false;

		this.comments.push({
			id: createDiscussionMessageId('comment'),
			anchor: draft.anchor,
			text,
			replies: []
		});
		this.draft = null;
		this.draftRanges = [];
		this.refresh();
		return true;
	}

	deleteComment(id: string): boolean {
		const index = this.comments.findIndex((comment) => comment.id === id);
		if (index === -1) return false;
		this.comments.splice(index, 1);
		if (this.#hoveredCommentId === id) this.#hoveredCommentId = undefined;
		this.refresh();
		return true;
	}

	editComment(id: string, text: string): CommentEditResult {
		const comment = this.comments.find((candidate) => candidate.id === id);
		const nextText = text.trim();
		if (!comment || !nextText) return 'invalid';
		if (comment.text === nextText) return 'unchanged';
		comment.text = nextText;
		return 'changed';
	}

	addReply(id: string, text: string): boolean {
		const comment = this.comments.find((candidate) => candidate.id === id);
		const replyText = text.trim();
		if (!comment || !replyText) return false;
		comment.replies.push({ id: createDiscussionMessageId('reply'), text: replyText });
		return true;
	}

	editReply(commentId: string, replyId: string, text: string): CommentEditResult {
		const reply = this.comments
			.find((comment) => comment.id === commentId)
			?.replies.find((candidate) => candidate.id === replyId);
		const nextText = text.trim();
		if (!reply || !nextText) return 'invalid';
		if (reply.text === nextText) return 'unchanged';
		reply.text = nextText;
		return 'changed';
	}

	deleteReply(commentId: string, replyId: string): boolean {
		const comment = this.comments.find((candidate) => candidate.id === commentId);
		if (!comment) return false;
		const index = comment.replies.findIndex((reply) => reply.id === replyId);
		if (index === -1) return false;
		comment.replies.splice(index, 1);
		return true;
	}

	commentIdAtPoint(clientX: number, clientY: number): string | undefined {
		let bestMatch: { id: string; length: number } | undefined;
		for (let index = this.resolvedComments.length - 1; index >= 0; index -= 1) {
			const { comment, ranges } = this.resolvedComments[index];
			if (!ranges.some((range) => rangeContainsPoint(range, clientX, clientY))) continue;
			const length = anchorLength(comment.anchor);
			if (!bestMatch || length < bestMatch.length) bestMatch = { id: comment.id, length };
		}
		return bestMatch?.id;
	}

	setHoveredComment(id: string | undefined): void {
		const nextId = id
			? this.resolvedComments.find(({ comment }) => comment.id === id)?.comment.id
			: undefined;
		if (nextId === this.#hoveredCommentId) return;
		this.#hoveredCommentId = nextId;
		this.#renderHoveredHighlight();
	}

	refresh(): void {
		const target = this.#target;
		if (!target) {
			this.resolvedComments = [];
			this.draftRanges = [];
			this.#hoveredCommentId = undefined;
			this.#clearHighlights();
			return;
		}

		const resolvedComments: ResolvedComment[] = [];
		for (const comment of this.comments) {
			const resolved = resolveTextAnchor(target, comment.anchor);
			if (!resolved) continue;
			if (resolved.anchor !== comment.anchor) comment.anchor = resolved.anchor;
			resolvedComments.push({ comment, ranges: resolved.ranges });
		}
		this.resolvedComments = resolvedComments;

		if (
			this.#hoveredCommentId &&
			!resolvedComments.some(({ comment }) => comment.id === this.#hoveredCommentId)
		) {
			this.#hoveredCommentId = undefined;
		}

		const resolvedDraft = this.draft ? resolveTextAnchor(target, this.draft.anchor) : null;
		if (this.draft && resolvedDraft && resolvedDraft.anchor !== this.draft.anchor) {
			this.draft.anchor = resolvedDraft.anchor;
		}
		this.draftRanges = resolvedDraft?.ranges ?? [];
		this.#renderHighlights();
	}

	destroy(): void {
		this.#observer?.disconnect();
		this.#observer = undefined;
		this.#target = undefined;
		this.#hoveredCommentId = undefined;
		this.resolvedComments = [];
		this.draftRanges = [];
		this.draft = null;
		this.#clearHighlights();
	}

	#clearHighlights(): void {
		clearCustomHighlights(COMMENT_HIGHLIGHT, COMMENT_HOVER_HIGHLIGHT);
	}

	#renderHighlights(): void {
		this.#clearHighlights();
		setCustomHighlight(
			COMMENT_HIGHLIGHT,
			[
				...this.resolvedComments.flatMap(({ ranges }) => ranges),
				...this.draftRanges
			],
			2
		);
		this.#renderHoveredHighlight();
	}

	#renderHoveredHighlight(): void {
		clearCustomHighlights(COMMENT_HOVER_HIGHLIGHT);
		if (!this.#hoveredCommentId) return;
		const resolved = this.resolvedComments.find(
			({ comment }) => comment.id === this.#hoveredCommentId
		);
		if (resolved) setCustomHighlight(COMMENT_HOVER_HIGHLIGHT, resolved.ranges, 3);
	}

	#scheduleRefresh(): void {
		if (this.#refreshQueued) return;
		this.#refreshQueued = true;
		queueMicrotask(() => {
			this.#refreshQueued = false;
			this.refresh();
		});
	}
}
