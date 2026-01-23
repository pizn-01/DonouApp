import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3000').transform(Number),

    // Supabase
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // JWT
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    // OpenAI
    OPENAI_API_KEY: z.string().min(1),
    OPENAI_MODEL: z.string().default('gpt-4'),

    // CORS
    CORS_ORIGIN: z.string().default('http://localhost:5173'),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
    RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
});

const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missing = error.issues.map((issue) => issue.path.join('.')).join(', ');
            console.error(`❌ Missing or invalid environment variables: ${missing}`);
            console.error('Please check your .env file against .env.example');
        }
        throw error;
    }
};

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;
