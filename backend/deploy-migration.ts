// Supabase Migration Deployment Script
// This script deploys the initial schema migration to your Supabase project

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function deployMigration() {
    try {
        console.log('🚀 Starting database migration deployment...\n');

        // Read the migration file
        const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20260127000001_initial_schema.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        console.log('📄 Migration file loaded successfully');
        console.log(`📊 SQL content size: ${migrationSQL.length} characters\n`);

        // Execute the migration
        console.log('⏳ Executing migration...');

        // Note: This uses the service role key to execute raw SQL
        // In production, you would typically use Supabase CLI: npx supabase db push

        const { data, error } = await supabase.rpc('exec', { sql: migrationSQL });

        if (error) {
            console.error('❌ Migration failed:', error);
            throw error;
        }

        console.log('\n✅ Migration executed successfully!');
        console.log('\n🔍 Verifying deployment...\n');

        // Verify tables were created
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .order('table_name');

        if (tablesError) {
            console.error('⚠️  Could not verify tables:', tablesError);
        } else {
            console.log('📋 Created tables:');
            tables.forEach((table: any) => console.log(`   - ${table.table_name}`));
        }

        console.log('\n✨ Deployment complete!');

    } catch (err) {
        console.error('\n❌ Deployment failed:', err);
        process.exit(1);
    }
}

// Run the deployment
deployMigration();
