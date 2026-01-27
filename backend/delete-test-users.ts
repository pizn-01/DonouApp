/**
 * Script to delete test users
 * Run with: npx tsx delete-test-users.ts
 */

import { supabase } from './src/config/database';

async function deleteTestUsers() {
    console.log('Deleting test users...\n');

    const testEmails = ['brand@test.com', 'manufacturer@test.com'];

    for (const email of testEmails) {
        console.log(`Deleting ${email}...`);

        // Get user ID
        const { data: users, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

        if (error) {
            console.error('Error listing users:', error);
            return;
        }

        console.log(`Found ${users.users.length} total users.`);
        // console.log('Users:', users.users.map(u => u.email));

        const user = users?.users.find(u => u.email === email);

        if (user) {
            const { error } = await supabase.auth.admin.deleteUser(user.id);
            if (error) {
                console.error(`Error deleting ${email}:`, error);
            } else {
                console.log(`✅ Deleted ${email}`);
            }
        } else {
            console.log(`⚠️  ${email} not found`);
        }
    }

    console.log('\n✅ Done!');
    process.exit(0);
}

deleteTestUsers();
