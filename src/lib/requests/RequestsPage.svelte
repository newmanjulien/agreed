<script lang="ts">
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import { mockRequests } from '$lib/requests/mock-requests';
	import RequestsInfoModal from './RequestsInfoModal.svelte';
	import RequestDiscussionModal from './RequestDiscussionModal.svelte';
	import { reviewSession } from './review-session.svelte';
	import type { ChangeRequest, DiscussionGuide } from './types';

	let infoModalOpen = $state(false);
	let discussionGuide = $state<DiscussionGuide | null>(null);

	type ActionVariant = 'accept' | 'secondary' | 'remove';

	type RowAction = {
		variant: ActionVariant;
		label: string;
		disabled?: boolean;
		onclick?: () => void;
	};

	const actionBase =
		'h-8 w-[155px] rounded-full px-3 text-[14.5px] transition-colors disabled:cursor-default disabled:opacity-40';

	const actionStyles = {
		accept:
			'bg-ink/90 text-surface shadow-[0_1px_2px_rgba(0,0,0,0.10)] hover:bg-ink/88 disabled:hover:bg-ink/90',
		secondary:
			'border border-line/80 bg-surface/20 text-muted shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-canvas disabled:hover:bg-surface/20',
		remove:
			'border border-danger/20 bg-danger/10 text-danger/70 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-danger/16'
	} satisfies Record<ActionVariant, string>;

	function rowAction(request: ChangeRequest): RowAction {
		if (request.decision === 'canAccept') {
			if (reviewSession.isAccepted(request.id)) {
				return {
					variant: 'remove',
					label: 'Remove',
					onclick: () => reviewSession.toggleAccept(request)
				};
			}

			return {
				variant: 'accept',
				label: `Accept (${request.points} ${request.points === 1 ? 'point' : 'points'})`,
				disabled: !reviewSession.canAfford(request.points),
				onclick: () => reviewSession.toggleAccept(request)
			};
		}

		if (request.decision === 'cannotAccept') {
			return {
				variant: 'secondary',
				label: 'How to discuss',
				onclick: () => (discussionGuide = request.discussionGuide)
			};
		}

		if (request.decision === 'needsApproval') {
			return {
				variant: 'secondary',
				label: 'Ask for approval',
				disabled: true
			};
		}

		const unhandled: never = request;
		throw new Error(`Unhandled request decision: ${JSON.stringify(unhandled)}`);
	}
</script>

{#if infoModalOpen}
	<RequestsInfoModal onClose={() => (infoModalOpen = false)} />
{/if}

{#if discussionGuide}
	<RequestDiscussionModal guide={discussionGuide} onClose={() => (discussionGuide = null)} />
{/if}

<main class="min-h-[calc(100dvh-var(--app-header-height))] bg-surface">
	<div class="px-(--app-gutter)">
		<div class="px-2">
			<h1 class="pt-12 pb-4 text-[23.5px] leading-[1.22] tracking-[-0.02em] text-ink">
				Review requests
			</h1>

			<p class="flex items-center gap-1.5 pb-9 text-[14.5px] leading-relaxed text-muted">
				<span>Accept pre-approved changes and reach out to Ben if you need approval</span>

				<button
					type="button"
					class="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-hover focus-visible:bg-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
					aria-label="How reviewing works"
					onclick={() => (infoModalOpen = true)}
				>
					<InfoIcon aria-hidden="true" size={18} weight="regular" />
				</button>
			</p>

			<div class="overflow-x-auto">
				<table class="w-full border-collapse" aria-label="Change requests">
					<tbody>
						{#each mockRequests as request (request.id)}
							{@const accepted = request.decision === 'canAccept' && reviewSession.isAccepted(request.id)}
							{@const action = rowAction(request)}

							<tr class="h-[55px] border-t border-line/60 first:border-t-0">
								<td class="w-full pr-3">
									<div class="flex min-w-0 items-center gap-2">
										{#if accepted}
											<span
												class="grid size-5 shrink-0 place-items-center text-success"
												aria-hidden="true"
											>
												<CheckIcon size={16} weight="bold" />
											</span>
										{/if}

										<div
											class={[
												'truncate text-[15px] leading-snug',
												request.decision === 'cannotAccept' ? 'text-danger' : 'text-muted'
											]}
											title={request.requestedChange}
										>
											{request.requestedChange}
										</div>
									</div>
								</td>

								<td class="text-right whitespace-nowrap">
									<button
										type="button"
										class={[actionBase, actionStyles[action.variant]]}
										disabled={action.disabled}
										onclick={action.onclick}
									>
										{action.label}
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="flex flex-wrap items-center gap-3 pt-9 pb-10">
				<button
					type="button"
					class="inline-flex h-10  items-center justify-center rounded-xl bg-accent px-[18px] text-[15px] leading-[1.5] text-white transition-[filter] hover:brightness-95 focus-visible:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				>
					{Object.keys(reviewSession.accepted).length > 0
						? 'Download updated contract'
						: 'Download standard contract'}
				</button>
				<a
					href="/"
					class="inline-flex h-10 items-center justify-center rounded-xl border border-line bg-surface px-[18px] text-[15px] leading-[1.5] text-muted transition-[filter] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				>
					Cancel
				</a>
			</div>
		</div>
	</div>
</main>
