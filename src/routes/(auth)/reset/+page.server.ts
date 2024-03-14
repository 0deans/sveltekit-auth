import type { Actions } from "./$types";

export const actions = {
	default: async () => {
		await new Promise<void>((resolve) => {
			setTimeout(() => resolve(), 2000);
		});
		return { success: true };
	}
} satisfies Actions;
