/**
 * Script to create test users directly via Supabase Admin API
 * Run with: npx tsx create-test-users.ts
 */

import { supabase } from './src/config/database';

async function createTestUsers() {
    console.log('Creating test users...\n');

    try {
        // Create Brand User
        console.log('1. Creating Brand user...');
        const { data: brandUser, error: brandAuthError } = await supabase.auth.admin.createUser({
            email: 'brand@test.com',
            password: 'TestBrand123!',
            email_confirm: true,
            user_metadata: {
                full_name: 'Test Brand User'
            }
        });

        if (brandAuthError) {
            console.error('Brand auth error:', brandAuthError);
        } else {
            console.log('✅ Brand user created:', brandUser.user.id);

            // Create brand profile
            const { error: brandProfileError } = await supabase
                .from('user_profiles')
                .insert({
                    user_id: brandUser.user.id,
                    role: 'brand',
                    full_name: 'Test Brand User',
                    phone: '+1234567890'
                });

            if (brandProfileError) {
                console.error('Brand profile error:', brandProfileError);
            } else {
                console.log('✅ Brand profile created');
            }

            // Create brand company profile
            const { error: brandCompanyError } = await supabase
                .from('brand_profiles')
                .insert({
                    user_id: brandUser.user.id,
                    company_name: 'Test Brand Inc.',
                    industry: 'Retail',
                    company_size: '50-200',
                    website: 'https://testbrand.com',
                    description: 'A test brand company for development'
                });

            if (brandCompanyError) {
                console.error('Brand company error:', brandCompanyError);
            } else {
                console.log('✅ Brand company profile created');
            }
        }

        console.log('\n2. Creating Manufacturer user...');
        const { data: mfgUser, error: mfgAuthError } = await supabase.auth.admin.createUser({
            email: 'manufacturer@test.com',
            password: 'TestManufacturer123!',
            email_confirm: true,
            user_metadata: {
                full_name: 'Test Manufacturer User'
            }
        });

        if (mfgAuthError) {
            console.error('Manufacturer auth error:', mfgAuthError);
        } else {
            console.log('✅ Manufacturer user created:', mfgUser.user.id);

            // Create manufacturer profile
            const { error: mfgProfileError } = await supabase
                .from('user_profiles')
                .insert({
                    user_id: mfgUser.user.id,
                    role: 'manufacturer',
                    full_name: 'Test Manufacturer User',
                    phone: '+1234567891'
                });

            if (mfgProfileError) {
                console.error('Manufacturer profile error:', mfgProfileError);
            } else {
                console.log('✅ Manufacturer profile created');
            }

            // Create manufacturer company profile
            const { error: mfgCompanyError } = await supabase
                .from('manufacturer_profiles')
                .insert({
                    user_id: mfgUser.user.id,
                    company_name: 'Test Manufacturing Co.',
                    capabilities: [
                        { category: 'Apparel', subcategories: ['T-shirts', 'Hoodies'] },
                        { category: 'Cut & Sew', subcategories: [] }
                    ],
                    production_capacity: '10000 units/month',
                    factory_location: 'Karachi, Pakistan',
                    certifications: [
                        { name: 'ISO 9001', issued_by: 'ISO', expires_at: null }
                    ],
                    year_established: 2020,
                    employee_count: '50-100',
                    website: 'https://testmanufacturer.com',
                    description: 'A test manufacturing company for development'
                });

            if (mfgCompanyError) {
                console.error('Manufacturer company error:', mfgCompanyError);
            } else {
                console.log('✅ Manufacturer company profile created');
            }
        }

        console.log('\n✅ All test users created successfully!\n');
        console.log('Login Credentials:');
        console.log('Brand: brand@test.com / TestBrand123!');
        console.log('Manufacturer: manufacturer@test.com / TestManufacturer123!');

    } catch (error) {
        console.error('Error creating test users:', error);
    }

    process.exit(0);
}

createTestUsers();
