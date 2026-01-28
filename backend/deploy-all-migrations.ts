// Supabase Migration Deployment Script
// This script deploys ALL migrations in the 'supabase/migrations' directory
// It relies on a PostgreSQL function named 'exec' being present in your database.

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file');
    process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function deployAllMigrations() {
    try {
        console.log('🚀 Starting database migration deployment...\n');

        const migrationsDir = path.join(__dirname, 'supabase', 'migrations');

        // Get all SQL files and sort them
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Lexicographical sort works for YYYYMMDD prefix

        if (files.length === 0) {
            console.log('⚠️  No migration files found.');
            return;
        }

        console.log(`Found ${files.length} migration files:`);
        files.forEach(f => console.log(` - ${f}`));
        console.log('\n');

        // Execute each migration
        for (const file of files) {
            console.log(`⏳ Executing ${file}...`);
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf-8');

            if (!sql.trim()) {
                console.log(`   ⚠️  Empty file, skipping.`);
                continue;
            }

            // Execute raw SQL via RPC
            // This requires a helper function in Postgres:
            // CREATE OR REPLACE FUNCTION exec(sql text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN EXECUTE sql; END; $$;
            const { error } = await supabase.rpc('exec', { sql });

            if (error) {
                console.error(`\n❌ Failed to execute ${file}:`);
                console.error(error);

                if (error.message?.includes('function exec') && error.message?.includes('does not exist')) {
                    console.error('\nCRITICAL: The "exec" RPC function is missing in your Supabase database.');
                    console.error('Please run the following SQL in your Supabase SQL Editor to enable migrations via this script:');
                    console.error('\nCREATE OR REPLACE FUNCTION exec(sql text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN EXECUTE sql; END; $$;');
                }

                // Allow user to decide if they want to stop or continue? 
                // Usually migrations are sequential dependencies, so we should stop.
                throw new Error(`Migration ${file} failed`);
            }

            console.log(`   ✅ Success\n`);
        }

        console.log('\n✨ All migrations deployed successfully!');

    } catch (err) {
        console.error('\n❌ Deployment failed:', err);
        process.exit(1);
    }
}

deployAllMigrations();
