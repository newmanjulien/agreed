import type { TextAnchor } from '$lib/document/anchors/types';
import type { ProposalTarget } from '$lib/review/proposal-target';
import type { CommentSession } from '$lib/review/comment-session.svelte';
import type { DiscussionSession } from '$lib/review/discussion-session.svelte';
import {
	discussionTargetsEqual,
	type DiscussionTarget
} from '$lib/review/discussion-types';
import type { ProposalDraftSession } from '$lib/review/proposal-draft-session.svelte';
import type {
	ClauseWidgetTarget,
	WidgetTarget
} from '$lib/components/widgets/widget-positioner.svelte';

export type WorkspaceInteraction =
	| { kind: 'clause'; target: ClauseWidgetTarget }
	| { kind: 'proposal-log'; target: Extract<WidgetTarget, { kind: 'proposal-log' }> }
	| { kind: 'comment-draft' }
	| {
			kind: 'proposal-draft';
			proposalKind: ProposalTarget['kind'];
			clauseWidget?: ClauseWidgetTarget;
		}
	| { kind: 'discussion'; target: DiscussionTarget }
	| null;

interface WorkspaceInteractionHooks {
	clearClauseReference: () => void;
	onClauseClosed: (clauseId: string) => void;
	onReviewDraftClosed: () => void;
	onWidgetClosed: () => void;
	restoreWidgetFocus: (target: WidgetTarget) => void;
}

interface WorkspaceReviewSessions {
	comments: CommentSession;
	proposals: ProposalDraftSession;
	discussion: DiscussionSession;
}

export class WorkspaceInteractionController {
	active = $state<WorkspaceInteraction>(null);

	constructor(
		private readonly sessions: () => WorkspaceReviewSessions,
		private readonly hooks: WorkspaceInteractionHooks
	) {}

	get widgetTarget(): WidgetTarget | null {
		if (this.active?.kind === 'clause' || this.active?.kind === 'proposal-log') {
			return this.active.target;
		}
		return this.active?.kind === 'proposal-draft'
			? this.active.clauseWidget ?? null
			: null;
	}

	get clauseId(): string | null {
		const target = this.widgetTarget;
		return target?.kind === 'clause' ? target.id : null;
	}

	get proposalId(): string | null {
		return this.active?.kind === 'proposal-log' ? this.active.target.id : null;
	}

	openWidget(target: WidgetTarget): void {
		this.#clearActiveInteraction();
		this.hooks.clearClauseReference();
		this.active =
			target.kind === 'clause'
				? { kind: 'clause', target }
				: { kind: 'proposal-log', target };
	}

	closeWidget(restoreFocus = false): void {
		if (this.active?.kind !== 'clause' && this.active?.kind !== 'proposal-log') return;
		const target = this.active.target;
		if (target.kind === 'clause') this.hooks.onClauseClosed(target.id);
		this.active = null;
		this.hooks.onWidgetClosed();
		if (restoreFocus) this.hooks.restoreWidgetFocus(target);
	}

	startComment(anchor: TextAnchor): void {
		this.#clearActiveInteraction();
		this.hooks.clearClauseReference();
		this.sessions().comments.startDraft(anchor);
		this.active = { kind: 'comment-draft' };
	}

	startProposal(target: ProposalTarget): void {
		this.hooks.clearClauseReference();

		if (target.kind === 'clause') {
			if (this.active?.kind !== 'clause' || this.active.target.id !== target.clauseId) {
				throw new Error('A clause proposal requires its clause widget to be active.');
			}
			const clauseWidget = this.active.target;
			this.sessions().proposals.start(target);
			this.active = { kind: 'proposal-draft', proposalKind: 'clause', clauseWidget };
			return;
		}

		this.#clearActiveInteraction();
		this.sessions().proposals.start(target);
		this.active = { kind: 'proposal-draft', proposalKind: 'text' };
	}

	startDiscussion(target: DiscussionTarget, startComposer: () => void): void {
		this.#clearActiveInteraction();
		this.hooks.clearClauseReference();
		startComposer();
		const composer = this.sessions().discussion.composer;
		if (!composer || !discussionTargetsEqual(composer.target, target)) {
			throw new Error('The discussion composer did not start.');
		}
		this.active = { kind: 'discussion', target };
	}

	cancelCommentDraft(): boolean {
		if (this.active?.kind !== 'comment-draft') return false;
		const cancelled = this.sessions().comments.cancelDraft();
		this.active = null;
		if (cancelled) this.hooks.onReviewDraftClosed();
		return cancelled;
	}

	finishCommentDraft(): void {
		if (this.active?.kind !== 'comment-draft') return;
		this.active = null;
		this.hooks.onReviewDraftClosed();
	}

	cancelProposalDraft(): boolean {
		if (this.active?.kind !== 'proposal-draft') return false;
		const { clauseWidget } = this.active;
		const cancelled = this.sessions().proposals.cancel();
		this.active = clauseWidget ? { kind: 'clause', target: clauseWidget } : null;
		if (cancelled) this.hooks.onReviewDraftClosed();
		return cancelled;
	}

	discussionClosed(target: DiscussionTarget): void {
		if (
			this.active?.kind === 'discussion' &&
			discussionTargetsEqual(this.active.target, target)
		) {
			this.active = null;
		}
	}

	dismissForOutsideClick(isInsideWidget: boolean, isInteractiveTarget: boolean): void {
		const active = this.active;
		if (!active) return;

		switch (active.kind) {
			case 'comment-draft':
				if (!isInsideWidget) this.cancelCommentDraft();
				return;
			case 'proposal-draft':
				if (!isInsideWidget) {
					this.cancelProposalDraft();
					if (active.proposalKind === 'clause') this.closeWidget();
				}
				return;
			case 'discussion':
				if (!isInsideWidget) {
					this.sessions().discussion.cancel();
					this.active = null;
				}
				return;
			case 'clause':
			case 'proposal-log':
				if (!isInteractiveTarget) this.closeWidget();
		}
	}

	cancelActive(restoreFocus = false): boolean {
		const active = this.active;
		if (!active) return false;

		switch (active.kind) {
			case 'comment-draft':
				return this.cancelCommentDraft();
			case 'proposal-draft':
				return this.cancelProposalDraft();
			case 'discussion':
				this.sessions().discussion.cancel();
				this.active = null;
				return true;
			case 'clause':
			case 'proposal-log':
				this.closeWidget(restoreFocus);
				this.hooks.clearClauseReference();
				return true;
		}
	}

	#clearActiveInteraction(): void {
		const active = this.active;
		if (!active) return;
		const widgetTarget = this.widgetTarget;

		switch (active.kind) {
			case 'comment-draft':
				this.sessions().comments.cancelDraft();
				this.hooks.onReviewDraftClosed();
				break;
			case 'proposal-draft':
				this.sessions().proposals.cancel();
				this.hooks.onReviewDraftClosed();
				if (active.clauseWidget) this.hooks.onClauseClosed(active.clauseWidget.id);
				break;
			case 'discussion':
				this.sessions().discussion.cancel();
				break;
			case 'clause':
				this.hooks.onClauseClosed(active.target.id);
				break;
			case 'proposal-log':
				break;
		}
		this.active = null;
		if (widgetTarget) this.hooks.onWidgetClosed();
	}
}
