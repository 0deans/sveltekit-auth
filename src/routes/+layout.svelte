<script lang="ts">
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import "../app.css";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="flex min-h-[100%] flex-col">
	<Header user={data.user} />
	<slot />
	<Footer />
</div>
