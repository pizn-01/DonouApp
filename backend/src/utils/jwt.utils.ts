import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JWTPayload, RefreshTokenPayload, UserRole } from '../types/auth.types';

/**
 * Generate JWT access token
 * @param userId - User's unique identifier
 * @param email - User's email
 * @param role - User's role (brand or manufacturer)
 * @returns Signed JWT token
 */
export function generateAccessToken(userId: string, email: string, role: UserRole): string {
    const payload: JWTPayload = {
        userId,
        email,
        role,
    };

    // Use type assertion to bypass strict type checking on expiresIn
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN
    } as jwt.SignOptions);
}

/**
 * Generate JWT refresh token
 * @param userId - User's unique identifier
 * @returns Signed refresh token
 */
export function generateRefreshToken(userId: string): string {
    const payload: RefreshTokenPayload = {
        userId,
    };

    // Use type assertion to bypass strict type checking on expiresIn
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN
    } as jwt.SignOptions);
}

/**
 * Verify and decode JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyAccessToken(token: string): JWTPayload {
    try {
        return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw error;
    }
}

/**
 * Verify and decode refresh token
 * @param token - Refresh token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
        return jwt.verify(token, env.JWT_SECRET) as RefreshTokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw error;
    }
}
