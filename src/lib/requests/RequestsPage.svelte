<script lang="ts">
	import QuestionIcon from 'phosphor-svelte/lib/QuestionIcon';
	import TextTSlashIcon from 'phosphor-svelte/lib/TextTSlashIcon';
	import ThumbsUpIcon from 'phosphor-svelte/lib/ThumbsUpIcon';
	import type { Component } from 'svelte';
	import { mockRequests } from '$lib/requests/mock-requests';
	import RequestsShell from './RequestsShell.svelte';
	import type { ChangeRequestType } from './types';

	const types = {
		'Can accept': {
			icon: ThumbsUpIcon,
			class: 'text-success'
		},
		'Needs approval': {
			icon: QuestionIcon,
			class: 'text-accent'
		},
		"Can't accept": {
			icon: TextTSlashIcon,
			class: 'text-danger'
		}
	} satisfies Record<ChangeRequestType, { icon: Component; class: string }>;
</script>

<RequestsShell>
	<div class="px-2">
		<h1 class="pt-12 pb-4 text-[23.5px] leading-[1.22] tracking-[-0.02em] text-ink">
			Review requests
		</h1>

		<p class="pb-6 text-[14.5px] leading-relaxed text-muted">
			You need approval for all changes once points are used up
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

						<th scope="col">
							<span class="sr-only">Action</span>
						</th>
					</tr>
				</thead>

				<tbody>
					{#each mockRequests as request (request.id)}
						{@const meta = types[request.type]}

						<tr class="h-[55px] border-t border-line/60">
							<td class="w-full pr-3">
								<div
									class="truncate text-[15px] leading-snug text-muted"
									title={request.requestedChange}
								>
									{request.requestedChange}
								</div>
							</td>

							<td class="h-[52px] px-5">
								<div class="flex h-full items-center gap-1.5">
									<span class={['shrink-0', meta.class]} aria-hidden="true">
										<meta.icon size={21} weight="regular" />
									</span>

									<span class="text-[14px] whitespace-nowrap text-muted">
										{request.type}
									</span>
								</div>
							</td>

							<td class="text-right whitespace-nowrap">
								{#if request.action === 'Accept'}
									<button
										type="button"
										class="h-8 min-w-[111px] rounded-full bg-accent px-3 text-[14.5px] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-colors hover:bg-accent-hover"
									>
										Accept ({request.points ?? 0})
									</button>
								{:else}
									<button
										type="button"
										class="h-8 min-w-[111px] rounded-full border border-line/80 bg-surface/20 px-3 text-[14.5px] text-muted shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-colors hover:bg-canvas"
									>
										{request.action}
									</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</RequestsShell>