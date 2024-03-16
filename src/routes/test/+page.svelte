<script lang="ts">
	import { render as rd } from "svelte-email";
	import ResetPasswordMail from "$lib/components/ResetPasswordMail.svelte";

	const email = rd({
		template: ResetPasswordMail,
		props: { token: "1234" }
	});
</script>

<div class="mt-12 flex-auto text-center text-2xl">
	<h1>Test Page</h1>
	<p>This is a test page</p>
	{@html email}
</div>
