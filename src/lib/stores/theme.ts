import { browser } from "$app/environment";
import { derived, writable } from "svelte/store";

export const modes = ["light", "dark", "system"] as const;
export type Mode = (typeof modes)[number];

export const localStorageKey = "theme";

export const userPrefersMode = createUserPrefersMode();
export const systemMode = createSystemMode();
export const derivedMode = createDerivedMode();

function createUserPrefersMode() {
	const isLocalStorageDefined = typeof localStorage !== "undefined";
	const initialValue = isLocalStorageDefined ? localStorage.getItem(localStorageKey) : null;
	const value = isValidMode(initialValue) ? initialValue : "system";

	const { subscribe, set: _set } = writable<Mode>(value, () => {
		if (!browser) return;
		const handler = (e: StorageEvent) => {
			if (e.key !== "theme") return;
			set(isValidMode(e.newValue) ? e.newValue : value);
		};

		addEventListener("storage", handler);
		return () => removeEventListener("storage", handler);
	});

	function set(value: Mode) {
		_set(value);
		localStorage.setItem(localStorageKey, value);
	}

	return {
		subscribe,
		set
	};
}

function createSystemMode() {
	const { subscribe, set } = writable<"light" | "dark" | undefined>(undefined, () => {
		if (!browser) return;
		const handler = (e: MediaQueryListEvent) => {
			set(e.matches ? "light" : "dark");
		};

		const media = matchMedia("(prefers-color-scheme: light)");
		media.addEventListener("change", handler);
		return () => media.removeEventListener("change", handler);
	});

	function query() {
		if (!browser) return;
		const media = matchMedia("(prefers-color-scheme: light)");
		set(media.matches ? "light" : "dark");
	}

	return {
		subscribe,
		query
	};
}

function createDerivedMode() {
	const { subscribe } = derived(
		[userPrefersMode, systemMode],
		([$userPrefersMode, $systemMode]) => {
			if (!browser) return undefined;

			const derivedMode = $userPrefersMode === "system" ? $systemMode : $userPrefersMode;
			const light = derivedMode === "light";
			document.documentElement.classList[light ? "remove" : "add"]("dark");

			return derivedMode;
		}
	);

	return {
		subscribe
	};
}

export function isValidMode(value: unknown): value is Mode {
	if (typeof value !== "string") return false;
	return modes.includes(value as Mode);
}
