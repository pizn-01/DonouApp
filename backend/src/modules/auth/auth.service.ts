import { supabaseAdmin } from '../../config';
import { Errors } from '../../middleware';
import { UserRole } from '../../types';
import {
    RegisterInput,
    LoginInput,
    UpdateBrandProfileInput,
    UpdateManufacturerProfileInput
} from './auth.schemas';

export class AuthService {
    /**
     * Register a new user
     */
    async register(input: RegisterInput) {
        const { email, password, role, companyName } = input;

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm for MVP, enable email verification in production
            user_metadata: { role },
        });

        if (authError) {
            if (authError.message.includes('already registered')) {
                throw Errors.conflict('Email already registered');
            }
            throw Errors.internal(`Registration failed: ${authError.message}`);
        }

        const userId = authData.user.id;

        // Create profile based on role
        if (role === UserRole.BRAND && companyName) {
            await this.createBrandProfile(userId, companyName);
        } else if (role === UserRole.MANUFACTURER && companyName) {
            await this.createManufacturerProfile(userId, companyName);
        }

        // Get user data
        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        return {
            user: userData,
            message: 'Registration successful',
        };
    }

    /**
     * Login user
     */
    async login(input: LoginInput) {
        const { email, password } = input;

        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw Errors.unauthorized('Invalid email or password');
        }

        // Get user profile
        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

        // Get role-specific profile
        let profile = null;
        if (userData?.role === UserRole.BRAND) {
            const { data: brandProfile } = await supabaseAdmin
                .from('brand_profiles')
                .select('*')
                .eq('user_id', data.user.id)
                .single();
            profile = brandProfile;
        } else if (userData?.role === UserRole.MANUFACTURER) {
            const { data: manufacturerProfile } = await supabaseAdmin
                .from('manufacturer_profiles')
                .select('*')
                .eq('user_id', data.user.id)
                .single();
            profile = manufacturerProfile;
        }

        return {
            user: userData,
            profile,
            session: {
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token,
                expiresAt: data.session.expires_at,
            },
        };
    }

    /**
     * Logout user
     */
    async logout(accessToken: string) {
        const { error } = await supabaseAdmin.auth.admin.signOut(accessToken);

        if (error) {
            throw Errors.internal('Logout failed');
        }

        return { message: 'Logged out successfully' };
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string) {
        const { data, error } = await supabaseAdmin.auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error || !data.session) {
            throw Errors.unauthorized('Invalid refresh token');
        }

        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresAt: data.session.expires_at,
        };
    }

    /**
     * Request password reset
     */
    async forgotPassword(email: string) {
        const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
        });

        if (error) {
            // Don't reveal if email exists or not
            console.error('Password reset error:', error);
        }

        // Always return success to prevent email enumeration
        return { message: 'If an account exists, a password reset link has been sent' };
    }

    /**
     * Get current user profile
     */
    async getProfile(userId: string) {
        const { data: userData, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !userData) {
            throw Errors.notFound('User');
        }

        // Get role-specific profile
        let profile = null;
        if (userData.role === UserRole.BRAND) {
            const { data } = await supabaseAdmin
                .from('brand_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            profile = data;
        } else if (userData.role === UserRole.MANUFACTURER) {
            const { data } = await supabaseAdmin
                .from('manufacturer_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            profile = data;
        }

        return { user: userData, profile };
    }

    /**
     * Update brand profile
     */
    async updateBrandProfile(userId: string, input: UpdateBrandProfileInput) {
        const { data, error } = await supabaseAdmin
            .from('brand_profiles')
            .update(input)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw Errors.internal('Failed to update profile');
        }

        return data;
    }

    /**
     * Update manufacturer profile
     */
    async updateManufacturerProfile(userId: string, input: UpdateManufacturerProfileInput) {
        const { data, error } = await supabaseAdmin
            .from('manufacturer_profiles')
            .update({
                business_name: input.businessName,
                capabilities: input.capabilities,
                certifications: input.certifications,
                production_capacity: input.productionCapacity,
                minimum_order_quantity: input.minimumOrderQuantity,
                location: input.location,
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw Errors.internal('Failed to update profile');
        }

        return data;
    }

    /**
     * Create brand profile for new user
     */
    private async createBrandProfile(userId: string, companyName: string) {
        const { error } = await supabaseAdmin
            .from('brand_profiles')
            .insert({
                user_id: userId,
                company_name: companyName,
                industry: 'Other', // Default industry
            });

        if (error) {
            console.error('Failed to create brand profile:', error);
        }
    }

    /**
     * Create manufacturer profile for new user
     */
    private async createManufacturerProfile(userId: string, businessName: string) {
        const { error } = await supabaseAdmin
            .from('manufacturer_profiles')
            .insert({
                user_id: userId,
                business_name: businessName,
                location: 'Not specified',
            });

        if (error) {
            console.error('Failed to create manufacturer profile:', error);
        }
    }
}

export const authService = new AuthService();
