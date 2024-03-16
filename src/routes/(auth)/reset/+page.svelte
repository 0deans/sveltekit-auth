<script lang="ts">
	import IconMail from "~icons/uil/envelope";
	import IconLoader from "~icons/ri/loader-4-line";
	import { enhance } from "$app/forms";
	import { cn } from "$lib/utils";
	import type { ActionData } from "./$types";

	export let form: ActionData;

	let isLoading: boolean = false;
</script>

<div class="flex flex-auto items-center justify-center">
	<form
		method="post"
		class="w-80 space-y-3 text-center font-semibold"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				await update();
				isLoading = false;
			};
		}}
	>
		<h2 class="flex items-center justify-center gap-x-2 text-2xl">Reset your password</h2>
		<div class="relative">
			<input
				class="input-primary peer pl-10"
				type="email"
				name="email"
				placeholder="Enter your email address"
				required
			/>
			<IconMail
				class="pointer-events-none absolute left-3 top-1/2 -mt-2.5 text-lg peer-focus:text-blue-500"
			/>
		</div>
		<button class="btn-primary" type="submit">
			{#if isLoading}
				<IconLoader class="h-5 animate-spin text-lg" />
			{:else}
				Send password reset email
			{/if}
		</button>
		{#if form?.message}
			<span class={cn("text-[.9rem] text-red-600", { "text-primary-500": form.success })}>
				{form.message}
			</span>
		{/if}
	</form>
</div>
