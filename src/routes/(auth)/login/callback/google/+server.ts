import { google, lucia } from "$lib/server/auth";
import { prisma } from "$lib/server/prisma";
import { Prisma } from "@prisma/client";
import { OAuth2RequestError } from "arctic";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, cookies, request, locals }) => {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	const storedState = cookies.get("state");
	const storedCodeVerifier = cookies.get("code_verifier");

	if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
		const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const googleUser: GoogleUser = await response.json();

		const existingAccount = await prisma.connection.findFirst({
			where: {
				provider: "google",
				providerUserId: googleUser.sub
			}
		});

		if (locals.user && existingAccount) {
			return new Response(null, {
				status: 400
			});
		}

		if (locals.user) {
			await prisma.connection.create({
				data: {
					provider: "google",
					providerUserId: googleUser.sub,
					user: {
						connect: {
							id: locals.user.id
						}
					}
				}
			});

			return new Response(null, {
				status: 302,
				headers: {
					Location: "/profile/connections"
				}
			});
		}

		const userAgent = request.headers.get("user-agent") ?? "";

		if (existingAccount) {
			const session = await lucia.createSession(existingAccount.userId, { userAgent });
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		} else {
			const { id } = await prisma.user.create({
				data: {
					email: googleUser.email,
					Connections: {
						create: {
							provider: "google",
							providerUserId: googleUser.sub
						}
					}
				}
			});

			const session = await lucia.createSession(id, { userAgent });
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/login"
			}
		});
	} catch (e) {
		if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
			// invalid code
			return new Response(null, {
				status: 400
			});
		} else if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === "P2002") {
				return new Response(null, {
					headers: {
						location: `/login?message=That email address is already in use.`
					},
					status: 302
				});
			}
		}

		return new Response(null, {
			status: 500
		});
	}
};

interface GoogleUser {
	sub: string;
	email: string;
}
