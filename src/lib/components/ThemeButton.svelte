<script lang="ts">
	import { onMount } from "svelte";
	import IconSun from "~icons/ph/sun-bold";
	import IconMoon from "~icons/ph/moon-stars-bold";
	import IconMonitor from "~icons/ph/monitor-bold";
	import Popover from "./Popover.svelte";
	import {
		derivedMode,
		localStorageKey,
		userPrefersMode,
		type Mode,
		isValidMode,
		systemMode,
		modes
	} from "$lib/stores/theme";
	import { cn } from "$lib/utils";

	const defaultMode: Mode = "system";

	onMount(() => {
		systemMode.query();
		const storedMode = localStorage.getItem(localStorageKey);
		userPrefersMode.set(isValidMode(storedMode) ? storedMode : defaultMode);
	});
</script>

<Popover>
	<div slot="trigger" class={$userPrefersMode === $derivedMode ? "text-sky-500" : "text-slate-500"}>
		<IconSun class="inline-block h-6 w-6 dark:hidden" />
		<IconMoon class="hidden h-6 w-6 dark:inline-block" />
	</div>
	<div
		slot="content"
		class="text-md top-full mt-1 w-36 overflow-hidden rounded-lg bg-white py-1 font-semibold text-slate-700 shadow-lg
		ring-1 ring-slate-900/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-0"
	>
		{#each modes as mode}
			{@const selected = $userPrefersMode === mode}
			{@const iconStyle = cn("w-6 h-6 mr-2", { "text-slate-500": !selected })}
			<button
				class="flex w-full cursor-pointer items-center justify-start px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-600/30"
				class:text-sky-500={selected}
				on:click={() => userPrefersMode.set(mode)}
			>
				{#if mode === "light"}
					<IconSun class={iconStyle} />
				{:else if mode === "dark"}
					<IconMoon class={iconStyle} />
				{:else if mode === "system"}
					<IconMonitor class={iconStyle} />
				{/if}
				{mode.charAt(0).toUpperCase() + mode.slice(1)}
			</button>
		{/each}
	</div>
</Popover>
