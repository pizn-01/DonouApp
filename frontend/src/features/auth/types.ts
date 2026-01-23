import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    role: z.enum(["BRAND", "MANUFACTURER"]).default("BRAND"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    companyName: z.string().min(2, "Organization name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "BRAND" | "MANUFACTURER" | "ADMIN";
    emailVerified: boolean;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    expiresAt: number;
}
