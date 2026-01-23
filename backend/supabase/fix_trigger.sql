-- Fix for SECURITY DEFINER search_path issue
-- We must explicitly qualify user_role with 'public'

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    -- Case 1: Try to cast to public.user_role. If fails (e.g. invalid value), the transaction aborts. 
    -- Ideally we should sanitize, but for now we assume 'BRAND' or 'MANUFACTURER' are sent correctly.
    -- We default to 'BRAND' if null.
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'BRAND'::public.user_role),
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
