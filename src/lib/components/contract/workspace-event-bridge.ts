import type { CommentSession } from '$lib/review/comment-session.svelte';
import type { WorkspaceInteractionController } from './workspace-interaction-controller.svelte';

interface DocumentEventBridgeOptions {
	target: HTMLElement;
	comments: CommentSession;
	onCommentActivate: (commentId: string) => void;
}

export function connectDocumentEventBridge({
	target,
	comments,
	onCommentActivate
}: DocumentEventBridgeOptions): () => void {
	function handleClick(event: MouseEvent) {
		const selection = window.getSelection();
		if (selection && !selection.isCollapsed) return;
		if (event.target instanceof Element && event.target.closest('[data-proposal-id]')) return;

		const commentId = comments.commentIdAtPoint(event.clientX, event.clientY);
		if (commentId) {
			event.preventDefault();
			event.stopPropagation();
			onCommentActivate(commentId);
			return;
		}

		if (
			event.target instanceof Element &&
			event.target.closest('a, button, input, select, textarea, [role="button"]')
		) {
			return;
		}
	}

	function handlePointerMove(event: PointerEvent) {
		if (event.pointerType === 'touch') return;
		comments.setHoveredComment(comments.commentIdAtPoint(event.clientX, event.clientY));
	}

	function handlePointerLeave() {
		comments.setHoveredComment(undefined);
	}

	target.addEventListener('click', handleClick, true);
	target.addEventListener('pointermove', handlePointerMove);
	target.addEventListener('pointerleave', handlePointerLeave);

	return () => {
		target.removeEventListener('click', handleClick, true);
		target.removeEventListener('pointermove', handlePointerMove);
		target.removeEventListener('pointerleave', handlePointerLeave);
		comments.setHoveredComment(undefined);
	};
}

export function connectInteractionDismissal(
	interactions: WorkspaceInteractionController
): () => void {
	function handlePointerDown(event: PointerEvent) {
		const eventPath = event.composedPath();
		const isInsideWidget = eventPath.some(
			(node) => node instanceof HTMLElement && node.hasAttribute('data-widget')
		);
		const isInteractive = eventPath.some(
			(node) =>
				node instanceof HTMLElement &&
					(Boolean(node.dataset.clauseId) ||
						Boolean(node.dataset.proposalId) ||
						node.hasAttribute('data-widget'))
		);
		interactions.dismissForOutsideClick(isInsideWidget, isInteractive);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') interactions.cancelActive(true);
	}

	document.addEventListener('pointerdown', handlePointerDown);
	document.addEventListener('keydown', handleKeydown);

	return () => {
		document.removeEventListener('pointerdown', handlePointerDown);
		document.removeEventListener('keydown', handleKeydown);
	};
}
