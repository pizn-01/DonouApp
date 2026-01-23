import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Client for authenticated user operations
export const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: false,
        },
    }
);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export type SupabaseClient = typeof supabase;
export type SupabaseAdminClient = typeof supabaseAdmin;
