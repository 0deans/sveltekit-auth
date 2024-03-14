<script lang="ts">
	import IconGithub from "~icons/mdi/github";
	import IconGoogle from "~icons/flat-color-icons/google";
	import { Button } from "$lib/components/button";
	import type { PageData } from "./$types";

	export let data: PageData;

	const Github = data.connections.find((c) => c.provider === "github");
	const Google = data.connections.find((c) => c.provider === "google");

	const Connections = [
		{
			icon: IconGithub,
			name: "github",
			id: Github?.id,
			connected: !!Github
		},
		{
			icon: IconGoogle,
			name: "google",
			id: Google?.id,
			connected: !!Google
		}
	];
</script>

<div class="mb-2 border-b border-gray-500 pb-2">
	<h1 class="text-3xl font-semibold">Connections</h1>
</div>

<p class="mb-4">
	Here you can connect or disconnect your account with different providers. This will allow you to
	sign in with these providers.
</p>

<div class="flex flex-col space-y-4">
	{#each Connections as connection}
		<div class="flex items-center justify-between rounded-md border border-gray-500 p-2">
			<div class="flex items-center gap-4">
				<svelte:component this={connection.icon} class="h-10 w-10" />
				<span class="capitalize">{connection.name}</span>
			</div>
			{#if connection.connected}
				<form action="?/disconnect" method="post">
					<input type="hidden" name="id" value={connection.id} />
					<Button
						type="submit"
						size="xs"
						color="error"
						disabled={data.connections.length === 1 && !data.hasPassword}
					>
						Disconnect
					</Button>
				</form>
			{:else}
				<form action="?/connect" method="post">
					<input type="hidden" name="provider" value={connection.name} />
					<Button type="submit" size="xs">Connect</Button>
				</form>
			{/if}
		</div>
	{/each}
</div>
