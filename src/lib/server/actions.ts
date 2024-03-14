import { redirect, type Action } from "@sveltejs/kit";
import { generateCodeVerifier, generateState } from "arctic";
import { github, google } from "./auth";
import { dev } from "$app/environment";

export const githubLogin: Action = async ({ cookies }) => {
	const state = generateState();
	const url = await github.createAuthorizationURL(state, {
		scopes: ["user:email"]
	});

	cookies.set("github_oauth_state", state, {
		path: "/",
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});

	throw redirect(302, url.toString());
};

export const googleLogin: Action = async ({ cookies }) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ["profile", "email"]
	});

	cookies.set("state", state, {
		path: "/",
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10 // 10 minutes
	});

	cookies.set("code_verifier", codeVerifier, {
		path: "/",
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10 // 10 minutes
	});

	throw redirect(302, url.toString());
};
