<script lang="ts">
	import { PUBLIC_URL } from "$env/static/public";
	import { Button, Html, Head, Heading, Preview, Container, Text } from "svelte-email";

	export let token: string;
</script>

<Html>
	<Head />
	<Preview preview="Reset your password" />
	<Container class="space-y-4 text-center">
		<Heading as="h1">Someone requested a password reset for your account</Heading>
		<Text>To reset your password, click the link below:</Text>
		<Button
			class="rounded-md bg-blue-500 px-4 py-2 font-semibold text-gray-50"
			href={`${PUBLIC_URL}/reset?token=${token}`}>Click here to reset your password</Button
		>
		<Text>If this was a mistake, just ignore this email and nothing will happen.</Text>
	</Container