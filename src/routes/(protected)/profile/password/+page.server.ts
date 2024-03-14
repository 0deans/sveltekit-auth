import { changePasswordSchema } from "$lib/schemas";
import { prisma } from "$lib/server/prisma";
import { fail } from "@sveltejs/kit";
import { Argon2id } from "oslo/password";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, parent }) => {
	await parent();
	const user = await prisma.user.findFirst({
		where: {
			id: locals.user?.id
		},
		select: {
			password: true
		}
	});

	return { hasPassword: !!user?.password };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		const form = changePasswordSchema.safeParse(data);
		if (!form.success) {
			return fail(400, {
				current: data.current,
				password: data.password,
				confirm: data.confirm,
				errors: form.error.flatten().fieldErrors
			});
		}

		const user = await prisma.user.findFirst({
			where: {
				id: locals.user?.id
			},
			select: {
				password: true
			}
		});

		const validPassword = !!user?.password
			? await new Argon2id().verify(user.password, form.data.current ?? "")
			: true;

		if (!validPassword) {
			return fail(400, {
				current: data.current,
				password: data.password,
				confirm: data.confirm,
				message: "Incorrect password"
			});
		}

		const password = await new Argon2id().hash(form.data.password);
		await prisma.user.update({
			where: {
				id: locals.user?.id
			},
			data: {
				password
			}
		});

		return { success: true, message: "Your password has been changed successfully" };
	}
};
