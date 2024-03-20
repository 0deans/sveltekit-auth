<script lang="ts">
	import IconEdit from "~icons/tdesign/edit";
	import IconCross from "~icons/charm/cross";
	import IconLoader from "~icons/ri/loader-4-line";
	import { Button } from "$lib/components/button";
	import { enhance } from "$app/forms";
	import type { PageData, SubmitFunction } from "./$types";
	import { goto, invalidate, invalidateAll } from "$app/navigation";

	const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"].join(",");
	const MAX_UPLOAD_SIZE = 1024 * 1024;
	let selectedFile: File | null;
	let error: string | null;
	let isLoading = false;

	async function handleSelect() {
		let input = document.createElement("input");
		input.type = "file";
		input.multiple = false;
		input.accept = ALLOWED_FILE_TYPES;

		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) return;
			if (file.size > MAX_UPLOAD_SIZE) {
				error = "Please upload a picture smaller than 1 MB.";
				return;
			}
			error = null;
			selectedFile = file;
		};

		input.click();
	}

	const hideModal = () => (selectedFile = null);

	const submitUpload: SubmitFunction = ({ formData, cancel }) => {
		if (!selectedFile) return cancel();
		formData.append("avatar", selectedFile);
		isLoading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case "success":
					selectedFile = null;
					location.reload();
					break;
				case "failure":
					error = result.data?.message ?? null;
					break;
			}
			await update();
			isLoading = false;
		};
	};

	export let data: PageData;
</script>

<div class="mb-2 border-b border-gray-500 pb-2">
	<h1 class="text-3xl font-semibold">Profile</h1>
</div>
<p class="my-2 text-red-500" class:hidden={!error}>{error}</p>
<div class="relative my-6 w-max">
	<img
		src={data.user?.avatar}
		alt="avatar"
		class="h-36 w-36 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent"
	/>
	<button
		on:click={handleSelect}
		class="absolute -right-6 bottom-0 flex rounded-md border border-gray-200 bg-white px-2 py-1 dark:border-gray-500 dark:bg-gray-900"
	>
		<IconEdit class="h-6 w-6" /> Edit
	</button>
</div>
<p>{data.user?.email}</p>
<p>ID: {data.user?.id}</p>
<form method="post" class="space-x-6">
	<Button formaction="?/signout" class="my-4" size="sm" type="submit">Sign out</Button>
	<Button formaction="?/deleteAccount" class="my-4" size="sm" type="submit" color="error" outline>
		Delete Account
	</Button>
</form>

{#if selectedFile}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="fixed inset-0 bg-black opacity-50" on:click={hideModal}></div>
	<div class="modal w-max overflow-hidden rounded-md border border-gray-200 dark:border-gray-500">
		<div
			class="relative mb-4 border-b border-gray-200 bg-gray-50 dark:border-gray-500 dark:bg-gray-600"
		>
			<p class="p-4 font-semibold">Preview of the selected image</p>
			<button on:click={hideModal} class="group absolute right-0 top-0 h-full rounded-tr-md">
				<IconCross class="w-16 text-lg group-hover:text-blue-500" />
			</button>
		</div>
		<img src={URL.createObjectURL(selectedFile)} alt="selected" class="m-4 mt-0 max-w-96" />
		<form
			use:enhance={submitUpload}
			action="?/uploadAvatar"
			method="post"
			class="border-t border-gray-200 p-4 dark:border-gray-500"
		>
			<Button
				type="submit"
				size="xs"
				disabled={isLoading}
				class="grid w-full place-items-center bg-green-700 font-semibold text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600"
			>
				{#if isLoading}
					<IconLoader class="h-5 animate-spin text-lg" />
				{:else}
					Set new profile picture
				{/if}
			</Button>
		</form>
	</div>
{/if}

<style lang="postcss">
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		@apply bg-white dark:bg-gray-900;
	}
</style>
