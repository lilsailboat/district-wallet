-- Create an admin user in profiles table
INSERT INTO public.profiles (user_id, email, role, first_name, last_name, total_points, referrals_made, card_linked, referral_code)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@districtwalletdc.com',
  'admin',
  'System',
  'Administrator',
  0,
  0,
  false,
  'ADMIN001'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert demo user for auth.users (this will be the admin login)
-- Note: Password will be 'admin123' (hashed)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  aud,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@districtwalletdc.com',
  '$2a$10$3xKnFqwjYoL6xhvvnbwNrOkw6K6xOjZmH6YVoNqGNL3Lx8mPnr6Xm',
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Fix the trigger function to handle user creation properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table with proper error handling
  INSERT INTO public.profiles (user_id, email, role, referral_code, total_points, referrals_made, card_linked)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user'),
    generate_referral_code(),
    0,
    0,
    false
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't prevent user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();