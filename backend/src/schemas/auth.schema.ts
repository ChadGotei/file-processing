import z from "zod";

const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.email({ error: "Either email format is wrong or is missing." }),
    password: z.string().min(8),
    confirmPassword: z.string({ error: "Passwords do not match." }).min(8)
})

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
});

export const authSchema = {
    registerSchema,
    loginSchema
};

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;