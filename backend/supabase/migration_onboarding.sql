-- Add onboarding_completed column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update existing users to have true if they already have a profile (optional, but good for cleanup)
UPDATE public.users u
SET onboarding_completed = TRUE
WHERE EXISTS (
  SELECT 1 FROM public.brand_profiles bp WHERE bp.user_id = u.id
) OR EXISTS (
  SELECT 1 FROM public.manufacturer_profiles mp WHERE mp.user_id = u.id
);
