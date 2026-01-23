import dotenv from 'dotenv';
import path from 'path';

// Load env before importing config
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { supabaseAdmin } from '../config/database';

async function verifySchema() {
    console.log("Verifying 'users' table schema...");

    // Try to select the new columns
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('first_name, last_name')
        .limit(1);

    if (error) {
        console.error("❌ Schema Verification Failed:");
        console.error(JSON.stringify(error, null, 2));
        console.log("\nThis likely means the migration.sql script was NOT run successfully.");
        console.log("Missing columns: first_name, last_name");
    } else {
        console.log("✅ Schema Verification Passed!");
        console.log("Columns 'first_name' and 'last_name' exist in 'users' table.");
    }
}

verifySchema();
