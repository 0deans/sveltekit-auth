import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Segoe UI", "Roboto", "sans-serif", ...defaultTheme.fontFamily.sans]
			},
			colors: {
				gray: {
					50: "#FAFAFB",
					100: "#E8EBED",
					200: "#CFD2D3",
					300: "#9197A1",
					400: "#8E8E8F",
					500: "#353739",
					600: "#272A30",
					700: "#212326",
					800: "#1C1E21",
					900: "#151719"
				},
				primary: {
					50: "#edfff8",
					100: "#d5fff2",
					200: "#aeffe4",
					300: "#70ffd1",
					400: "#2bfdb7",
					500: "#00e599",
					600: "#00c07c",
					700: "#009664",
					800: "#067551",
					900: "#076045"
				},
				secondary: {
					50: "#fef1f7",
					100: "#fee5f1",
					200: "#ffcae5",
					300: "#ffa0ce",
					400: "#ff65ac",
					500: "#fd4391",
					600: "#ee1465",
					700: "#cf074b",
					800: "#ab093e",
					900: "#8e0d37"
				},

				accent: {
					50: "#fefbe8",
					100: "#fff7c2",
					200: "#ffea89",
					300: "#ffd333",
					400: "#fdc112",
					500: "#eca706",
					600: "#cc8002",
					700: "#a35905",
					800: "#86460d",
					900: "#723a11"
				},
				info: {
					50: "#eff9ff",
					100: "#def1ff",
					200: "#b6e5ff",
					300: "#75d3ff",
					400: "#2cbdff",
					500: "#00aaff",
					600: "#0083d4",
					700: "#0068ab",
					800: "#00588d",
					900: "#064974"
				},
				error: {
					50: "#fef2f2",
					100: "#fee2e2",
					200: "#fecaca",
					300: "#fca5a5",
					400: "#f87171",
					500: "#ef4444",
					600: "#dc2626",
					700: "#b91c1c",
					800: "#991b1b",
					900: "#7f1d1d"
				}
			}
		}
	},
	plugins: []
};
