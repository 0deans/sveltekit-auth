<script lang="ts">
	import IconPhone from "~icons/fluent/phone-20-regular";
	import IconMonitor from "~icons/ph/monitor-bold";
	import { Button } from "$lib/components/button";
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="mb-2 border-b border-gray-500 pb-2">
	<h1 class="text-3xl font-semibold">Sessions</h1>
</div>

<p class="mb-10">
	Here are all the devices that are currently signed in with your account. You can sign out of each
	one individually or all other devices.
	<br />
	<br />
	If you see an entry you don't recognize, sign out of that device and change your password immediately.
</p>

<div class="flex flex-col space-y-4">
	{#each data.sessions as session}
		<div class="flex items-center justify-between rounded-md border border-gray-500 p-2">
			<div class="flex items-center gap-4">
				{#if ["iOS", "Android"].includes(session.os ?? "")}
					<IconPhone class="h-10 w-10" />
				{:else}
					<IconMonitor class="h-10 w-10" />
				{/if}
				<span>{session.os} - {session.browser} &centerdot; {session.createdAt}</span>
				{#if session.current}
					<span class="text-sm font-semibold text-gray-300"> CURRENT DEVICE</span>
				{/if}
			</div>
			<form
				action="?/revoke"
				method="post"
				use:enhance={({ formData }) => {
					formData.append("id", session.id);
				}}
			>
				<Button type="submit" size="xs">Revoke</Button>
			</form>
		</div>
	{/each}
</div>

<form
	class="mt-6 flex flex-col border-t border-gray-500 pt-6"
	action="?/revokeAll"
	method="post"
	use:enhance
>
	<h2 class="font-semibold">SIGN OUT OF ALL KNOWN DEVICES</h2>
	<span class="text-gray-400">You'll have to sign back in on all signed out devices.</span>
	<Button class="mt-5 w-max border" type="submit" size="xs" outline color="error">
		Sign Out All Known Devices
	</Button>
</form>
