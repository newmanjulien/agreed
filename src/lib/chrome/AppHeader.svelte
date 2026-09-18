<script lang="ts">
	import { asset } from '$app/paths';
	import { page } from '$app/state';

	const navItems = [
		{ label: 'Requests', href: '/', current: ['/', '/review', '/processing'] },
		{ label: 'Contract', href: '/contract' }
	] as const;

	function pathMatches(path: string, route: string) {
		return route === '/' ? path === '/' : path === route || path.startsWith(`${route}/`);
	}

	function isActive(item: (typeof navItems)[number]) {
		const path = page.url.pathname;
		const routes = 'current' in item ? item.current : [item.href];
		return routes.some((route) => pathMatches(path, route));
	}

	const CHANGE_POINTS_LEFT = 10;
	const isReview = $derived(pathMatches(page.url.pathname, '/review'));
</script>

<header
	class="sticky top-0 z-20 h-[var(--app-header-height)] border-b border-line bg-surface"
>
	<div class="flex h-full w-full items-stretch px-1.5 sm:px-2.5 md:px-4">
		<a
			class="mr-1.5 flex shrink-0 items-center sm:mr-3.5 md:mr-6"
			href="/"
			aria-label="Agreed"
		>
			<img
				src={asset('/logo.png')}
				alt=""
				width="68"
				height="122"
				class="h-6 w-auto md:h-7"
			/>
		</a>

		<nav class="flex h-full items-stretch" aria-label="Primary navigation">
			{#each navItems as item (item.href)}
				{@const active = isActive(item)}
				<a
					class="relative mr-4 flex items-center px-2 text-[14px] leading-none transition-colors"
					class:text-ink={active}
					class:text-muted={!active}
					aria-current={active ? 'page' : undefined}
					href={item.href}
				>
					{item.label}

					{#if active}
						<span
							class="absolute inset-x-0 bottom-0 h-0.5 bg-ink"
							aria-hidden="true"
						></span>
					{/if}
				</a>
			{/each}
		</nav>

		<div class="my-auto ml-auto flex items-center gap-2.5 sm:gap-3">
			{#if isReview}
				<p
					class="text-[12.5px] leading-none text-muted sm:text-[13.5px]"
					role="status"
					aria-label="{CHANGE_POINTS_LEFT} points left"
				>
					<span class="font-medium tabular-nums text-ink">{CHANGE_POINTS_LEFT}</span>
					<span class="max-[420px]:hidden"> points left</span>
					<span class="min-[420px]:hidden"> left</span>
				</p>
			{/if}

			<div
				class="grid size-[30px] shrink-0 place-items-center rounded-full bg-selection text-[11.5px] font-medium text-accent"
				role="img"
				aria-label="User avatar"
			>
				JN
			</div>
		</div>
	</div>
</header>
