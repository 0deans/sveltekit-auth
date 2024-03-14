import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
};

export const actions: Actions = {
	signout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		return redirect(302, "/login");
	},
	deleteAccount: async (event) => {
		if (!event.locals.user) {
			return fail(401);
		}
		await prisma.user.delete({
			where: {
				id: event.locals.user.id
			}
		});
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		return redirect(302, "/login");
	}
};
