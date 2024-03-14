import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "$lib/server/prisma";
import { dev } from "$app/environment";
import { GitHub, Google } from "arctic";
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from "$env/static/private";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getSessionAttributes: (attributes) => {
		return {
			userAgent: attributes.userAgent
		};
	},
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			email: attributes.email
		};
	}
});

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	"http://localhost:5173/login/callback/google"
);

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: {
			userAgent: string;
		};
		DatabaseUserAttributes: {
			id: string;
			email: string;
		};
	}
}
