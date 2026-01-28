-- Migration: 20260128000002_add_onboarding_fields
-- Description: Add onboarding completion tracking to user_profiles table
-- Date: 2026-01-28
-- NOTE: These fields are already included in 20260127000001_initial_schema.sql
-- Keeping this file for migration history continuity but disabling operations.

-- ALTER TABLE user_profiles
-- ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
-- ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON user_profiles(onboarding_completed);
