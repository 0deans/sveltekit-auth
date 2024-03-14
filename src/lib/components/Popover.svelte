<script lang="ts">
	import { cn } from "$lib/utils";
	import { onMount } from "svelte";
	let open = false;
	let el: HTMLElement;
	export let position: "right" | "left" = "right";

	onMount(() => {
		function handleClickOutside(e: MouseEvent) {
			if (el && !el.contains(e.target as Node)) {
				open = false;
			}
		}

		function handleEscape(e: KeyboardEvent) {
			if (e.key === "Escape") {
				open = false;
			}
		}

		document.addEventListener("click", handleClickOutside);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("click", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	});
</script>

<div class="relative" bind:this={el}>
	<button on:click={() => (open = !open)}>
		<slot name="trigger" />
	</button>

	{#if open}
		<div class={cn("absolute", { "right-0": position === "right", "left-0": position === "left" })}>
			<slot name="content" />
		</div>
	{/if}
</div>
