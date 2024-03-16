import { resend } from "$lib/server/resend";
import { fail } from "@sveltejs/kit";
import { resetPasswordRequestSchema } from "$lib/schemas";
import { prisma } from "$lib/server/prisma";
import { render } from "svelte-email";
import ResetPasswordMail from "$lib/components/ResetPasswordMail.svelte";
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		const form = resetPasswordRequestSchema.safeParse(data);

		if (!form.success) {
			return fail(400, {
				email: data.email,
				message: "Invalid email"
			});
		}

		const user = await prisma.user.findUnique({
			where: { email: form.data.email }
		});

		if (!user) {
			return fail(404, {
				email: data.email,
				message: "Account not found"
			});
		}

		try {
			const { id } = await prisma.passwordReset.create({
				data: {
					userId: user.id,
					expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
				}
			});

			const html = render({
				template: ResetPasswordMail,
				props: { token: id }
			});

			await resend.emails.send({
				from: "onboarding@resend.dev",
				to: form.data.email,
				subject: "Reset your password",
				html
			});
		} catch (e) {
			return fail(500, {
				email: data.email,
				message: "Failed to send email"
			});
		}

		return { success: true, message: "Email has been sent" };
	}
};
