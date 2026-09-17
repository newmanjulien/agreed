<script lang="ts">
	import ParticipantAvatar from './ParticipantAvatar.svelte';
</script>

<div class="flex min-w-0 items-center gap-2">
	<ParticipantAvatar />
	<span class="author-name min-w-0 truncate text-[13px] leading-[1.2] text-ink">You</span>
</div>

<style>
	.author-name {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		font-weight: 550;
	}
</style>
