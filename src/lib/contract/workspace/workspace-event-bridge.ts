import type { WorkspaceInteractionController } from './workspace-interaction-controller.svelte';

export function connectInteractionDismissal(
	interactions: WorkspaceInteractionController
): () => void {
	function handlePointerDown(event: PointerEvent) {
		const isInteractive = event.composedPath().some(
			(node) =>
				node instanceof HTMLElement &&
				(Boolean(node.dataset.clauseId) || node.hasAttribute('data-widget'))
		);
		interactions.dismissForOutsideClick(isInteractive);
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
