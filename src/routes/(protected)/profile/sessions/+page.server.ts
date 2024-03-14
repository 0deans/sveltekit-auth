import { prisma } from "$lib/server/prisma";
import { fail, redirect } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth";
import UAParser from "ua-parser-js";
import moment from "moment";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, locals }) => {
	await parent();
	const userSessions = await prisma.session.findMany({
		where: {
			userId: locals.user?.id
		}
	});

	const sessions = userSessions.map((session) => {
		let parser = new UAParser(session.userAgent);
		let createdAt = moment(session.createdAt).fromNow();
		return {
			id: session.id,
			createdAt,
			os: parser.getOS().name,
			browser: parser.getBrowser().name,
			current: session.id === locals.session?.id
		};
	});

	return { sessions };
};

export const actions: Actions = {
	revokeAll: async ({ locals, cookies }) => {
		if (!locals.session) return fail(401);
		await lucia.invalidateUserSessions(locals.session.userId);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		redirect(302, "/login");
	},
	revoke: async ({ request, locals, cookies }) => {
		const { id } = Object.fromEntries(await request.formData());
		if (!id || typeof id !== "string") return fail(400);
		await lucia.invalidateSession(id);
		if (id === locals.session?.id) {
			const sessionCookie = lucia.createBlankSessionCookie();
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
			redirect(302, "/login");
		}
	}
};
