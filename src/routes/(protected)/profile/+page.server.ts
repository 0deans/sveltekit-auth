import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { s3Client } from "$lib/server/bucket";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3BUCKET_NAME } from "$env/static/private";
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
	},
	uploadAvatar: async ({ request, locals }) => {
		const { avatar } = Object.fromEntries(await request.formData());
		console.log(avatar);

		if (!avatar || !(avatar instanceof File)) {
			return fail(400, { message: "Invalid avatar" });
		}

		if (!["image/png", "image/jpeg"].includes(avatar.type)) {
			return fail(400, { message: "We only support PNG or JPG pictures" });
		}

		try {
			const buffer = await avatar.arrayBuffer();
			await s3Client.send(
				new PutObjectCommand({
					Bucket: S3BUCKET_NAME,
					Key: locals.user?.id,
					Body: buffer,
					ContentType: avatar.type,
					ACL: "public-read"
				})
			);

			const public_url = `https://s3.tebi.io/${S3BUCKET_NAME}/${locals.user?.id}`;
			await prisma.user.update({
				where: { id: locals.user?.id },
				data: { avatar: public_url }
			});
		} catch (e) {
			return fail(500, { message: "Failed to upload avatar" });
		}
	}
};
