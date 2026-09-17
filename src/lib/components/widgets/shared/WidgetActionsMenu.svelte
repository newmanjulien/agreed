<script lang="ts">
	import PencilSimpleIcon from 'phosphor-svelte/lib/PencilSimpleIcon';
	import TrashIcon from 'phosphor-svelte/lib/TrashIcon';
	import OverflowMenu from '$lib/components/ui/OverflowMenu.svelte';

	let {
		label,
		rootClass,
		onEdit,
		onDelete,
		editDisabled = false,
		deleteDisabled = false,
		deleting = false
	}: {
		label: string;
		rootClass: string;
		onEdit: () => void;
		onDelete: () => void;
		editDisabled?: boolean;
		deleteDisabled?: boolean;
		deleting?: boolean;
	} = $props();
</script>

<OverflowMenu
	label={`Open ${label.toLowerCase()} actions`}
	menuLabel={`${label} actions`}
	{rootClass}
	menuClass="top-[calc(100%+5px)] right-0 w-32"
	iconSize={20}
>
	{#snippet children(closeMenu)}
		<button
			type="button"
			class="flex min-h-9 w-full cursor-pointer items-center justify-between gap-4 rounded-sm border-0 bg-transparent px-2.5 py-2 text-left text-sm leading-[1.25] text-ink shadow-none hover:bg-hover focus-visible:bg-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent disabled:cursor-wait disabled:text-disabled disabled:hover:bg-transparent"
			role="menuitem"
			disabled={editDisabled}
			onclick={() => {
				closeMenu();
				onEdit();
			}}
		>
			<span>Edit</span>
			<PencilSimpleIcon aria-hidden="true" class="shrink-0 text-ink-muted" size={16} />
		</button>
		<button
			type="button"
			class="flex min-h-9 w-full cursor-pointer items-center justify-between gap-4 rounded-sm border-0 bg-transparent px-2.5 py-2 text-left text-sm leading-[1.25] text-ink shadow-none hover:bg-hover focus-visible:bg-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent disabled:cursor-wait disabled:text-disabled disabled:hover:bg-transparent"
			role="menuitem"
			disabled={deleteDisabled}
			onclick={() => {
				closeMenu();
				onDelete();
			}}
		>
			<span>{deleting ? 'Deleting…' : 'Delete'}</span>
			<TrashIcon aria-hidden="true" class="shrink-0 text-ink-muted" size={16} />
		</button>
	{/snippet}
</OverflowMenu>
