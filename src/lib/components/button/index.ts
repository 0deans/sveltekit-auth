import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import Root from "./Button.svelte";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
	base: "rounded-md text-center font-medium text-gray-50 transition-all duration-100 ease-in-out active:scale-[.98] disabled:opacity-50 disabled:dark:opacity-35",
	variants: {
		color: {
			default:
				"border-gray-200 bg-gray-100 text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-50 dark:border-gray-50 dark:bg-gray-50",
			primary: "border-primary-500 bg-primary-500 hover:bg-primary-600",
			secondary: "bg-secondary-500 hover:bg-secondary-600",
			error: "bg-error-500 hover:bg-error-600"
		},
		size: {
			xs: "px-2.5 py-1.5 text-sm",
			sm: "px-3 py-2",
			md: "px-4 py-2.5 text-base",
			lg: "px-5 py-3.5 text-lg"
		},
		outline: {
			true: "border-2 bg-transparent hover:text-gray-50"
		}
	},
	compoundVariants: [
		{
			color: "default",
			outline: true,
			class: "dark:text-gray-50 hover:border-gray-200 dark:hover:text-gray-900 dark:bg-transparent"
		},
		{
			color: "primary",
			outline: true,
			class: "border-primary-500 text-primary-500 hover:border-primary-600"
		},
		{
			color: "secondary",
			outline: true,
			class: "border-secondary-500 text-secondary-500 hover:border-secondary-600"
		},
		{
			color: "error",
			outline: true,
			class: "border-error-500 text-error-500 hover:border-error-600"
		}
	],
	defaultVariants: {
		color: "default",
		size: "md",
		outline: false
	}
});

type Color = VariantProps<typeof buttonVariants>["color"];
type Size = VariantProps<typeof buttonVariants>["size"];
type Outline = VariantProps<typeof buttonVariants>["outline"];

type AnchorElement = HTMLAnchorAttributes & {
	href?: HTMLAnchorAttributes["href"];
	type?: never;
};

type ButtonElement = HTMLButtonAttributes & {
	type?: HTMLButtonAttributes["type"];
	href?: never;
};

type Props = (AnchorElement | ButtonElement) & {
	color?: Color;
	size?: Size;
	outline?: Outline;
};

export { Root as Button, type Props, buttonVariants };
