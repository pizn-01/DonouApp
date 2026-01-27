import { supabase } from './src/config/database';

async function createTestUsersV2() {
    console.log('Creating v2 test users...\n');

    try {
        // Create Brand User
        const brandEmail = 'brand_demo@test.com';
        const brandPass = 'TestBrand123!';

        console.log(`1. Creating Brand user (${brandEmail})...`);
        const { data: brandUser, error: brandAuthError } = await supabase.auth.admin.createUser({
            email: brandEmail,
            password: brandPass,
            email_confirm: true,
            user_metadata: {
                full_name: 'Demo Brand User'
            }
        });

        if (brandAuthError) {
            console.error('Brand (v2) auth error:', brandAuthError);
        } else if (brandUser?.user) {
            console.log('✅ Brand user v2 created:', brandUser.user.id);

            // Create brand profile
            const { error: brandProfileError } = await supabase
                .from('user_profiles')
                .insert({
                    user_id: brandUser.user.id,
                    role: 'brand',
                    full_name: 'Demo Brand User',
                    phone: '+1234567890'
                });

            if (brandProfileError) console.error('Brand profile error:', brandProfileError);

            // Create brand company profile
            const { error: brandCompanyError } = await supabase
                .from('brand_profiles')
                .insert({
                    user_id: brandUser.user.id,
                    company_name: 'Demo Brand Inc.',
                    industry: 'Retail',
                    company_size: '50-200',
                    website: 'https://demobrand.com',
                    description: 'A demo brand company'
                });

            if (brandCompanyError) console.error('Brand company error:', brandCompanyError);
        }

        // Create Manufacturer User
        const mfgEmail = 'manufacturer_demo@test.com';
        const mfgPass = 'TestManufacturer123!';

        console.log(`\n2. Creating Manufacturer user (${mfgEmail})...`);
        const { data: mfgUser, error: mfgAuthError } = await supabase.auth.admin.createUser({
            email: mfgEmail,
            password: mfgPass,
            email_confirm: true,
            user_metadata: {
                full_name: 'Demo Manufacturer User'
            }
        });

        if (mfgAuthError) {
            console.error('Manufacturer (v2) auth error:', mfgAuthError);
        } else if (mfgUser?.user) {
            console.log('✅ Manufacturer user v2 created:', mfgUser.user.id);

            // Create manufacturer profile
            const { error: mfgProfileError } = await supabase
                .from('user_profiles')
                .insert({
                    user_id: mfgUser.user.id,
                    role: 'manufacturer',
                    full_name: 'Demo Manufacturer User',
                    phone: '+1234567891'
                });

            if (mfgProfileError) console.error('Manufacturer profile error:', mfgProfileError);

            // Create manufacturer company profile
            const { error: mfgCompanyError } = await supabase
                .from('manufacturer_profiles')
                .insert({
                    user_id: mfgUser.user.id,
                    company_name: 'Demo Manufacturing Co.',
                    capabilities: [
                        { category: 'Apparel', subcategories: ['T-shirts'] }
                    ],
                    verification_status: 'verified', // Verified!
                    production_capacity: '5000 units/month',
                    year_established: 2022,
                    employee_count: '11-50',
                    description: 'A demo manufacturing company'
                });

            if (mfgCompanyError) console.error('Manufacturer company error:', mfgCompanyError);
        }

        console.log('\n✅ V2 Test users process complete!\n');
        console.log('New Credentials:');
        console.log(`Brand: ${brandEmail} / ${brandPass}`);
        console.log(`Manufacturer: ${mfgEmail} / ${mfgPass}`);

    } catch (error) {
        console.error('Error creating v2 test users:', error);
    }

    process.exit(0);
}

createTestUsersV2();
