<script lang="ts">
	import IconMail from "~icons/uil/envelope";
	import IconKey from "~icons/material-symbols/key";
	import IconLogin from "~icons/material-symbols/login-rounded";
	import IconEye from "~icons/ph/eye-fill";
	import IconEyeSlash from "~icons/ph/eye-slash-fill";
	import IconLoader from "~icons/ri/loader-4-line";
	import IconGithub from "~icons/mdi/github";
	import IconGoogle from "~icons/flat-color-icons/google";
	import { enhance } from "$app/forms";
	import { Button } from "$lib/components/button";
	import { page } from "$app/stores";
	import type { ActionData } from "./$types";

	export let form: ActionData;

	let hidePassword = true;
	let isLoading: boolean = false;

	$: message = form?.message ?? $page.url.searchParams.get("message");
</script>

<div class="flex flex-auto flex-col items-center justify-center">
	<div class="w-80 font-semibold">
		<form
			class="space-y-3"
			method="POST"
			action="?/login"
			autocomplete="off"
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					await update();
					isLoading = false;
				};
			}}
		>
			<h2 class="flex items-center justify-center gap-x-2 text-2xl">
				<IconLogin />
				Login
			</h2>
			<div class="relative">
				<input
					class="input-primary peer pl-10"
					type="email"
					name="email"
					placeholder="Enter your email address"
					required
					value={form?.email ?? ""}
				/>
				<IconMail
					class="pointer-events-none absolute left-3 top-1/2 -mt-2.5 text-lg peer-focus:text-blue-500"
				/>
			</div>
			{#if form?.errors?.email}
				<span class="text-[.9rem] text-red-600">
					{form?.errors?.email}
				</span>
			{/if}
			<div class="relative">
				<input
					class="input-primary peer pl-10 pr-10"
					type={hidePassword ? "password" : "text"}
					name="password"
					placeholder="Enter your password"
					required
					value={form?.password ?? ""}
				/>
				<IconKey
					class="pointer-events-none absolute left-3 top-1/2 -mt-2.5 text-lg peer-focus:text-blue-500"
				/>
				<button
					on:click={() => {
						hidePassword = !hidePassword;
					}}
					type="button"
					class="absolute right-3 top-1/2 -mt-2.5"
				>
					{#if hidePassword}
						<IconEye class="cursor-pointer text-lg text-slate-500" />
					{:else}
						<IconEyeSlash class="cursor-pointer text-lg text-slate-500" />
					{/if}
				</button>
			</div>
			{#if form?.errors?.password}
				<span class="text-[.9rem] text-red-600">
					{form?.errors?.password}
				</span>
			{/if}
			<button class="btn-primary" type="submit" disabled={isLoading}>
				{#if isLoading}
					<IconLoader class="h-5 animate-spin text-lg" />
				{:else}
					Sign In
				{/if}
			</button>
			{#if message}
				<span class="text-[.9rem] text-red-600">{message}</span>
			{/if}
			<div class="flex justify-between text-sm">
				<a href="/signup" class="hover:text-blue-400">Don't have an account?</a>
				<a href="/reset" class="hover:text-blue-400">Forgot password?</a>
			</div>
		</form>
		<form method="post" class="space-y-2">
			<div class="my-2 flex items-center">
				<div class="flex-1 rounded-md border-t-2 border-gray-700"></div>
				<span class="px-2">OR</span>
				<div class="flex-1 rounded-md border-t-2 border-gray-700"></div>
			</div>
			<Button
				formaction="?/github"
				size="xs"
				type="submit"
				class="flex w-full items-center justify-center gap-4 font-bold dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-800"
			>
				<IconGithub class="text-2xl" /> Sign in with Github
			</Button>
			<Button
				formaction="?/google"
				size="xs"
				type="submit"
				class="flex w-full items-center justify-center gap-4 font-bold dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-800"
			>
				<IconGoogle class="text-2xl" /> Sign in with Google
			</Button>
		</form>
	</div>
</div>
