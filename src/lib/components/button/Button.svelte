<script lang="ts">
	import { cn } from "$lib/utils";
	import { buttonVariants, type Props } from ".";

	type $$Props = Props;

	let className: $$Props["class"] = undefined;
	export { className as class };
	export let href: $$Props["href"] = undefined;
	export let type: $$Props["type"] = "button";
	export let color: $$Props["color"] = "default";
	export let size: $$Props["size"] = "md";
	export let outline: $$Props["outline"] = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
	this={href ? "a" : "button"}
	type={href ? undefined : type}
	class={cn(buttonVariants({ color, size, outline, class: className }))}
	{href}
	{...$$restProps}
	on:click
	on:change
	on:keydown
	on:keyup
	on:mouseenter
	on:mouseleave
>
	<slot />
</svelte:element>
