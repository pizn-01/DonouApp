/**
 * Script to reset password for test users
 * Run with: npx tsx reset-test-passwords.ts
 */

import { supabase } from './src/config/database';

async function resetPasswords() {
    console.log('Resetting test user passwords...\n');

    const testAccounts = [
        { email: 'brand@test.com', password: 'TestBrand123!' },
        { email: 'manufacturer@test.com', password: 'TestManufacturer123!' }
    ];

    for (const account of testAccounts) {
        console.log(`Resetting password for ${account.email}...`);

        // Get user by email
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users?.users.find(u => u.email === account.email);

        if (user) {
            // Update password
            const { error } = await supabase.auth.admin.updateUserById(
                user.id,
                { password: account.password }
            );

            if (error) {
                console.error(`❌ Error for ${account.email}:`, error.message);
            } else {
                console.log(`✅ Password reset for ${account.email}`);
            }
        } else {
            console.log(`⚠️  ${account.email} not found`);
        }
    }

    console.log('\n✅ Done! You can now login with:');
    console.log('Brand: brand@test.com / TestBrand123!');
    console.log('Manufacturer: manufacturer@test.com / TestManufacturer123!');

    process.exit(0);
}

resetPasswords();
