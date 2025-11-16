import { z } from "zod";

export const EmailSchema = z.email("Invalid email");
export const PasswordSchema = z
  .string("Password is required")
  .min(4, "Must be at least 4 characters");

export const SignUpFormDataSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  fullName: z
    .string("Fullname is required")
    .min(2, "Must be at least 2 characters"),
});

export const SignInCredsSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const MatchUserSchema = z.object({
  email: EmailSchema,
});

export const NewPasswordSchema = z.object({
  password: PasswordSchema,
});

export const GiftSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  terms: z.string(),
  brandTitle: z.string(),
  brandLogoUrl: z.string(),
  imageUrl: z.string(),
  type: z.string(),
  channel: z.string(),
  status: z.string(),
});

export const SearchSchema = z.object({
  input: z.string().optional(),
});

export const UserSchema = z.object({
  email: EmailSchema,
  fullName: z.string().min(2),
  claimedGifts: z.array(GiftSchema).optional(),
});

export type SignInCreds = z.infer<typeof SignInCredsSchema>;
export type SignUpFormData = z.infer<typeof SignUpFormDataSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Password = z.infer<typeof PasswordSchema>;
export type Gift = z.infer<typeof GiftSchema>;
export type Search = z.infer<typeof SearchSchema>;
export type User = z.infer<typeof UserSchema>;
export type MatchUser = z.infer<typeof MatchUserSchema>;
export type NewPassword = z.infer<typeof NewPasswordSchema>;
