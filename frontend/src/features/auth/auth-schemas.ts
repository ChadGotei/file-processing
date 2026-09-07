import { z } from "zod";

const email = z.string().trim().email("Enter a valid email address.");
const password = z.string().min(8, "Password must be at least 8 characters.");

export const loginSchema = z.object({
  email,
  password,
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100, "Name must be 100 characters or fewer."),
    email,
    password,
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
