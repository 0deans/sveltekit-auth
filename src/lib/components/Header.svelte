<script lang="ts">
	import ThemeButton from "./ThemeButton.svelte";
	import { Button } from "./button";
	import { page } from "$app/stores";
	import type { User } from "lucia";

	export let user: User | null;
</script>

<header class="flex items-center justify-between px-4 py-4 sm:px-6 md:px-8 lg:py-6">
	<a class="text-2xl font-extrabold" href="/">Logo</a>
	<nav class="text-md space-x-10 font-bold">
		<a href="/protected" class:active={$page.url.pathname === "/protected"}>Protected</a>
		<a href="/test" class:active={$page.url.pathname === "/test"}>Test</a>
	</nav>
	<div class="flex items-center gap-x-4">
		<ThemeButton />
		{#if user}
			<Button href="/profile" size="xs">Profile</Button>
		{:else}
			<Button href="/login" size="xs">Sign In</Button>
		{/if}
	</div>
</header>

<style lang="postcss">
	.active {
		@apply text-sky-500;
	}
</style>
