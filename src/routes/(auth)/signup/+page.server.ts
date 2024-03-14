import { error, fail, redirect } from "@sveltejs/kit";
import { Argon2id } from "oslo/password";
import { prisma } from "$lib/server/prisma";
import { Prisma } from "@prisma/client";
import type { PageServerLoad, Actions } from "./$types";
import { registerSchema } from "$lib/schemas";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, "/");
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());

		const user = registerSchema.safeParse(data);
		if (!user.success) {
			return fail(400, {
				email: data.email,
				password: data.password,
				errors: user.error.flatten().fieldErrors
			});
		}

		const hashedPassword = await new Argon2id().hash(user.data.password);

		try {
			await prisma.user.create({
				data: {
					email: user.data.email,
					password: hashedPassword
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === "P2002") {
					return fail(400, {
						email: data.email,
						password: data.password,
						message: "That email address is already in use."
					});
				}
			}

			return error(500, "Internal Server Error");
		}

		return redirect(302, "/login");
	}
};
