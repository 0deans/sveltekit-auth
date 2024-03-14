<script lang="ts">
	import { enhance } from "$app/forms";
	import IconMail from "~icons/uil/envelope";
	import IconKey from "~icons/material-symbols/key";
	import IconEye from "~icons/ph/eye-fill";
	import IconEyeSlash from "~icons/ph/eye-slash-fill";
	import IconLoader from "~icons/ri/loader-4-line";
	import type { ActionData } from "./$types";

	let hidePassword: boolean = true;
	let isLoading: boolean = false;

	export let form: ActionData;
</script>

<div class="flex flex-auto items-center justify-center">
	<form
		class="w-80 space-y-3 font-semibold"
		method="POST"
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
			Create your account
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
				class="input-primary peer pr-10 pl-10"
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
		<button class="btn-primary" type="submit">
			{#if isLoading}
				<IconLoader class="h-5 animate-spin text-lg" />
			{:else}
				Sign Up
			{/if}
		</button>
		{#if form?.message}
			<span class="text-[.9rem] text-red-600">
				{form?.message}
			</span>
		{/if}
		<div class="flex justify-between text-sm">
			<a href="/login" class="hover:text-blue-400">Already have an account?</a>
			<a href="/terms" class="hover:text-blue-400">Terms of service</a>
		</div>
	</form>
</div>
