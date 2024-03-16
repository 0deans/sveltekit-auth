import { changePasswordSchema } from "$lib/schemas";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { Argon2id } from "oslo/password";
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ params, request }) => {
		const data = Object.fromEntries(await request.formData());

		const form = changePasswordSchema.safeParse(data);
		if (!form.success) {
			return fail(400, {
				password: data.password,
				confirm: data.confirm,
				errors: form.error.flatten().fieldErrors
			});
		}

		const resetRequest = await prisma.passwordReset.findUnique({
			where: { id: params.token }
		});

		if (!resetRequest) {
			return fail(404, { message: "Invalid token" });
		}

		if (resetRequest.expiresAt < new Date()) {
			return fail(400, { message: "Reset token has expired" });
		}

		try {
			const hashedPassword = await new Argon2id().hash(form.data.password);
			await prisma.user.update({
				where: { id: resetRequest.userId },
				data: {
					password: hashedPassword
				}
			});

			await prisma.passwordReset.deleteMany({
				where: { userId: resetRequest.userId }
			});
		} catch (e) {
			return fail(500, { message: "Failed to change password" });
		}

		redirect(302, "/login");
	}
};
