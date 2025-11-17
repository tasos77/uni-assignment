import { z } from "zod";

// Validation schema for email
export const EmailSchema = z.email("Invalid email");

// Validation schema for password
export const PasswordSchema = z
  .string("Password is required")
  .min(4, "Must be at least 4 characters");

// Validation schema for sign-up form data
export const SignUpFormDataSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  fullName: z
    .string("Fullname is required")
    .min(2, "Must be at least 2 characters"),
});

// Validation schema for sign-in credentials
export const SignInCredsSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

// Validation schema for match user request
export const MatchUserSchema = z.object({
  email: EmailSchema,
});

// Validation schema for new password
export const NewPasswordSchema = z.object({
  password: PasswordSchema,
});

// Validation schema for gift
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

// Validation schema for search
export const SearchSchema = z.object({
  input: z.string().optional(),
});

// Validation schema for user
export const UserSchema = z.object({
  email: EmailSchema,
  fullName: z.string().min(2),
  claimedGifts: z.array(GiftSchema).optional(),
});

// Type definitions inferred from schemas
export type SignInCreds = z.infer<typeof SignInCredsSchema>;
export type SignUpFormData = z.infer<typeof SignUpFormDataSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Password = z.infer<typeof PasswordSchema>;
export type Gift = z.infer<typeof GiftSchema>;
export type Search = z.infer<typeof SearchSchema>;
export type User = z.infer<typeof UserSchema>;
export type MatchUser = z.infer<typeof MatchUserSchema>;
export type NewPassword = z.infer<typeof NewPasswordSchema>;
