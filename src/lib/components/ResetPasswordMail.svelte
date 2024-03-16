<script lang="ts">
	import { PUBLIC_URL } from "$env/static/public";
	import { Button, Html, Head, Heading, Preview, Container, Text } from "svelte-email";

	export let token: string;
</script>

<Html>
	<Head />
	<Preview preview="Someone requested a password reset for your account" />
	<Container>
		<Heading as="h1">Someone requested a password reset for your account</Heading>
		<Text>To reset your password, click the link below:</Text>
		<Button href={`${PUBLIC_URL}/reset/${token}`}>Click here to reset your password</Button>
		<Text>If this was a mistake, just ignore this email and nothing will happen.</Text>
	</Container>
</Html>
