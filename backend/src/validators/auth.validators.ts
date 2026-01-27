import { z } from 'zod';

// Signup validation schema
export const signupSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    role: z.enum(['brand', 'manufacturer'], {
        errorMap: () => ({ message: 'Role must be either "brand" or "manufacturer"' }),
    }),
    phone: z.string().optional(),
});

// Login validation schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
