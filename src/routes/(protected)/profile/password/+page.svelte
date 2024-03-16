<script lang="ts">
	import IconLoader from "~icons/ri/loader-4-line";
	import { enhance } from "$app/forms";
	import type { ActionData, PageData } from "./$types";

	let showPassword = false;
	let isLoading = false;

	export let data: PageData;
	export let form: ActionData;
</script>

<div class="mb-2 border-b border-gray-500 pb-2">
	<h1 class="text-3xl font-semibold">Password</h1>
</div>

{#if !data.hasPassword && !form?.success}
	<p class="mb-4 font-semibold">You don't have a password yet. Please create one.</p>
{/if}

<form
	method="post"
	class="max-w-72 space-y-3"
	use:enhance={() => {
		isLoading = true;
		return async ({ update }) => {
			await update();
			isLoading = false;
		};
	}}
>
	{#if data.hasPassword}
		<div>
			<lable for="current">Curent password</lable>
			<input
				class="input-primary"
				type={showPassword ? "text" : "password"}
				name="current"
				id="current"
				placeholder="Enter your current password"
				required
				value={form?.current ?? ""}
			/>
			{#if form?.errors?.current}
				<span class="text-[.9rem] text-red-600">
					{form?.errors?.current}
				</span>
			{/if}
		</div>
	{/if}
	<div>
		<lable for="password">New password</lable>
		<input
			class="input-primary"
			type={showPassword ? "text" : "password"}
			name="password"
			id="password"
			placeholder="Enter new password"
			required
			value={form?.password ?? ""}
		/>
		{#if form?.errors?.password}
			<span class="text-[.9rem] text-red-600">
				{form?.errors?.password}
			</span>
		{/if}
	</div>
	<div>
		<lable for="confirm">Confirm new password</lable>
		<input
			class="input-primary"
			type={showPassword ? "text" : "password"}
			name="confirm"
			id="confirm"
			placeholder="Confirm new password"
			required
			value={form?.confirm ?? ""}
		/>
		{#if form?.errors?.confirm}
			<span class="text-[.9rem] text-red-600">
				{form?.errors?.confirm}
			</span>
		{/if}
	</div>
	<div class="flex items-center gap-4">
		<input class="h-4 w-4 bg-transparent" type="checkbox" id="hide-password" bind:checked={showPassword} />
		<label for="hide-password">Show password</label>
	</div>
	<button type="submit" class="btn-primary" class:bg-primary-500={form?.success} disabled={isLoading}>
		{#if isLoading}
			<IconLoader class="h-5 animate-spin text-lg" />
		{:else}
			Change password
		{/if}
	</button>
</form>

{#if form?.message}
	<span class={form?.success ? "text-primary-500" : "text-error-500"}>
		{form.message}
	</span>
{/if}
