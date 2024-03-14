import { github, lucia } from "$lib/server/auth";
import { prisma } from "$lib/server/prisma";
import { OAuth2RequestError } from "arctic";
import { Prisma } from "@prisma/client";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, cookies, request, locals }) => {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies.get("github_oauth_state") ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

		const existingAccount = await prisma.connection.findFirst({
			where: {
				provider: "github",
				providerUserId: String(githubUser.id)
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
					provider: "github",
					providerUserId: String(githubUser.id),
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
			const gitHubUserEmails = await fetch("https://api.github.com/user/emails", {
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`
				}
			});

			const emails: GitHubUserEmails[] = await gitHubUserEmails.json();
			const primaryEmail = emails.filter((email) => email.primary)[0];

			const { id } = await prisma.user.create({
				data: {
					email: primaryEmail.email,
					Connections: {
						create: {
							provider: "github",
							providerUserId: String(githubUser.id)
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

interface GitHubUser {
	id: number;
}

interface GitHubUserEmails {
	email: string;
	primary: boolean;
}
