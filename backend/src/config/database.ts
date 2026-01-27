import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Create Supabase client for backend operations
// Using service role key to bypass RLS for server-side operations
export const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

// Create Supabase client for authentication operations
// Using anon key for auth operations that respect RLS
export const supabaseAuth = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
        },
    }
);

export default supabase;
