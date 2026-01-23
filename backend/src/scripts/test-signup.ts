import dotenv from 'dotenv';
import path from 'path';

// Load env before importing config
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { supabaseAdmin } from '../config/database';

async function testSignup() {
    console.log("Testing Supabase User Creation...");

    const email = `test.user.${Date.now()}@example.com`;
    const password = "TestPassword123!";

    try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                role: 'BRAND',
                firstName: 'Test',
                lastName: 'User'
            }
        });

        if (error) {
            console.error("❌ Registration Failed:", error);
        } else {
            console.log("✅ User created successfully:", data.user.id);
            console.log("Waiting for trigger to insert into public.users...");

            // Allow trigger time to run
            await new Promise(r => setTimeout(r, 1000));

            // Verify public users table
            const { data: userData, error: userError } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (userError || !userData) {
                console.error("❌ Trigger failed to create public user record:", userError);
            } else {
                console.log("✅ Public user record found:", userData);
            }

            // Cleanup
            await supabaseAdmin.auth.admin.deleteUser(data.user.id);
            console.log("User deleted (cleanup).");
        }
    } catch (e) {
        console.error("Unexpected error:", e);
    }
}

testSignup();
