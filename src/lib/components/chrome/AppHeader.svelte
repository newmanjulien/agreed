<script lang="ts">
	import { asset } from '$app/paths';
	import { page } from '$app/state';

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Contract', href: '/contract' }
	] as const;

	function isActive(href: string) {
		return href === '/'
			? page.url.pathname === href
			: page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}
</script>

<header
	class="sticky top-0 z-20 h-[var(--app-header-height)] border-b border-[#e7e7e7] bg-white"
	data-print-exclude
>
	<div class="flex h-full w-full items-stretch px-2 sm:px-3 md:px-[18px]">
		<a
			class="mr-1.5 flex shrink-0 items-center sm:mr-3.5 md:mr-6"
			href="/"
			aria-label="Agreed home"
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
				{@const active = isActive(item.href)}
				<a
					class="relative mr-4 flex items-center px-2 text-[13.5px] leading-none transition-colors"
					class:text-[#2d2347]={active}
					class:text-[#615875]={!active}
					aria-current={active ? 'page' : undefined}
					href={item.href}
				>
					{item.label}

					{#if active}
						<span
							class="absolute inset-x-0 bottom-0 h-0.5 bg-[#2b2146]"
							aria-hidden="true"
						></span>
					{/if}
				</a>
			{/each}
		</nav>

		<p
			class="ml-auto flex shrink-0 items-center text-[13.5px] font-medium whitespace-nowrap text-[#261347]"
		>
			10 reviews left
		</p>

		<div
			class="my-auto ml-5 grid size-[33px] shrink-0 place-items-center rounded-full bg-[#c9f3fb] text-[12px] font-medium text-[#0a5a70]"
			role="img"
			aria-label="User avatar"
		>
			JN
		</div>
	</div>
</header>
