<script lang="ts">
	import { onMount, tick } from 'svelte';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import type { ChangesWidgetDefinition } from '$lib/contract/model';
	import type { ContractChangeResult } from '$lib/contract/change-result';
	import WidgetFrame from '../WidgetFrame.svelte';
	import { changeFailureMessage } from '../shared/change-result-message';

	let {
		clauseId,
		title,
		definition,
		value,
		onDismiss,
		onChange,
		onCustomSelect
	}: {
		clauseId: string;
		title: string;
		definition: ChangesWidgetDefinition;
		value: string;
		onDismiss: () => void;
		onChange: (value: string) => Promise<ContractChangeResult>;
		onCustomSelect: (optionValue: string) => void;
	} = $props();

	let pending = $state(false);
	let selectedValue = $state<string>();
	let errorMessage = $state('');
	let selectElement = $state<HTMLSelectElement>();
	let widgetId = $derived(`clause-widget-${clauseId}`);
	let promptId = $derived(`${widgetId}-prompt`);
	let appliedMessageId = $derived(`${widgetId}-applied`);
	let errorMessageId = $derived(`${widgetId}-error`);
	let controlId = $derived(`${widgetId}-${definition.control.id}-control`);
	let displayedValue = $derived(selectedValue ?? value);
	let isApplied = $derived(value !== definition.control.defaultValue);
	let describedBy = $derived(
		[
			promptId,
			isApplied ? appliedMessageId : null,
			errorMessage ? errorMessageId : null
		]
			.filter(Boolean)
			.join(' ')
	);

	async function handleChange(event: Event & { currentTarget: HTMLSelectElement }) {
		if (pending) return;
		const nextValue = event.currentTarget.value;
		const nextOption = definition.control.options.find((option) => option.value === nextValue);
		if (nextOption?.kind === 'custom') {
			errorMessage = '';
			selectedValue = undefined;
			onCustomSelect(nextOption.value);
			return;
		}

		selectedValue = nextValue;
		errorMessage = '';
		pending = true;
		try {
			const result = await onChange(nextValue);
			if (!result.ok) {
				errorMessage = changeFailureMessage('control', result.reason);
			}
		} catch (error) {
			console.error('Clause change failed.', error);
			errorMessage = 'That change could not be laid out. The previous value was kept.';
		} finally {
			selectedValue = undefined;
			pending = false;
		}
	}

	onMount(() => {
		void tick().then(() => selectElement?.focus({ preventScroll: true }));
	});
</script>

<WidgetFrame
	label={title}
	intro={definition.prompt}
	introId={promptId}
	onDismiss={onDismiss}
>
	<label class="sr-only" for={controlId}>{definition.control.label}</label>
	<div class="relative">
		<select
			class="h-12 w-full cursor-pointer appearance-none rounded-field border border-line bg-surface px-3 pr-10 text-[15px] text-ink shadow-none transition-colors hover:border-line-strong focus-within:border-accent focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-accent/18 disabled:cursor-wait disabled:bg-canvas disabled:text-ink-muted motion-reduce:transition-none"
			bind:this={selectElement}
			id={controlId}
			aria-describedby={describedBy}
			value={displayedValue}
			disabled={pending}
			onchange={handleChange}
		>
			{#each definition.control.options as option}
				<option value={option.value}>{option.controlLabel}</option>
			{/each}
		</select>
		<CaretDownIcon
			class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted"
			aria-hidden="true"
			size={20}
			weight="regular"
		/>
	</div>

	{#if isApplied}
		<p
			id={appliedMessageId}
			class="mt-2.5 mb-0 text-sm leading-[1.45] text-ink-subtle"
			role="status"
		>
			{definition.appliedMessage}
		</p>
	{/if}

	{#if errorMessage}
		<p id={errorMessageId} class="mt-2.5 mb-0 text-xs leading-[1.35] text-danger" role="alert">
			{errorMessage}
		</p>
	{/if}
</WidgetFrame>
