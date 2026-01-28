import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    role: z.enum(["brand", "manufacturer"]).default("brand"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    companyName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
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
    user_id: string;
    email: string;
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    role: "brand" | "manufacturer";
    onboarding_completed: boolean;
    onboarding_completed_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
