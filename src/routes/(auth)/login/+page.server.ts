import { fail, redirect } from "@sveltejs/kit";
import { Argon2id } from "oslo/password";
import { prisma } from "$lib/server/prisma";
import { lucia } from "$lib/server/auth";
import { loginSchema } from "$lib/schemas";
import { githubLogin, googleLogin } from "$lib/server/actions";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, "/");
	}
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = Object.fromEntries(await request.formData());

		const user = loginSchema.safeParse(data);
		if (!user.success) {
			return fail(400, {
				email: data.email,
				password: data.password,
				errors: user.error.flatten().fieldErrors
			});
		}

		const existingUser = await prisma.user.findFirst({
			where: {
				email: user.data.email
			}
		});

		if (!existingUser) {
			return fail(400, {
				email: data.email,
				password: data.password,
				message: "Incorrect email or password"
			});
		}

		const validPassword = !!existingUser?.password
			? await new Argon2id().verify(existingUser.password, user.data.password)
			: null;
		if (!validPassword) {
			return fail(400, {
				email: data.email,
				password: data.password,
				message: "Incorrect email or password"
			});
		}

		const userAgent = request.headers.get("user-agent") ?? "";
		const session = await lucia.createSession(existingUser.id, { userAgent });
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		return redirect(302, "/");
	},
	github: githubLogin,
	google: googleLogin
};
