import { z } from "zod";

const EmailSchema = z.email("Invalid email");

export const SignUpFormDataSchema = z.object({
  email: EmailSchema,
  password: z
    .string("Password is required")
    .min(4, "Must be at least 4 characters"),
  fullName: z
    .string("Fullname is required")
    .min(4, "Must be at least 2 characters"),
});

export const SignInCredsSchema = z.object({
  email: EmailSchema,
  password: z
    .string("Password is required")
    .min(4, "Must be at least 4 characters"),
});

export type SignInCreds = z.infer<typeof SignInCredsSchema>;
export type SignUpFormData = z.infer<typeof SignUpFormDataSchema>;
export type Email = z.infer<typeof EmailSchema>;
