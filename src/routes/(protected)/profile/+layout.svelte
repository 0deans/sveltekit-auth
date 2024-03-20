<script>
	import IconUser from "~icons/ph/user";
	import IconAntenna from "~icons/f7/antenna-radiowaves-left-right";
	import IconApps from "~icons/octicon/apps-16";
	import IconKey from "~icons/octicon/key-16";
	import { page } from "$app/stores";
</script>

<main class="mt-16 flex flex-auto space-x-6 sm:justify-center">
	<nav class="text-md ml-4 w-full max-w-44 space-y-2 font-bold">
		<a class:active={$page.url.pathname === "/profile"} href="/profile"><IconUser /> Profile</a>
		<a class:active={$page.url.pathname === "/profile/password"} href="/profile/password">
			<IconKey /> Password
		</a>
		<a class:active={$page.url.pathname === "/profile/sessions"} href="/profile/sessions">
			<IconAntenna /> Sessions
		</a>
		<a class:active={$page.url.pathname === "/profile/connections"} href="/profile/connections">
			<IconApps /> Connections
		</a>
	</nav>
	<div class="w-full max-w-[800px]">
		<slot />
	</div>
</main>

<style lang="postcss">
	a {
		@apply relative flex items-center gap-2 rounded-md p-2 text-sm;
	}
	a:hover {
		@apply bg-gray-200 dark:bg-gray-500;
	}
	a.active {
		@apply bg-gray-100 dark:bg-gray-600;
	}
	a.active::after {
		content: "";
		@apply absolute -left-2 h-5 w-1 rounded-md bg-blue-600;
	}
</style>
