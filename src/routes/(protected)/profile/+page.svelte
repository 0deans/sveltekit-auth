<script lang="ts">
	import { Button } from "$lib/components/button";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="mb-2 border-b border-gray-500 pb-2">
	<h1 class="text-3xl font-semibold">Profile</h1>
</div>
<p>{data.user?.email}</p>
<p>ID: {data.user?.id}</p>
<form method="post" class="space-x-6">
	<Button formaction="?/signout" class="my-4" size="sm" type="submit">
		Sign out
	</Button>
	<Button formaction="?/deleteAccount" class="my-4" size="sm" type="submit" color="error" outline>
		Delete Account
	</Button>
</form>
