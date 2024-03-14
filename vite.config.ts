import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: "svelte",
			autoInstall: true
		})
	],
	optimizeDeps: {
		// If you installed Oslo, you must prevent oslo from getting bundled.
		// This is only required when using the oslo/password module.
		exclude: ["oslo"]
	}
});
