import { z } from "zod";

const passwordSchema = z
	.string()
	.min(8, { message: "Must contain at least 8 characters" })
	.max(255, { message: "Must contain at most 255 characters" });

export const loginSchema = z.object({
	email: z.string().email(),
	password: passwordSchema
});

export const registerSchema = z.object({
	email: z.string().email(),
	password: passwordSchema
});

export const resetPasswordRequestSchema = z.object({
	email: z.string().email()
});

export const changePasswordSchema = z
	.object({
		current: passwordSchema.optional(),
		password: passwordSchema,
		confirm: passwordSchema
	})
	.refine((data) => data.password === data.confirm, {
		message: "Passwords don't match",
		path: ["confirm"]
	});
