import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log("protected");

	if (!locals.user) {
		throw redirect(302, "/");
	}
};
