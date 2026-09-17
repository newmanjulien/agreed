<script lang="ts">
	import WidgetFrame from '../WidgetFrame.svelte';
	import MessageByline from '../shared/MessageByline.svelte';
	import MessageComposer from '../shared/MessageComposer.svelte';

	let {
		text,
		onTextChange,
		onCancel,
		onSubmit
	}: {
		text: string;
		onTextChange: (text: string) => void;
		onCancel: () => void;
		onSubmit: () => void;
	} = $props();
</script>

<WidgetFrame
	label="Add comment"
	onDismiss={onCancel}
	closeLabel="Cancel comment"
>
	<div class="mb-2.5">
		<MessageByline />
	</div>
	<MessageComposer
		{text}
		title="Add comment"
		placeholder="Write a comment…"
		submitLabel="Comment"
		enterBehavior="submit"
		{onTextChange}
		{onCancel}
		{onSubmit}
	/>
</WidgetFrame>
