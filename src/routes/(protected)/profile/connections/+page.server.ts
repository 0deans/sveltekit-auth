import { prisma } from "$lib/server/prisma";
import { fail } from "@sveltejs/kit";
import { githubLogin, googleLogin } from "$lib/server/actions";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, parent }) => {
	await parent();
	const userWithConnections = await prisma.user.findFirst({
		where: {
			id: locals.user?.id
		},
		select: {
			password: true,
			Connections: {
				select: {
					id: true,
					provider: true
				}
			}
		}
	});

	return {
		hasPassword: !!userWithConnections?.password,
		connections: userWithConnections?.Connections as { id: string; provider: string }[]
	};
};

export const actions: Actions = {
	disconnect: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		if (!id || typeof id !== "string") {
			return fail(400, { message: "Invalid request" });
		}

		const userWithConnections = await prisma.user.findFirst({
			where: {
				id: locals.user?.id
			},
			include: {
				_count: {
					select: {
						Connections: true
					}
				}
			}
		});

		if (userWithConnections?._count?.Connections === 1 && userWithConnections?.password === null) {
			return fail(400, { message: "You cannot disconnect your last connection" });
		}

		await prisma.connection.delete({
			where: {
				id: id,
				userId: locals.user?.id
			}
		});
	},
	connect: async (event) => {
		const { provider } = Object.fromEntries(await event.request.formData());
		switch (provider) {
			case "github":
				return githubLogin(event);
			case "google":
				return googleLogin(event);
		}
	}
};
