import { supabase, supabaseAuth } from '../config/database';
import {
    SignupRequest,
    LoginRequest,
    AuthResponse,
    UserProfile,
    UserWithDetails,
} from '../types/auth.types';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';

export class AuthService {
    /**
     * Register a new user
     */
    async signup(data: SignupRequest): Promise<AuthResponse> {
        const { email, password, full_name, role, phone } = data;

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('user_profiles')
            .select('user_id')
            .eq('user_id', email)
            .single();

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
            email,
            password,
        });

        if (authError || !authData.user) {
            throw new Error(authError?.message || 'Failed to create user');
        }

        // Create user profile
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .insert({
                user_id: authData.user.id,
                role,
                full_name,
                phone: phone || null,
            })
            .select()
            .single();

        if (profileError || !profile) {
            // Rollback: Delete auth user if profile creation fails
            await supabaseAuth.auth.admin.deleteUser(authData.user.id);
            throw new Error('Failed to create user profile');
        }

        // Generate JWT tokens
        const accessToken = generateAccessToken(authData.user.id, email, role);
        const refreshToken = generateRefreshToken(authData.user.id);

        return {
            user: {
                ...profile,
                email,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Login an existing user
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        const { email, password } = data;

        // Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
            email,
            password,
        });

        if (authError || !authData.user) {
            throw new Error('Invalid email or password');
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', authData.user.id)
            .single();

        if (profileError || !profile) {
            throw new Error('User profile not found');
        }

        // Generate JWT tokens
        const accessToken = generateAccessToken(authData.user.id, email, profile.role);
        const refreshToken = generateRefreshToken(authData.user.id);

        return {
            user: {
                ...profile,
                email,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Get current user with details
     */
    async getCurrentUser(userId: string): Promise<UserWithDetails> {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (profileError || !profile) {
            throw new Error('User profile not found');
        }

        // Get user auth data
        const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);

        if (authError || !authData.user) {
            throw new Error('User not found');
        }

        const userWithDetails: UserWithDetails = {
            ...profile,
            email: authData.user.email!,
        };

        // Get role-specific profile
        if (profile.role === 'brand') {
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (brandProfile) {
                userWithDetails.brandProfile = brandProfile;
            }
        } else if (profile.role === 'manufacturer') {
            const { data: manufacturerProfile } = await supabase
                .from('manufacturer_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (manufacturerProfile) {
                userWithDetails.manufacturerProfile = manufacturerProfile;
            }
        }

        return userWithDetails;
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken(userId: string): Promise<string> {
        // Get user profile to include in new token
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (error || !profile) {
            throw new Error('User not found');
        }

        // Get user email
        const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);

        if (authError || !authData.user?.email) {
            throw new Error('User not found');
        }

        return generateAccessToken(userId, authData.user.email, profile.role);
    }

    /**
     * Logout user (handled client-side by removing tokens)
     */
    async logout(userId: string): Promise<void> {
        // In a production app, you might want to:
        // - Invalidate refresh tokens in database
        // - Add tokens to a blocklist
        // For now, this is a no-op as JWT is stateless
        return;
    }
}

export default new AuthService();
