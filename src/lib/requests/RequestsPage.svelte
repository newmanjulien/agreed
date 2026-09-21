<script lang="ts">
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import { mockRequests } from '$lib/requests/mock-requests';
	import RequestsInfoModal from './RequestsInfoModal.svelte';
	import { reviewSession } from './review-session.svelte';
	import type { ChangeRequest, ChangeRequestType } from './types';

	let infoModalOpen = $state(false);

	type ActionVariant = 'accept' | 'add' | 'remove';

	type RowAction = {
		variant: ActionVariant;
		label: string;
		disabled?: boolean;
		onclick?: () => void;
	};

	const actionBase =
		'h-8 min-w-[99px] rounded-full px-3 text-[14.5px] transition-colors disabled:cursor-default disabled:opacity-40';

const actionStyles = {
	accept:
		'bg-ink/90 text-surface shadow-[0_1px_2px_rgba(0,0,0,0.10)] hover:bg-ink/88 disabled:hover:bg-ink/90',
	add:
		'border border-line/80 bg-surface/20 text-muted shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-canvas',
	remove:
		'border border-danger/20 bg-danger/10 text-danger/70 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-danger/16'
} satisfies Record<ActionVariant, string>;

	function rowAction(request: ChangeRequest): RowAction {
		if (reviewSession.isAccepted(request.id)) {
			return {
				variant: 'remove',
				label: 'Remove',
				onclick: () => reviewSession.toggleAccept(request)
			};
		}

		if (request.action === 'Accept') {
			return {
				variant: 'accept',
				label: `Accept (${request.points ?? 0})`,
				disabled: !reviewSession.canAfford(request.points ?? 0),
				onclick: () => reviewSession.toggleAccept(request)
			};
		}

		if (request.action === 'Add') {
			const selected = reviewSession.isInBag(request.id);

			return {
				variant: selected ? 'remove' : 'add',
				label: selected ? 'Remove' : 'Add',
				onclick: () => reviewSession.toggleBag(request)
			};
		}

		return {
			variant: 'add',
			label: request.action
		};
	}

	const typeDotClasses = {
		'Can accept': 'bg-success',
		'Needs approval': 'bg-accent',
		"Can't accept": 'bg-danger'
	} satisfies Record<ChangeRequestType, string>;
</script>

{#if infoModalOpen}
	<RequestsInfoModal onClose={() => (infoModalOpen = false)} />
{/if}

<main class="flex min-h-[calc(100dvh-var(--app-header-height))] bg-surface">
	<div class="min-w-0 flex-1 px-(--app-gutter)">
		<div class="px-2">
			<h1 class="pt-12 pb-4 text-[23.5px] leading-[1.22] tracking-[-0.02em] text-ink">
				Review requests
			</h1>

			<p class="flex items-center gap-1.5 pb-9 text-[14.5px] leading-relaxed text-muted">
				<span>You need approval for all changes once points are used up</span>

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
					<thead>
						<tr class="h-11">
							<th
								class="w-full pr-3 text-left text-[14px] font-medium text-ink"
								scope="col"
							>
								Requested changes
							</th>

							<th
								class="px-5 text-left text-[14px] font-medium whitespace-nowrap text-ink"
								scope="col"
							>
								Type
							</th>

							<th class="sr-only" scope="col">
								Action
							</th>
						</tr>
					</thead>

					<tbody>
						{#each mockRequests as request (request.id)}
							{@const accepted = reviewSession.isAccepted(request.id)}
							{@const dotClass = typeDotClasses[request.type]}
							{@const action = rowAction(request)}

							<tr class="h-[55px] border-t border-line/60">
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
											class="truncate text-[15px] leading-snug text-muted"
											title={request.requestedChange}
										>
											{request.requestedChange}
										</div>
									</div>
								</td>

								<td class="px-5">
									<div class="flex items-center gap-2">
										<span
											class={['size-2 shrink-0 rounded-full', dotClass]}
											aria-hidden="true"
										></span>

										<span class="text-[14px] whitespace-nowrap text-muted">
											{request.type}
										</span>
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
		</div>
	</div>

	{#if reviewSession.bag.length}
		<aside
			class="flex w-[282px] shrink-0 flex-col border-l border-line/60"
			aria-label="Added changes"
		>
			<ul class="m-0 flex-1 list-none overflow-y-auto p-3">
				{#each reviewSession.bag as item (item.id)}
					<li class="flex flex-col gap-2 pt-1 pb-7">
						<div class="flex items-start gap-2">
							<span
								class="grid size-7 shrink-0 place-items-center rounded-full bg-selection text-[11px] font-medium text-accent"
								aria-hidden="true"
							>
								JN
							</span>

							<p class="m-0 text-[13.5px] leading-snug text-muted">
								{item.requestedChange}
							</p>
						</div>

						<label class="sr-only" for="justification-{item.id}">
							Explain {item.requestedChange}
						</label>

						<textarea
							id="justification-{item.id}"
							class="min-h-[111px] w-full resize-none rounded-xl border border-line/60 bg-surface px-2.5 py-2 text-[13px] leading-snug text-ink outline-none placeholder:text-muted hover:border-line focus:border-line focus:outline-2 focus:outline-offset-1 focus:outline-accent/18"
							placeholder="Explain this request"
							bind:value={item.justification}
						></textarea>
					</li>
				{/each}
			</ul>

			<div class="p-3">
				<button
					type="button"
					class="h-8 w-full rounded-full border border-line/80 bg-surface px-3 text-[14.5px] text-muted shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-colors hover:bg-canvas disabled:cursor-default disabled:opacity-40 disabled:hover:bg-surface"
					disabled={!reviewSession.canSubmit}
				>
					Next
				</button>
			</div>
		</aside>
	{/if}
</main>