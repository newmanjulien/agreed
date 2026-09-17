<script lang="ts">
	import CloudArrowUpIcon from 'phosphor-svelte/lib/CloudArrowUpIcon';

	type Card = {
		title: string;
		description: string;
		illustration: 'screenshot' | 'layers';
		width: string;
	};

	const cards = [
		{
			title: 'Screenshot or recording',
			description:
				'Upload a screenshot if the buyer sent changes by email or text, or a recording if you discussed them in a conversation.',
			illustration: 'screenshot',
			width: '600px'
		},
		{
			title: 'Redlined contract',
			description:
				"Upload a redlined contract if the buyer made edits or comments directly in the document.",
			illustration: 'layers',
			width: '480px'
		}
	] satisfies Card[];
</script>

<svelte:head>
	<title>Home | Agreed</title>
	<meta
		name="description"
		content="Upload requested changes and prepare a response for the buyer."
	/>
</svelte:head>

{#snippet resourceCard(card: Card)}
	<div
		class="flex w-full"
		style:max-width={card.width}
	>
		<div
			class="flex w-[108px] shrink-0 items-center justify-center rounded-l-[14px] bg-[#FAFAFB]"
			aria-hidden="true"
		>
			{#if card.illustration === 'screenshot'}
				{@render screenshotIllustration()}
			{:else}
				{@render layersIllustration()}
			{/if}
		</div>

		<div
			class="flex min-h-[108px] flex-1 flex-col justify-center rounded-r-[14px] border border-l-0 border-[#EDEAF0] bg-white px-[18px] py-[12px] text-left"
		>
			<h2
				class="text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-[#4B4062]"
			>
				{card.title}
			</h2>

			<p class="text-brand-muted mt-[7px] text-[14.5px] leading-[1.5]">
				{card.description}
			</p>
		</div>
	</div>
{/snippet}

{#snippet layersIllustration()}
	<svg
		viewBox="0 0 96 96"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="size-[64px]"
	>
		<path
			d="M17 55.5L47.8 72.5L79 57L48.2 40L17 55.5Z"
			fill="#F4F3F6"
			stroke="var(--color-brand-stroke)"
			stroke-width="3"
			stroke-linejoin="round"
		/>

		<path
			d="M17 42.5L47.8 59.5L79 44L48.2 27L17 42.5Z"
			fill="#F1F4F8"
			stroke="var(--color-brand-stroke)"
			stroke-width="3"
			stroke-linejoin="round"
		/>

		<path
			d="M17 29.5L47.8 46.5L79 31L48.2 14L17 29.5Z"
			fill="#E8EEF8"
			stroke="var(--color-accent)"
			stroke-width="3"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet screenshotIllustration()}
	<svg
		viewBox="0 0 96 96"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="size-[64px]"
	>
		<path
			d="M30 14H22C17.6 14 14 17.6 14 22V30"
			stroke="var(--color-brand-stroke)"
			stroke-width="3"
			stroke-linecap="round"
		/>

		<path
			d="M66 14H74C78.4 14 82 17.6 82 22V30"
			stroke="var(--color-brand-stroke)"
			stroke-width="3"
			stroke-linecap="round"
		/>

		<path
			d="M30 82H22C17.6 82 14 78.4 14 74V66"
			stroke="var(--color-brand-stroke)"
			stroke-width="3"
			stroke-linecap="round"
		/>

		<path
			d="M66 82H74C78.4 82 82 78.4 82 74V66"
			stroke="var(--color-brand-stroke)"
			stroke-width="3"
			stroke-linecap="round"
		/>

		<rect
			x="25"
			y="25"
			width="46"
			height="46"
			rx="11"
			fill="#F1F4F8"
			stroke="var(--color-brand-stroke)"
			stroke-width="3"
		/>

		<path
			d="M27 60L41.5 45.5C42.3 44.7 43.7 44.7 44.5 45.5L53.5 54.5"
			stroke="var(--color-brand-stroke)"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>

		<path
			d="M48 66L59.5 54.5C60.3 53.7 61.7 53.7 62.5 54.5L69 61"
			stroke="var(--color-accent)"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<main class="min-h-[calc(100dvh-var(--app-header-height))] bg-white">
	<!-- Primary upload workflow -->
	<section
		class="mx-auto w-full max-w-[644px] px-[14.6px] pt-[55px] text-center"
		aria-labelledby="home-upload-title"
	>
		<h1
			id="home-upload-title"
			class="text-[22px] leading-[1.22] tracking-[-0.02em] text-[#302448]"
		>
			Upload the buyer's requested changes
		</h1>

		<p
			class="mx-auto mt-[13px] max-w-[438px] text-[16px] leading-[1.42] text-[#35294d]"
		>
			We’ll show you what you can accept, what needs approval, and how to respond to anything you can’t accept.
		</p>

		<label
			class="group focus-within:ring-accent relative mt-[30px] grid min-h-[283px] cursor-pointer place-items-center rounded-[16px] px-[29.2px] text-center transition-colors hover:bg-[#FCFCFD] focus-within:bg-[#FCFCFD] focus-within:ring-2 focus-within:ring-offset-2"
		>
			<svg
				class="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
				aria-hidden="true"
			>
				<rect
					x="0.75"
					y="0.75"
					width="calc(100% - 1.5px)"
					height="calc(100% - 1.5px)"
					rx="15"
					fill="none"
					stroke="#C6C1CD"
					stroke-width="1.3"
					stroke-dasharray="7 5"
					class="transition-colors group-hover:stroke-[#AAA4B4]"
				/>
			</svg>

			<input
				class="sr-only"
				type="file"
				accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
			/>

			<div class="relative -translate-y-[8px] flex flex-col items-center">
				<CloudArrowUpIcon
					class="group-hover:text-accent group-focus-within:text-accent size-[33px] shrink-0 text-[#675E75] transition-colors"
					weight="regular"
					aria-hidden="true"
				/>

				<span
					class="text-brand-muted mt-[16px] max-w-[298px] text-[15.5px] leading-[1.5]"
				>
					Drop a screenshot, recording, or redlined contract here
				</span>
			</div>
		</label>
	</section>

	<!-- Supporting cards -->
	<section
		class="mx-auto mt-[99px] w-full max-w-[1300px] px-[24px] pb-[80px] sm:px-[32px]"
		aria-label="Helpful resources"
	>
		<div class="flex flex-col gap-[20px] md:flex-row md:justify-between md:gap-[80px]">
			{#each cards as card}
				{@render resourceCard(card)}
			{/each}
		</div>
	</section>
</main>