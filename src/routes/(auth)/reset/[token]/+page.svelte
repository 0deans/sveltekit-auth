<script lang="ts">
	import IconLoader from "~icons/ri/loader-4-line";
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";

	export let form: ActionData;

	let showPassword = false;
	let isLoading = false;
</script>

<div class="flex flex-auto flex-col items-center justify-center">
	<form
		method="post"
		class="w-80 space-y-3 font-semibold"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				await update();
				isLoading = false;
			};
		}}
	>
		<h2 class="flex items-center justify-center gap-x-2 text-2xl">Reset your password</h2>
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
			<input
				class="h-4 w-4 bg-transparent"
				type="checkbox"
				id="hide-password"
				bind:checked={showPassword}
			/>
			<label for="hide-password">Show password</label>
		</div>
		<button type="submit" class="btn-primary" disabled={isLoading}>
			{#if isLoading}
				<IconLoader class="h-5 animate-spin text-lg" />
			{:else}
				Change password
			{/if}
		</button>
	</form>
	{#if form?.message}
		<span class="text-error-500">{form.message}</span>
	{/if}
</div>
